<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng salons — mỗi salon thuộc về một chủ salon (users.role = salon_owner). */
    public function up(): void
    {
        Schema::create('salons', function (Blueprint $table) {
            $table->id();
            // FK owner_id -> users.id; RESTRICT: không xóa được chủ salon khi còn salon
            $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $table->string('name');
            $table->string('address');
            $table->string('phone', 20)->nullable();
            $table->text('description')->nullable();
            $table->string('opening_hours')->nullable();          // VD: "Thứ Hai - Chủ Nhật, 09:00 - 20:00"
            $table->string('salon_type', 20)->default('unisex');  // nam | nu | unisex — dùng cho bộ lọc
            $table->timestamps();

            $table->index('salon_type');
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement("ALTER TABLE salons ADD CONSTRAINT chk_salons_type
                CHECK (salon_type IN ('nam', 'nu', 'unisex'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('salons');
    }
};
