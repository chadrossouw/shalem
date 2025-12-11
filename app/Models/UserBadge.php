<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserBadge extends Model
{
    //
    public function badge(): HasOne
    {
        return $this->hasOne(Badge::class, 'id', 'badge_id');
    }
}
