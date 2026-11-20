
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với bảng services và Migration mở rộng.
     */
    protected $fillable = [
        'salon_id',
        'name',
        'category',
        'price',
        'duration',
        'description',
    ];

    /**
     * Ép kiểu dữ liệu phù hợp với Migration.
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'duration' => 'integer',
        ];
    }

    /**
     * Mỗi dịch vụ thuộc về một salon.
     * FK: services.salon_id -> salons.id
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(
            Salon::class,
            'salon_id'
        );
    }

    /**
     * Một dịch vụ xuất hiện trong nhiều
     * dòng chi tiết của các lịch hẹn.
     * FK: booking_services.service_id
     */
    public function bookingServices(): HasMany
    {
        return $this->hasMany(
            BookingService::class,
            'service_id'
        );
    }

    /**
     * Một dịch vụ có thể được đặt trong nhiều lịch hẹn.
     * Quan hệ nhiều - nhiều qua bảng booking_services.
     */
    public function bookings(): BelongsToMany
    {
        return $this->belongsToMany(
            Booking::class,
            'booking_services',
            'service_id',
            'booking_id'
        )
        ->using(BookingService::class)
        ->withPivot(
            'id',
            'price_at_booking',
            'duration_at_booking'
        )
        ->withTimestamps();
    }
}
