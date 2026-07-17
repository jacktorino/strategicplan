<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
          
            StrategicPlanSeeder::class,
            KraSeeder::class,
            SubKraSeeder::class,
            UserSeeder::class,
        ]);
    }
}