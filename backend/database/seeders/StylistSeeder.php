<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Đổ danh sách stylist của từng salon. "8 năm" -> experience_years = 8. */
class StylistSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $rows = [];

        foreach (SeedData::json('salons') as $salon) {
            foreach ($salon['stylists'] as $st) {
                $rows[] = [
                    'salon_id' => $salon['id'],
                    'name' => $st['name'],
                    'experience_years' => (int) filter_var($st['experience'], FILTER_SANITIZE_NUMBER_INT) ?: null,
                    'phone' => null,
                    'avatar' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('stylists')->insert($rows);
    }
}
