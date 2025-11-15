<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Document extends Model
{
    //
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function status(): HasOne
    {
        return $this->hasOne(DocumentStatus::class, 'id', 'document_status_id');
    }
}
