<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Đổ 6 bài viết đang hiển thị ở blog.html, tác giả là tài khoản admin. */
class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $authorId = DB::table('users')->where('email', 'admin@salonbook.test')->value('id');

        DB::table('blogs')->insert(array_map(fn ($b) => [
            'author_id' => $authorId,
            'title' => $b['title'],
            'content' => $b['content'],
            'image' => $b['image'],
            'created_at' => $b['published_at'],   // giữ đúng ngày đăng trên giao diện
            'updated_at' => $b['published_at'],
        ], SeedData::json('blogs')));
    }
}
