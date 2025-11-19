<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Document extends Model
{
    //
    use Searchable;

    protected $attributes = [
        'id' => '',
        'title' => '',
        'description' => '',
        'file_path' => '',
        'user_id' => '',
        'pillar_id' => '',
        'type' => '',
        'created_at' => '',
        'updated_at' => '',
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
