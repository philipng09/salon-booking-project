<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Đổ 10 salon từ products.js. Giữ nguyên id 1..10 để khớp salonId ở Frontend. */
class SalonSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        foreach (SeedData::json('salons') as $s) {
            $hours = $s['openingHours'];
            $openingHours = "{$hours['days']}, {$hours['open']} - {$hours['close']}"
                .($hours['closedDays'] ? ' (nghỉ '.implode(', ', $hours['closedDays']).')' : '');

            DB::table('salons')->insert([
                'id' => $s['id'],
                'owner_id' => DB::table('users')->where('email', "owner{$s['id']}@salonbook.test")->value('id'),
                'name' => $s['name'],
                'slug' => $s['slug'],
                'address' => $s['address'],
                'district' => $s['districtName'],
                'phone' => null,
                'description' => $s['description'],
                'image' => $s['image'],
                'opening_hours' => $openingHours,
                'salon_type' => $s['salonType'],
                'latitude' => $s['lat'],
                'longitude' => $s['lng'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
