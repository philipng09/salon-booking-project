<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Đổ bảng giá dịch vụ (servicesList) của từng salon. */
class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $rows = [];

        foreach (SeedData::json('salons') as $salon) {
            foreach ($salon['servicesList'] as $sv) {
                $rows[] = [
                    'salon_id' => $salon['id'],
                    'name' => $sv['name'],
                    'category' => $sv['value'],     // cat-tao-kieu | nhuom-toc | goi-thu-gian | phuc-hoi-toc
                    'price' => $sv['price'],
                    'duration' => $sv['duration'],
                    'description' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('services')->insert($rows);
    }
}
