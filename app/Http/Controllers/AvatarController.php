<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Avatar;

class AvatarController extends Controller
{

   public function __invoke(){
       $allAvatars = \App\Models\Avatar::all();
       $avatarDirectory = storage_path('app/avatars/');
       $allFiles = scandir($avatarDirectory);
       $usedFiles = $allAvatars->pluck('file_name')->toArray();
       foreach ($allFiles as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }   
            if (!in_array($file, $usedFiles)) {
                $avatar = new Avatar();
                $name = explode('-', explode('.', $file)[0]);
                $name = array_map('ucfirst', $name);
                $avatar->name = implode(' ', $name);
                $avatar->path = 'avatars/' . $file;
                $avatar->save();
            }
        }
    }
}
