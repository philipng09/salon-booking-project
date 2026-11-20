
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với migration create_bookings_table.
     */
    protected $fillable = [
        'user_id',
        'salon_id',
        'stylist_id',
        'booking_date',
        'start_time',
        'end_time',
        'total_price',
        'status',
    ];

    /**
     * Ép kiểu dữ liệu ngày và giá tiền.
     */
    protected function casts(): array
    {
        return [
            'booking_date' => 'date:Y-m-d',
            'total_price' => 'decimal:2',
        ];
    }

    /**
     * Mỗi lịch hẹn thuộc về một khách hàng.
     * FK: bookings.user_id -> users.id
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    /**
     * Mỗi lịch hẹn thuộc về một salon.
     * FK: bookings.salon_id -> salons.id
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(
            Salon::class,
            'salon_id'
        );
    }

    /**
     * Lịch hẹn có thể được phân công cho một stylist.
     * FK: bookings.stylist_id -> stylists.id
     */
    public function stylist(): BelongsTo
    {
        return $this->belongsTo(
            Stylist::class,
            'stylist_id'
        );
    }

    /**
     * Một lịch hẹn có nhiều dòng chi tiết dịch vụ.
     * FK: booking_services.booking_id
     */
    public function bookingServices(): HasMany
    {
        return $this->hasMany(
            BookingService::class,
            'booking_id'
        );
    }

    /**
     * Một lịch hẹn có thể chứa nhiều dịch vụ.
     * Quan hệ N:N qua bảng booking_services.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(
            Service::class,
            'booking_services',
            'booking_id',
            'service_id'
        )
        ->using(BookingService::class)
        ->withPivot(
            'id',
            'price_at_booking',
            'duration_at_booking'
        )
        ->withTimestamps();
    }

    /**
     * Mỗi lịch hẹn có tối đa một đánh giá.
     * FK: reviews.booking_id (UNIQUE)
     */
    public function review(): HasOne
    {
        return $this->hasOne(
            Review::class,
            'booking_id'
        );
    }
}
