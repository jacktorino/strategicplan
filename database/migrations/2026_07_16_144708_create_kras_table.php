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
        Schema::create('kras', function (Blueprint $table) {
    $table->id();

    $table->foreignId('strategic_plan_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->string('code');
    $table->string('title');

    $table->text('description')->nullable();

    $table->integer('order_no')->default(1);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kras');
    }
};
