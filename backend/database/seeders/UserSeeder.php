<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Tạo tài khoản mẫu cho cả 3 vai trò. Mật khẩu chung "password" — CHỈ dùng môi trường dev.
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $password = Hash::make('password');   // băm một lần, dùng chung cho mọi tài khoản mẫu
        $users = [];

        // 1) Quản trị viên nền tảng + 2 khách hàng dùng để demo giỏ dịch vụ/đặt lịch
        $users[] = ['full_name' => 'Quản trị SalonBook', 'email' => 'admin@salonbook.test', 'phone' => '0900000000', 'role' => 'admin'];
        $users[] = ['full_name' => 'Nguyễn Khách Hàng', 'email' => 'customer@salonbook.test', 'phone' => '0911111111', 'role' => 'customer'];
        $users[] = ['full_name' => 'Trần Minh Anh', 'email' => 'customer2@salonbook.test', 'phone' => '0922222222', 'role' => 'customer'];

        // 2) Mỗi salon trong products.js có một chủ salon riêng: owner1@..., owner2@...
        foreach (SeedData::json('salons') as $salon) {
            $users[] = [
                'full_name' => 'Chủ '.$salon['name'],
                'email' => "owner{$salon['id']}@salonbook.test",
                'phone' => null,
                'role' => 'salon_owner',
            ];
        }

        // 3) Khách đã viết đánh giá trong reviewsList -> tài khoản customer tương ứng
        $reviewers = collect(SeedData::json('salons'))->pluck('reviewsList')->flatten(1)->pluck('userName')->unique();
        foreach ($reviewers as $name) {
            $users[] = ['full_name' => $name, 'email' => SeedData::reviewerEmail($name), 'phone' => null, 'role' => 'customer'];
        }

        DB::table('users')->insert(array_map(fn ($u) => $u + [
            'password_hash' => $password,
            'email_verified_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ], $users));
    }
}
