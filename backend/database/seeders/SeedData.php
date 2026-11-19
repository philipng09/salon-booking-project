<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Tiện ích dùng chung cho các Seeder:
 *  - đọc file JSON trong database/data (xuất từ js/products.js, js/hairmodels.js);
 *  - ánh xạ mã chuỗi của Frontend (s1_1, st1_1) sang id số trong CSDL;
 *  - tạo một lịch hẹn kèm các dòng booking_services (chốt giá + thời lượng).
 */
class SeedData
{
    /** @var array<string, array> Bộ nhớ đệm để mỗi file JSON chỉ đọc một lần */
    private static array $cache = [];

    public static function json(string $name): array
    {
        if (! isset(self::$cache[$name])) {
            $path = database_path("data/{$name}.json");
            if (! is_file($path)) {
                throw new RuntimeException("Thiếu {$path}. Chạy: node scripts/export-seed-data.cjs");
            }
            self::$cache[$name] = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        }

        return self::$cache[$name];
    }

    /** Salon trong products.js theo id */
    public static function salon(int $salonId): array
    {
        foreach (self::json('salons') as $salon) {
            if ((int) $salon['id'] === $salonId) {
                return $salon;
            }
        }
        throw new RuntimeException("Không có salon id={$salonId} trong salons.json");
    }

    /** Email tài khoản mẫu của khách viết đánh giá, sinh từ họ tên: "Trần Thị Liễu" -> tran.thi.lieu@... */
    public static function reviewerEmail(string $fullName): string
    {
        return Str::slug($fullName, '.').'@salonbook.test';
    }

    /** Mã dịch vụ Frontend (VD "s1_4") -> services.id */
    public static function serviceId(int $salonId, string $jsId): int
    {
        $item = collect(self::salon($salonId)['servicesList'])->firstWhere('id', $jsId)
            ?? throw new RuntimeException("Không có dịch vụ {$jsId} ở salon {$salonId}");

        return DB::table('services')->where('salon_id', $salonId)->where('name', $item['name'])->value('id');
    }

    /** Mã stylist Frontend (VD "st1_1") -> stylists.id */
    public static function stylistId(int $salonId, string $jsId): int
    {
        $item = collect(self::salon($salonId)['stylists'])->firstWhere('id', $jsId)
            ?? throw new RuntimeException("Không có stylist {$jsId} ở salon {$salonId}");

        return DB::table('stylists')->where('salon_id', $salonId)->where('name', $item['name'])->value('id');
    }

    /**
     * Tạo booking + booking_services trong một transaction.
     * total_price và end_time được TÍNH từ bảng services, không nhập tay.
     *
     * @param  int[]  $serviceIds  services.id (đã ánh xạ)
     */
    public static function createBooking(
        int $userId, int $salonId, ?int $stylistId, string $date, string $startTime,
        array $serviceIds, string $status, ?Carbon $createdAt = null
    ): int {
        return DB::transaction(function () use ($userId, $salonId, $stylistId, $date, $startTime, $serviceIds, $status, $createdAt) {
            $services = DB::table('services')
                ->whereIn('id', $serviceIds)
                ->where('salon_id', $salonId)   // dịch vụ phải thuộc đúng salon của lịch
                ->get(['id', 'price', 'duration']);

            if ($services->count() !== count($serviceIds)) {
                throw new RuntimeException("Dịch vụ không thuộc salon {$salonId}");
            }

            $start = Carbon::parse("{$date} {$startTime}");
            $end = $start->copy()->addMinutes((int) $services->sum('duration'));
            $createdAt ??= now();

            $bookingId = DB::table('bookings')->insertGetId([
                'user_id' => $userId,
                'salon_id' => $salonId,
                'stylist_id' => $stylistId,
                'booking_date' => $date,
                'start_time' => $start->format('H:i:s'),
                'end_time' => $end->format('H:i:s'),
                'total_price' => $services->sum('price'),
                'status' => $status,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            DB::table('booking_services')->insert($services->map(fn ($s) => [
                'booking_id' => $bookingId,
                'service_id' => $s->id,
                'price_at_booking' => $s->price,       // chốt giá tại thời điểm đặt
                'duration_at_booking' => $s->duration, // chốt thời lượng tại thời điểm đặt
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ])->all());

            return $bookingId;
        });
    }
}
