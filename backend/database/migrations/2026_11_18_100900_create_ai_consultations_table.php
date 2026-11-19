<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng ai_consultations — lịch sử tư vấn kiểu tóc bằng AI. */
    public function up(): void
    {
        Schema::create('ai_consultations', function (Blueprint $table) {
            $table->id();
            // NULLABLE: Guest được dùng thử AI mà không cần tài khoản (xem mục 4.1.2.1, ý 7)
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('uploaded_image');                     // Ảnh chân dung người dùng tải lên
            $table->string('recommended_style')->nullable();      // Kiểu tóc AI đề xuất
            $table->string('result_image')->nullable();           // Ảnh kết quả thử kiểu/màu
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_consultations');
    }
};
