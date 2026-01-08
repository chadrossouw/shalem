<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use \Illuminate\Support\Facades\Storage;

class Document extends Model
{
    //
    use Searchable;

    protected $attributes = [
        'title' => '',
        'description' => '',
        'file_path' => '',
        'user_id' => '',
        'pillar_id' => '',
        'type' => '',
        'created_at' => '',
        'updated_at' => '',
    ];

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'user_id',
        'pillar_id',
        'type',
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function document_status(): HasOne
    {
        return $this->hasOne(DocumentStatus::class,  'document_id', 'id')->latestOfMany();
    }

    public function document_statuses()
    {
        return $this->hasMany(DocumentStatus::class,  'document_id', 'id');
    }

    protected function filePath(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Storage::temporaryUrl($value, now()->addMinutes(30)),
        );
    }
    
    public function toSearchableArray(): array
    {
        $array = [
            'title' => '',
            'description' => '',
            'type' => '',
        ];
 
        return $array;
    }
}
