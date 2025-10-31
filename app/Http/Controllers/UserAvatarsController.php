<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Avatar;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class UserAvatarsController extends Controller
{
    public function getAvatars()
    {
        $avatars = Avatar::all();
        $avatars = $avatars->map(function ($avatar) {
            return [
                'id' => $avatar->id,
                'name' => $avatar->name,
                'path' => asset('storage/' . $avatar->path),
                'svg' => file_get_contents(storage_path('app/' . $avatar->path)),
            ];
        });
        return response()->json(['avatars' => $avatars], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'avatar_id' => 'required|exists:avatars,id',
        ]);

        $user  = Auth::user();
        $avatar = Avatar::find($request->avatar_id);
        $student = Student::where('user_id', $user->id)->first();
        $student->avatar()->associate($avatar);
        $student->save();

        return response()->json(['message' => 'Avatar updated successfully.'], 200);
    }
}
