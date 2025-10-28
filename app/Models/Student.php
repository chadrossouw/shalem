<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\hasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    protected $fillable = [ 'age', 'grade', 'parent_id', 'edadmin_id', 'avatar', 'user_id' ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'parent_id' => 'array',
        ];
    }

    public function avatar(): hasOne
    {
        return $this->hasOne(Avatar::class, 'id', 'avatar');
    }
}
