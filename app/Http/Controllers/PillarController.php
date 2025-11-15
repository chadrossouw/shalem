<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pillar;

class PillarController extends Controller
{
    public function __invoke()
    {
        //Just populate pillars for now. Will update descriptions later.
        $pillars = [
            'Academics',
            'Arts and Culture',
            'Jewish Life',
            'Menschlichkeit',
            'Service and Leadership',
            'Sport'
        ];
        foreach ($pillars as $pillarName) {
            Pillar::updateOrCreate(['name' => $pillarName,'description' => '']);
        }
    }
}
