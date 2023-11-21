<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Servicio;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportCotizacionController extends Controller
{
    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('role:Admin');
    }

    public function report(){
        $cotizaciones = CotizacionDetalle::wherenull('cotizacion_id')->get();
        $productos = Producto::all();
        $servicios = Servicio::all();
        try {
            $pdf = PDF::loadView('cotizacion.report', compact('cotizaciones','productos','servicios'));
            return $pdf->stream('reporte-cotizacion.pdf');
        } catch (\Exception $e) {
            // Manejar la excepción, por ejemplo, registrándola o devolviendo un mensaje de error
            dd($e->getMessage());
            return $e->getMessage();
        }
    }

    public function reportEdit($cotizacion_id){

        $cotizaciones = CotizacionDetalle::where('cotizacion_id',$cotizacion_id)->get();
        $cot = Cotizacion::find($cotizacion_id);
        $productos = Producto::all();
        $servicios = Servicio::all();

        try {
            $pdf = PDF::loadView('cotizacion.report', compact('cotizaciones','productos','servicios','cot'));
            return $pdf->stream('reporte-cotizacion.pdf');
        } catch (\Exception $e) {
            // Manejar la excepción, por ejemplo, registrándola o devolviendo un mensaje de error
            dd($e->getMessage());
            return $e->getMessage();
        }
    }
}
