<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Đổ tin tuyển mẫu tóc từ hairmodels.js và 2 đơn ứng tuyển mẫu. */
class HairModelSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        foreach (SeedData::json('hair_models') as $hm) {
            DB::table('hair_models')->insert([
                'salon_id' => $hm['salonId'],
                'title' => $hm['title'],
                // ERD chưa có cột riêng cho yêu cầu/chi phí -> gộp vào mô tả
                'description' => "Dịch vụ: {$hm['serviceName']}. Yêu cầu: {$hm['requirement']} Chi phí: {$hm['cost']}.",
                'image' => null,
                'slots' => $hm['slots'],
                'deadline' => $hm['deadline'],
                'status' => $hm['status'] === 'Đang tuyển' ? 'active' : 'closed',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $customer = DB::table('users')->where('email', 'customer@salonbook.test')->value('id');
        $firstTwo = DB::table('hair_models')->orderBy('id')->limit(2)->pluck('id');

        DB::table('hair_model_applications')->insert([
            ['hair_model_id' => $firstTwo[0], 'user_id' => $customer, 'status' => 'pending', 'created_at' => $now, 'updated_at' => $now],
            ['hair_model_id' => $firstTwo[1], 'user_id' => $customer, 'status' => 'approved', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
