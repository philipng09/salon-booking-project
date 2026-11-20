
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HairModelApplication extends Model
{
    /**
     * Bảng lưu đơn ứng tuyển làm mẫu tóc.
     */
    protected $table = 'hair_model_applications';

    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration create_hair_model_applications_table.
     */
    protected $fillable = [
        'hair_model_id',
        'user_id',
        'status',
    ];

    /**
     * Mỗi đơn ứng tuyển thuộc về một tin tuyển mẫu tóc.
     *
     * FK: hair_model_applications.hair_model_id
     *     -> hair_models.id
     */
    public function hairModel(): BelongsTo
    {
        return $this->belongsTo(
            HairModel::class,
            'hair_model_id'
        );
    }

    /**
     * Mỗi đơn ứng tuyển thuộc về một người dùng.
     *
     * FK: hair_model_applications.user_id
     *     -> users.id
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }
}
