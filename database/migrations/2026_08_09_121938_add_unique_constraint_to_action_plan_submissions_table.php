<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('action_plan_submissions', function (Blueprint $table) {
            $table->unique(
                [
                    'action_plan_unit_id',
                    'reporting_period_id',
                ],
                'unique_action_plan_unit_reporting_period'
            );
        });
    }

    public function down(): void
    {
        Schema::table('action_plan_submissions', function (Blueprint $table) {
            $table->dropUnique(
                'unique_action_plan_unit_reporting_period'
            );
        });
    }
};