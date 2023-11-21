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
        if (Schema::hasTable('clientes')) {
            return;
        }

        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('empresa')->nullable();
            $table->char('dni', 8)->unique()->nullable();
            $table->char('ruc', 11)->unique()->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo')->unique()->nullable();
            $table->string('direccion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
