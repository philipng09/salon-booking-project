<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Chuyển các giỏ dịch vụ mẫu (cùng cấu trúc item của js/cart.js:
 * salonId, serviceId, stylistId, date, time) thành lịch hẹn thật.
 * Mỗi giỏ của một salon -> 1 booking; nhiều dịch vụ -> nhiều dòng booking_services.
 */
class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // Ngày tính tương đối so với hôm nay để lịch mẫu luôn nằm ở tương lai khi demo
        $today = Carbon::today('Asia/Ho_Chi_Minh');

        foreach (SeedData::json('cart_samples') as $cart) {
            $salonId = $cart['salonId'];

            SeedData::createBooking(
                userId: DB::table('users')->where('email', $cart['customer'])->value('id'),
                salonId: $salonId,
                stylistId: SeedData::stylistId($salonId, $cart['stylistId']),
                date: $today->copy()->addDays($cart['daysFromToday'])->toDateString(),
                startTime: $cart['time'],
                serviceIds: array_map(fn ($id) => SeedData::serviceId($salonId, $id), $cart['serviceIds']),
                status: $cart['status'],
            );
        }
    }
}
