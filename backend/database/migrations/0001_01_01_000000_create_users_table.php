<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                                   // PK users.id
            $table->string('full_name');                    // Họ và tên hiển thị
            $table->string('email')->unique();              // Email đăng nhập, không trùng
            $table->string('phone', 20)->nullable();        // Lưu dạng chuỗi để giữ số 0 đầu
            $table->string('password_hash');                // Chỉ lưu chuỗi băm (bcrypt)
            $table->string('role', 20)->default('customer')->index(); // customer | salon_owner | admin
            $table->timestamp('email_verified_at')->nullable(); // Cột kỹ thuật của Laravel Auth
            $table->rememberToken();                            // Cột kỹ thuật "ghi nhớ đăng nhập"
            $table->timestamps();
        });

        // Ràng buộc miền giá trị cho role (MySQL 8.0.16+ / MariaDB 10.2+ mới thực thi CHECK)
        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'])) {
            DB::statement("ALTER TABLE users ADD CONSTRAINT chk_users_role
                CHECK (role IN ('customer', 'salon_owner', 'admin'))");
        }

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
