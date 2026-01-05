<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;


class UserGoalProgress extends Model
{
    public function criteria(): HasOne
    {
        return $this->hasOne(Criteria::class, 'id', 'criteria_id');
    }
}
