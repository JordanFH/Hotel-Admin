<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cotizacion extends Model
{

    protected $table = 'cotizaciones';

    use HasFactory;

    protected $fillable = [
        'user_id', // Agregar el campo user_id a la propiedad $fillable
        'codigo',
        'cliente_id',
        'fecha',
        'descuento',
        'impuestos',
        'subtotal',
        'total',
    ];

    // Evento creating para generar el código antes de guardar el pedido
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pedido)
        {
            $ultimoPedido = self::latest('id')->first(); // Obtener el último pedido creado
            $n = ($ultimoPedido) ? intval(substr($ultimoPedido->codigo, 3)) + 1 : 1; // Incrementar el número en 1
            $pedido->codigo = 'C' . str_pad($n, 5, '0', STR_PAD_LEFT); // Formatear el código
        });
    }
}
