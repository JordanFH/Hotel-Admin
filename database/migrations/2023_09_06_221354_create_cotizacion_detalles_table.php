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
        Schema::create('cotizacion_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cotizacion_id')->nullable();
            //Es necesario agregar que producto o servicio se esta agregando
            $table->string('tipo',10)->default('Producto');
            $table->unsignedBigInteger('item_id')->default(0);
            $table->float('monto')->default(0.0);
            $table->integer('cantidad')->default(0);
            $table->timestamps();
            $table->foreign('cotizacion_id')->references('id')->on('cotizaciones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotizacion_detalles');
    }
};
