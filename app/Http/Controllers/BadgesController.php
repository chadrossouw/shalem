<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BadgesController extends Controller
{
    public function list(Request $request)
    {
        $user = $request->user();
        $badges = $user->userBadges;
        $badges->load('badge');
        return response()->json([
            'badges' => $badges,
        ]);
    }
}
