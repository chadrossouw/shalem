<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Avatar;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserAvatarsController extends Controller
{
    public function getAvatars(Request $request)
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

    public function getAvatar($id)
    {
        $avatar = Avatar::find($id);
        if (!$avatar) {
            return response()->json(['error' => 'Avatar not found.'], 404);
        }
        $avatarData = [
            'id' => $avatar->id,
            'name' => $avatar->name,
            'path' => asset('storage/' . $avatar->path),
            'svg' => file_get_contents(storage_path('app/' . $avatar->path)),
        ];
        return response()->json(['avatar' => $avatarData], 200);
    }
    
    public function setAvatar(Request $request)
    {
        $request->validate([
            'avatar_id' => 'required|exists:avatars,id',
        ]);

        $user  = Auth::user();
        $student = Student::where('user_id', $user->id)->first();
        $student->avatar = $request->avatar_id;
        $student->save();

        return response()->json(['success' => true, 'message' => 'Avatar updated successfully.'], 200);
    }
}
