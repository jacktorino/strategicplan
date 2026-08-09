<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reporting_periods', function (Blueprint $table) {
            $table->dateTime('period_start')->change();
            $table->dateTime('period_end')->change();
            $table->dateTime('late_submission_start')->change();
            $table->dateTime('late_submission_end')->change();
        });
    }

    public function down(): void
    {
        Schema::table('reporting_periods', function (Blueprint $table) {
            $table->date('period_start')->change();
            $table->date('period_end')->change();
            $table->date('late_submission_start')->change();
            $table->date('late_submission_end')->change();
        });
    }
};