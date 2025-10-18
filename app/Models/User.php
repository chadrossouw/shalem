<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids;

    protected $fillable = ['email', 'first_name', 'last_name', 'type', 'edadmin_id'];
    
    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function staffRole(): HasOne
    {
        return $this->hasOne(StaffRole::class);
    }

    public function parentLogin(): HasOne
    {
        return $this->hasOne(ParentLogin::class);
    }
}
