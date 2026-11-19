<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng services — danh mục dịch vụ và bảng giá niêm yết của từng salon. */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            // CASCADE: xóa salon thì xóa luôn danh mục dịch vụ của salon đó
            $table->foreignId('salon_id')->constrained('salons')->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price', 12, 2);              // VND, không âm
            $table->unsignedInteger('duration');          // Số phút thực hiện, > 0
            $table->text('description')->nullable();
            $table->timestamps();
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement('ALTER TABLE services
                ADD CONSTRAINT chk_services_price CHECK (price >= 0),
                ADD CONSTRAINT chk_services_duration CHECK (duration > 0)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
