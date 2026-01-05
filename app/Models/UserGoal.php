<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
class UserGoal extends Model
{
    //
    public function goals(): HasOne
    {
        return $this->hasOne(Goal::class, 'id', 'goal_id');
    }
    
    public function progress()
    {
        return $this->hasMany(UserGoalProgress::class, 'user_goal_id', 'id');
    }
}
