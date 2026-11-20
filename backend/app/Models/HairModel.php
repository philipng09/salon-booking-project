
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HairModel extends Model
{
    /**
     * Bảng lưu các tin tuyển người mẫu tóc.
     */
    protected $table = 'hair_models';

    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration tạo bảng hair_models
     * và Migration bổ sung trường hiển thị.
     */
    protected $fillable = [
        'salon_id',
        'title',
        'description',
        'image',
        'slots',
        'deadline',
        'status',
    ];

    /**
     * Ép kiểu dữ liệu phù hợp với Migration.
     */
    protected function casts(): array
    {
        return [
            'slots' => 'integer',
            'deadline' => 'date:Y-m-d',
        ];
    }

    /**
     * Mỗi tin tuyển mẫu tóc thuộc về một salon.
     * FK: hair_models.salon_id -> salons.id
     */
    public function salon(): BelongsTo
    {
        return $this->belongsTo(
            Salon::class,
            'salon_id'
        );
    }

    /**
     * Một tin tuyển có thể nhận nhiều đơn ứng tuyển.
     * FK: hair_model_applications.hair_model_id
     */
    public function applications(): HasMany
    {
        return $this->hasMany(
            HairModelApplication::class,
            'hair_model_id'
        );
    }
}
