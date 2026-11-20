
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blog extends Model
{
    /**
     * Các thuộc tính được phép gán hàng loạt.
     * Khớp với Migration create_blogs_table.
     */
    protected $fillable = [
        'author_id',
        'title',
        'content',
        'image',
    ];

    /**
     * Mỗi bài viết có thể thuộc về một tác giả.
     *
     * FK: blogs.author_id -> users.id
     *
     * author_id có thể NULL vì Migration sử dụng
     * nullable và ON DELETE SET NULL.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'author_id'
        );
    }
}
