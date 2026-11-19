<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng trung gian booking_services — tách quan hệ N:N giữa bookings và services. */
    public function up(): void
    {
        Schema::create('booking_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            // RESTRICT: dịch vụ đã từng được đặt thì không xóa cứng, tránh mất lịch sử
            $table->foreignId('service_id')->constrained('services')->restrictOnDelete();
            $table->decimal('price_at_booking', 12, 2);           // Giá chốt tại thời điểm đặt
            $table->unsignedInteger('duration_at_booking');       // Thời lượng chốt tại thời điểm đặt
            $table->timestamps();

            $table->unique(['booking_id', 'service_id']);         // Một dịch vụ không lặp trong cùng lịch
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement('ALTER TABLE booking_services
                ADD CONSTRAINT chk_bs_price CHECK (price_at_booking >= 0),
                ADD CONSTRAINT chk_bs_duration CHECK (duration_at_booking > 0)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_services');
    }
};
