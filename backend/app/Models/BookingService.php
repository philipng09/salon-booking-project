
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BookingService extends Pivot
{
    /**
     * Tên bảng trung gian trong cơ sở dữ liệu.
     */
    protected $table = 'booking_services';

    /**
     * Bảng có khóa chính id tự tăng.
     */
    protected $primaryKey = 'id';

    public $incrementing = true;

    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration booking_services.
     */
    protected $fillable = [
        'booking_id',
        'service_id',
        'price_at_booking',
        'duration_at_booking',
    ];

    /**
     * Bảng có created_at và updated_at.
     */
    public $timestamps = true;

    /**
     * Ép kiểu dữ liệu.
     */
    protected function casts(): array
    {
        return [
            'booking_id' => 'integer',
            'service_id' => 'integer',
            'price_at_booking' => 'decimal:2',
            'duration_at_booking' => 'integer',
        ];
    }

    /**
     * Mỗi dòng chi tiết thuộc về một lịch hẹn.
     * FK: booking_services.booking_id -> bookings.id
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            Booking::class,
            'booking_id'
        );
    }

    /**
     * Mỗi dòng chi tiết tham chiếu một dịch vụ.
     * FK: booking_services.service_id -> services.id
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(
            Service::class,
            'service_id'
        );
    }
}
