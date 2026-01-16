<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ForwardedDocument extends Model
{
    //
    protected $fillable = ['user_id', 'document_id', 'forwarded_by', 'reason'];

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function document(): HasOne
    {
        return $this->hasOne(Document::class, 'id', 'document_id');
    }

    public function forwardedBy(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'forwarded_by');
    }
}