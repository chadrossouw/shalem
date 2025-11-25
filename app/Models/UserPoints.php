<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserPoints extends Model
{
    //
    public function points(): HasOne
    {
        return $this->hasOne(Points::class, 'id', 'point_id');
    }
}
