<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng stylists — đội ngũ nhà tạo mẫu trực thuộc salon. */
    public function up(): void
    {
        Schema::create('stylists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salon_id')->constrained('salons')->cascadeOnDelete();
            $table->string('name');
            $table->string('phone', 20)->nullable();
            $table->string('avatar')->nullable();         // Đường dẫn ảnh đại diện
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stylists');
    }
};
