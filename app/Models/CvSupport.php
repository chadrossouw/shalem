<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use \Illuminate\Support\Facades\Storage;

class CvSupport extends Model
{
    
    use Searchable;

    protected $attributes = [
        'name' => '',
        'description' => '',
        'file_path' => '',
        'user_id' => '',
        'created_at' => '',
        'updated_at' => '',
    ];

    protected $fillable = [
        'name',
        'description',
        'file_path',
        'user_id',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'cv_support_document', 'cv_support_id', 'document_id');
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
            'name' => '',
            'description' => '',
        ];
 
        return $array;
    }
}
