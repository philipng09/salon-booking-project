
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiConsultation extends Model
{
    /**
     * Bảng lưu lịch sử tư vấn kiểu tóc bằng AI.
     */
    protected $table = 'ai_consultations';

    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration create_ai_consultations_table.
     */
    protected $fillable = [
        'user_id',
        'uploaded_image',
        'recommended_style',
        'result_image',
    ];

    /**
     * Một lượt tư vấn AI có thể thuộc về một người dùng.
     *
     * FK: ai_consultations.user_id -> users.id
     *
     * user_id cho phép NULL để hỗ trợ khách vãng lai.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }
}
