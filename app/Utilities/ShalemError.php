<?php

namespace App\Utilities;

class ShalemError
{
    public static function getMessage($error)
    {
        $messages = [
            'unauthenticated' => 'You must be logged in to access that page.',
            'forbidden' => 'You do not have permission to access that page.',
            'not_found' => 'The requested resource was not found.',
            'auth' => 'Your session has expired. Please log in again.',
        ];
        return $messages[$error] ?? 'An unknown error occurred.';
    }
}
