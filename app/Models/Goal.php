<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Goal extends Model
{
    //
    public function criteria(): BelongsToMany
    {
        return $this->belongsToMany(Criteria::class, 'criteria_goals', 'goal_id', 'criteria_id');
    }
}
