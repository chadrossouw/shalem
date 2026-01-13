<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserPoints extends Model
{
    protected $fillable = [
        'user_id',
        'document_id',
        'point_id',
        'value',
    ];
    //
    public function points(): HasOne
    {
        return $this->hasOne(Points::class, 'id', 'point_id');
    }
}
