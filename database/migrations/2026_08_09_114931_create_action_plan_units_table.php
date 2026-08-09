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
       Schema::create('action_plan_units', function (Blueprint $table) {
                $table->id();

                $table->foreignId('action_plan_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->foreignId('organizational_unit_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->timestamps();

                $table->unique([
                    'action_plan_id',
                    'organizational_unit_id',
                ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_plan_units');
    }
};
