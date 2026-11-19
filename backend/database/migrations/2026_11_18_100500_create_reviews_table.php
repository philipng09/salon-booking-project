<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng reviews — đánh giá gắn với một lịch hẹn đã hoàn thành. */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('salon_id')->constrained('salons')->cascadeOnDelete();
            // UNIQUE: mỗi lịch hẹn chỉ được đánh giá một lần
            $table->foreignId('booking_id')->unique()->constrained('bookings')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');                // 1..5 sao
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->index(['salon_id', 'rating']);                // Tính điểm trung bình theo salon
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement('ALTER TABLE reviews
                ADD CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
