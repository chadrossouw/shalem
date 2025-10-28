<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Avatar;
use App\Models\User;
use App\Models\Student;

class UserAvatarsController extends Controller
{
    public function getAvatars()
    {
        $avatars = Avatar::all();
        return response()->json(['avatars' => $avatars], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'avatar_id' => 'required|exists:avatars,id',
        ]);

        $user = $request->user();
        $avatar = Avatar::find($request->avatar_id);
        $student = Student::where('user_id', $user->id)->first();
        $student->avatar()->associate($avatar);
        $student->save();

        return response()->json(['message' => 'Avatar updated successfully.'], 200);
    }
}
