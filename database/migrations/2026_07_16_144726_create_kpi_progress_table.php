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
       Schema::create('kpi_progress', function (Blueprint $table) {
    $table->id();

    $table->foreignId('kpi_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->decimal('percentage', 5, 2);

    $table->unsignedTinyInteger('month');

    $table->year('year');

    $table->text('remarks')->nullable();

    $table->foreignId('updated_by')
        ->constrained('users')
        ->cascadeOnDelete();

    $table->timestamps();

    $table->unique(['kpi_id', 'month', 'year']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_progress');
    }
};
