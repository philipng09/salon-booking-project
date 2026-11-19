<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Đổ reviewsList. Vì reviews.booking_id là bắt buộc và UNIQUE (chỉ đánh giá lịch
 * đã hoàn thành), mỗi đánh giá được tạo kèm một booking "completed" trước đó.
 */
class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        foreach (SeedData::json('salons') as $salon) {
            foreach ($salon['reviewsList'] as $rv) {
                $userId = DB::table('users')->where('email', SeedData::reviewerEmail($rv['userName']))->value('id');
                $stylist = $salon['stylists'][0];
                $service = $salon['servicesList'][0];
                $reviewedAt = Carbon::parse($rv['date'].' 20:00:00');

                // Lịch đã hoàn thành vào ngày khách viết đánh giá
                $bookingId = SeedData::createBooking(
                    userId: $userId,
                    salonId: $salon['id'],
                    stylistId: SeedData::stylistId($salon['id'], $stylist['id']),
                    date: $rv['date'],
                    startTime: $stylist['availableHours'][0],
                    serviceIds: [SeedData::serviceId($salon['id'], $service['id'])],
                    status: 'completed',
                    createdAt: $reviewedAt->copy()->subDays(2),
                );

                DB::table('reviews')->insert([
                    'user_id' => $userId,
                    'salon_id' => $salon['id'],
                    'booking_id' => $bookingId,
                    'rating' => $rv['rating'],
                    'comment' => $rv['comment'],
                    'created_at' => $reviewedAt,
                    'updated_at' => $reviewedAt,
                ]);
            }
        }
    }
}
