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
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids, SoftDeletes, HasApiTokens;
    protected $primaryKey = 'id';
    protected $fillable = [
        'email', 
        'first_name', 
        'last_name', 
        'honorific',
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

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'user_id', 'id');
    }

    public function staffRole(): HasOne
    {
        return $this->hasOne(StaffRole::class);
    }

    public function parentLogin(): HasOne
    {
        return $this->hasOne(ParentLogin::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function mentor(): HasOne
    {
        return $this->hasOne(Mentor::class,'student_id','id');
    }

    public function mentee(): HasMany
    {
        return $this->hasMany(Mentor::class, 'user_id', 'id');
    }

    public function userPoints(): HasMany
    {
        return $this->hasMany(UserPoints::class, 'user_id', 'id');
    }

    public function userGoals(): HasMany
    {
        return $this->hasMany(UserGoal::class, 'user_id', 'id');
    }

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class, 'user_id', 'id');
    }

    public function forwardedDocuments(): HasMany
    {
        return $this->hasMany(ForwardedDocument::class, 'user_id', 'id');
    }

    //Only staff grade; Student grade is stored in Student model
    public function grade(): HasOne
    {
        return $this->hasOne(Grade::class, 'user_id', 'id');
    }
}
