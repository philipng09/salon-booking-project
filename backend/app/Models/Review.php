
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration create_reviews_table.
     */
    protected $fillable = [
        'user_id',
        'salon_id',
        'booking_id',
        'rating',
        'comment',
    ];

    /**
     * Ép kiểu điểm đánh giá thành số nguyên.
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    /**
     * Mỗi đánh giá thuộc về một khách hàng.
     * FK: reviews.user_id -> users.id
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    /**
     * Mỗi đánh giá thuộc về một salon.
     * FK: reviews.salon_id -> salons.id
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(
            Salon::class,
            'salon_id'
        );
    }

    /**
     * Mỗi đánh giá gắn với một lịch hẹn cụ thể.
     * FK: reviews.booking_id -> bookings.id
     *
     * Migration có UNIQUE(booking_id),
     * nên một Booking có tối đa một Review.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            Booking::class,
            'booking_id'
        );
    }
}
