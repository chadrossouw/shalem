<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    //
    public function criteria(): BelongsToMany
    {
        return $this->belongsToMany(Criteria::class, 'badges_criterias', 'badge_id', 'criteria_id');
    }
}
