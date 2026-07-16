<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->enum('role',[
                'admin',
                'planning_officer',
                'responsible_unit',
                'viewer'
            ])->default('viewer');

            $table->foreignId('responsible_unit_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropConstrainedForeignId('responsible_unit_id');
            $table->dropColumn('role');

        });
    }
};