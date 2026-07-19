<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // No dependencies.
            ResponsibleUnitSeeder::class,

            // strategic_plans (created_by -> users is nullable, so this
            // can safely run before UserSeeder).
            StrategicPlanSeeder::class,

            // kras depends on strategic_plans.
            KraSeeder::class,

            // sub_kras depends on kras.
            SubKraSeeder::class,

            // users depends on sub_kras (the ICT user is assigned a
            // sub_kra_id). Must run after SubKraSeeder.
            UserSeeder::class,

            // kpis depends on sub_kras (lookup by code) and users
            // (hardcoded proposed_by/approved_by = 1, i.e. the admin
            // created by UserSeeder). Must run after both.
            KpiSeeder::class,

            // innovative_action_plans depends on kpis (matched by the
            // KPI code stored in the 'description' column).
            InnovativeActionPlanSeeder::class,

            // kpi_progress depends on kpis and users.
            KpiProgressSeeder::class,
        ]);
    }
}
