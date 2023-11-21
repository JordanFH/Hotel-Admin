<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'categoria_id', 'costo', 'marca', 'modelo'
    ];

    public function detallesPedidos()
    {
        return $this->belongsToMany(DetallePedido::class, 'servicio_detalle')
            ->withPivot('precio_unitario', 'cantidad')
            ->withTimestamps();
    }
}
