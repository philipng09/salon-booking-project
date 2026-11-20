
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salon extends Model
{
    /**
     * Các thuộc tính cho phép gán hàng loạt.
     * Khớp với Migration tạo bảng salons
     * và Migration bổ sung trường hiển thị.
     */
    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'address',
        'district',
        'phone',
        'description',
        'image',
        'opening_hours',
        'salon_type',
        'latitude',
        'longitude',
    ];

    /**
     * Ép kiểu tọa độ theo dữ liệu DECIMAL(10,7).
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    /**
     * Mỗi salon thuộc về một chủ salon.
     * FK: salons.owner_id -> users.id
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Một salon cung cấp nhiều dịch vụ.
     * FK: services.salon_id
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'salon_id');
    }

    /**
     * Một salon có nhiều nhà tạo mẫu.
     * FK: stylists.salon_id
     */
    public function stylists(): HasMany
    {
        return $this->hasMany(Stylist::class, 'salon_id');
    }

    /**
     * Một salon tiếp nhận nhiều lịch hẹn.
     * FK: bookings.salon_id
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'salon_id');
    }

    /**
     * Một salon nhận nhiều đánh giá.
     * FK: reviews.salon_id
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'salon_id');
    }

    /**
     * Một salon có thể đăng nhiều tin tuyển mẫu tóc.
     * FK: hair_models.salon_id
     */
    public function hairModels(): HasMany
    {
        return $this->hasMany(HairModel::class, 'salon_id');
    }
}
