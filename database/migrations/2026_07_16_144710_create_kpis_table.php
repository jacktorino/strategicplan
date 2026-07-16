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
       Schema::create('kpis', function (Blueprint $table) {
    $table->id();

    $table->foreignId('sub_kra_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->string('title');

    $table->text('description')->nullable();

    $table->string('target')->nullable();

    $table->string('unit_of_measure')->nullable();

    $table->enum('status', [
        'Pending',
        'Approved',
        'Rejected',
        'Completed'
    ])->default('Pending');

    $table->text('remarks')->nullable();

    $table->foreignId('proposed_by')
        ->constrained('users')
        ->cascadeOnDelete();

    $table->foreignId('approved_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->timestamp('approved_at')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};
