<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Thứ tự gọi tuân theo phụ thuộc khóa ngoại:
     * users -> salons -> services, stylists -> bookings (giỏ dịch vụ) -> reviews -> blogs -> hair_models.
     * Chạy: php artisan migrate:fresh --seed
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SalonSeeder::class,
            ServiceSeeder::class,
            StylistSeeder::class,
            BookingSeeder::class,
            ReviewSeeder::class,
            BlogSeeder::class,
            HairModelSeeder::class,
        ]);
    }
}
