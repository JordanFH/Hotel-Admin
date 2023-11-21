<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'categoria_id', 'precio', 'stock'
    ];

    public function detallesPedidos()
    {
        return $this->belongsToMany(DetallePedido::class, 'producto_detalle')
            ->withPivot('precio_unitario', 'cantidad')
            ->withTimestamps();
    }
}
