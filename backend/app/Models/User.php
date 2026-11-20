
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['full_name', 'email', 'phone', 'password_hash', 'role'])]
#[Hidden(['password_hash', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Cột mật khẩu theo từ điển dữ liệu (Bảng 4.1) là password_hash thay vì
     * password mặc định, nên khai báo để Laravel Auth đọc đúng cột.
     */
    protected $authPasswordName = 'password_hash';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password_hash' => 'hashed',
        ];
    }

    /**
     * Một chủ salon có thể sở hữu nhiều salon.
     * Khóa ngoại: salons.owner_id
     */
    public function salons(): HasMany
    {
        return $this->hasMany(Salon::class, 'owner_id');
    }

    /**
     * Một khách hàng có thể tạo nhiều lịch hẹn.
     * Khóa ngoại: bookings.user_id
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    /**
     * Một người dùng có thể viết nhiều đánh giá.
     * Khóa ngoại: reviews.user_id
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'user_id');
    }

    /**
     * Một người dùng có thể là tác giả nhiều bài viết.
     * Khóa ngoại: blogs.author_id
     */
    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class, 'author_id');
    }

    /**
     * Một người dùng có thể gửi nhiều đơn ứng tuyển mẫu tóc.
     * Khóa ngoại: hair_model_applications.user_id
     */
    public function hairModelApplications(): HasMany
    {
        return $this->hasMany(
            HairModelApplication::class,
            'user_id'
        );
    }

    /**
     * Một người dùng có thể có nhiều lượt tư vấn AI.
     * Khóa ngoại: ai_consultations.user_id
     */
    public function aiConsultations(): HasMany
    {
        return $this->hasMany(
            AiConsultation::class,
            'user_id'
        );
    }
}
