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
        if (Schema::hasTable('productos')) {
            return;
        }

        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->float('precio')->default(0.0)->nullable();
            $table->unsignedInteger('stock')->default(0)->nullable();
            $table->timestamps();

            $table->foreign('categoria_id')->references('id')->on('categorias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
