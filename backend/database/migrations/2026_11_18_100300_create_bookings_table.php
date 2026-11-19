<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng bookings — một lịch hẹn của khách tại MỘT salon. */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            // RESTRICT: giữ lịch sử giao dịch, không cho xóa khách/salon đang có lịch hẹn
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('salon_id')->constrained('salons')->restrictOnDelete();
            // SET NULL: stylist nghỉ việc thì lịch cũ vẫn còn, chỉ mất liên kết người thực hiện
            $table->foreignId('stylist_id')->nullable()->constrained('stylists')->nullOnDelete();
            $table->date('booking_date');
            $table->time('start_time');
            $table->time('end_time');                             // = start_time + tổng thời lượng dịch vụ
            $table->decimal('total_price', 12, 2)->default(0);    // = tổng booking_services.price_at_booking
            $table->string('status', 20)->default('pending');     // pending | confirmed | completed | cancelled
            $table->timestamps();

            // Phục vụ truy vấn lịch theo ngày của salon và kiểm tra trùng giờ của stylist
            $table->index(['salon_id', 'booking_date']);
            $table->index(['stylist_id', 'booking_date', 'start_time']);
            $table->index('status');
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement("ALTER TABLE bookings
                ADD CONSTRAINT chk_bookings_status
                    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
                ADD CONSTRAINT chk_bookings_total CHECK (total_price >= 0),
                ADD CONSTRAINT chk_bookings_time CHECK (end_time > start_time)");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
