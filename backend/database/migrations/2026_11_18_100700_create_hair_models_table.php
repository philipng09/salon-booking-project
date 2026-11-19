<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng hair_models — tin tuyển người mẫu tóc do salon đăng. */
    public function up(): void
    {
        Schema::create('hair_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salon_id')->constrained('salons')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('status', 20)->default('active');      // active | closed
            $table->timestamps();

            $table->index(['salon_id', 'status']);
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement("ALTER TABLE hair_models
                ADD CONSTRAINT chk_hair_models_status CHECK (status IN ('active', 'closed'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('hair_models');
    }
};
