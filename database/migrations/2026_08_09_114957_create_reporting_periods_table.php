<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('reporting_periods', function (Blueprint $table) {
            $table->id();

            $table->foreignId('strategic_plan_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('period_start');
            $table->date('period_end');

            $table->date('late_submission_start');
            $table->date('late_submission_end');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporting_periods');
    }
};
