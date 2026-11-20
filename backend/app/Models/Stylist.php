
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stylist extends Model
{
    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration tạo bảng stylists
     * và Migration bổ sung trường hiển thị.
     */
    protected $fillable = [
        'salon_id',
        'name',
        'experience_years',
        'phone',
        'avatar',
    ];

    /**
     * Ép kiểu số năm kinh nghiệm thành số nguyên.
     */
    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
        ];
    }

    /**
     * Mỗi nhà tạo mẫu thuộc về một salon.
     * FK: stylists.salon_id -> salons.id
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(
            Salon::class,
            'salon_id'
        );
    }

    /**
     * Một nhà tạo mẫu có thể phụ trách nhiều lịch hẹn.
     * FK: bookings.stylist_id -> stylists.id
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(
            Booking::class,
            'stylist_id'
        );
    }
}
