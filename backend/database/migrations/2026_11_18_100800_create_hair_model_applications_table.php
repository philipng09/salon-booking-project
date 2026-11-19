<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Bảng hair_model_applications — đơn ứng tuyển làm mẫu tóc. */
    public function up(): void
    {
        Schema::create('hair_model_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hair_model_id')->constrained('hair_models')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status', 20)->default('pending');     // pending | approved | rejected
            $table->timestamps();

            $table->unique(['hair_model_id', 'user_id']);         // Mỗi người ứng tuyển 1 lần / tin
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement("ALTER TABLE hair_model_applications
                ADD CONSTRAINT chk_hma_status CHECK (status IN ('pending', 'approved', 'rejected'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('hair_model_applications');
    }
};
