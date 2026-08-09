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
      Schema::create('action_plan_submissions', function (Blueprint $table) {
                $table->id();

                $table->foreignId('action_plan_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->foreignId('action_plan_unit_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->foreignId('reporting_period_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->foreignId('submitted_by')
                    ->constrained('users')
                    ->cascadeOnDelete();

                $table->text('comment')->nullable();

                $table->timestamp('submitted_at');

                $table->enum('status', [
                    'submitted',
                    'under_review',
                    'accepted',
                    'returned',
                ])->default('submitted');

                $table->enum('timeliness', [
                    'on_time',
                    'late',
                ])->default('on_time');

                $table->timestamps();

                $table->unique([
                    'action_plan_id',
                    'action_plan_unit_id',
                    'reporting_period_id',
                ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_plan_submissions');
    }
};
