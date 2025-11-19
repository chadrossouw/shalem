<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    //
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
}
