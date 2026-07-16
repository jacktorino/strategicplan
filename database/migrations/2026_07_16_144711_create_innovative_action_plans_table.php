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
       Schema::create('innovative_action_plans', function (Blueprint $table) {
    $table->id();

    $table->foreignId('kpi_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->string('title');

    $table->text('description')->nullable();

    $table->date('start_date')->nullable();

    $table->date('end_date')->nullable();

    $table->text('expected_output')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('innovative_action_plans');
    }
};
