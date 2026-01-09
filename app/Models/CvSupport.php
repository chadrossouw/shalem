<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class CvSupport extends Model
{
    
    use Searchable;

    protected $attributes = [
        'name' => '',
        'description' => '',
        'file_path' => '',
        'user_id' => '',
        'document_ids' => '',
        'created_at' => '',
        'updated_at' => '',
    ];

    protected $fillable = [
        'name',
        'description',
        'file_path',
        'user_id',
        'document_ids',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'cv_support_document', 'cv_support_id', 'document_id');
    }

    public function getPublicFilePathAttribute(){
        return \Illuminate\Support\Facades\Storage::temporaryUrl($this->file_path, now()->addMinutes(30));
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
