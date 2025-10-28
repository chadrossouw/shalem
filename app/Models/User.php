<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids, SoftDeletes;
    protected $primaryKey = 'id';
    protected $fillable = [
        'email', 
        'first_name', 
        'last_name', 
        'type', 
        'edadmin_id', 
        'password', 
        'email_verified_at'
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $incrementing = false;
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
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
