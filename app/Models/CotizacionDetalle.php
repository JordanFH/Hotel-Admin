<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CotizacionDetalle extends Model
{
    use HasFactory;

    protected $table = 'cotizacion_detalles';

    //campos a llenar
    protected $fillable = [
        'cotizacion_id',
        'tipo',
        'item_id',
        'monto',
        'cantidad',
        'description',
    ];

}
