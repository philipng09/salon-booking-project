<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migration mở rộng — bổ sung các cột mà giao diện (products.js, hairmodels.js)
     * đang hiển thị nhưng ERD gốc chưa có (đối chiếu mục 4.1.2.1, ý 2 và 3).
     * Tách riêng để giữ nguyên 11 bảng lõi đúng theo ERD; có thể rollback độc lập.
     */
    public function up(): void
    {
        Schema::table('salons', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name'); // URL thân thiện: /salons/the-hair-space
            $table->string('district', 50)->nullable()->after('address'); // Bộ lọc khu vực
            $table->string('image')->nullable()->after('description');    // Ảnh mặt tiền
            $table->decimal('latitude', 10, 7)->nullable();               // Hiển thị bản đồ / salon gần bạn
            $table->decimal('longitude', 10, 7)->nullable();
            $table->index('district');
        });

        Schema::table('stylists', function (Blueprint $table) {
            $table->unsignedTinyInteger('experience_years')->nullable()->after('name');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('category', 50)->nullable()->after('name');    // cat-tao-kieu | nhuom-toc | ...
            $table->index('category');
        });

        Schema::table('hair_models', function (Blueprint $table) {
            $table->unsignedSmallInteger('slots')->nullable()->after('image'); // Số lượng mẫu cần tuyển
            $table->date('deadline')->nullable()->after('slots');             // Hạn nhận đơn
        });
    }

    public function down(): void
    {
        Schema::table('hair_models', fn (Blueprint $t) => $t->dropColumn(['slots', 'deadline']));
        Schema::table('services', function (Blueprint $t) {
            $t->dropIndex(['category']);
            $t->dropColumn('category');
        });
        Schema::table('stylists', fn (Blueprint $t) => $t->dropColumn('experience_years'));
        Schema::table('salons', function (Blueprint $t) {
            $t->dropUnique(['slug']);
            $t->dropIndex(['district']);
            $t->dropColumn(['slug', 'district', 'image', 'latitude', 'longitude']);
        });
    }
};
