<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()->create([
            'first_name' => 'Chad',
            'last_name' => 'Rossouw',
            'email' => 'chad@blackmanrossouw.co.za',
            
            'edadmin_id' => 123,
            'password' => bcrypt('password'),
        ]);
    }
}
