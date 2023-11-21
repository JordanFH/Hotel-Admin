<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;

class CotizacionDetalleController extends Controller
{

    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('can:cotizaciones')->only('index');
        $this->middleware('can:cotizaciones.create')->only('create', 'store');
        $this->middleware('can:cotizaciones.edit')->only('edit', 'update');
        $this->middleware('can:cotizaciones.destroy')->only('destroy');
        $this->middleware('can:cotizaciones.show')->only('show');
        $this->middleware('can:cotizaciones.store')->only('store');
        $this->middleware('can:cotizaciones.update')->only('update');
    }

    public function show()
    {
        //no se esta usando
        return "hola";
    }

    public function store(Request $request)
    {

        //validaciones
        //nos aseguramos que el item_id no sea null, es decir haya un producto o servicio seleccionado
        if ($request->input('item_id') == null){
            return "el item_id es null";
        }
        //validamos que el stock sea suficiente
        if ($request->input('tipo') == 'Producto'){
            $producto = Producto::find($request->input("item_id"));
            if ($producto->stock < $request->input("cantidad")) {
                return "el stock es 0"; // se debe enviar un mensaje de error
            }
        }
        $descript = "";
        if($request->input("isChecked")){
            $descript = "Ancho: ".$request->input("ancho")." Alto: ".$request->input("alto");
        }

        return CotizacionDetalle::create([
            'tipo' => $request->input("tipo"),
            'monto' => $request->input("monto"),
            'item_id' => $request->input("item_id"),
            'cantidad' => $request->input("cantidad"),
            'description' => $descript . " -> ".$request->input("description"),
            // ...
        ]);
    }

    public function storeDetalle(Request $request,$id){
        //validaciones
        //nos aseguramos que el item_id no sea null, es decir haya un producto o servicio seleccionado
        if ($request->input('item_id') == null){
            return "el item_id es null";
        }
        //validamos que el stock sea suficiente
        $producto = Producto::find($request->input("item_id"));
        if ($producto->stock < $request->input("cantidad")) {
            return "el stock es 0"; // se debe enviar un mensaje de error
        }

        //creamos el detalle pedido

        $detalle_cotizacion = CotizacionDetalle::create([
            'cotizacion_id' => $id,
            'tipo' => $request->input("tipo"),
            'monto' => $request->input("monto"),
            'item_id' => $request->input("item_id"),
            'cantidad' => $request->input("cantidad"),
            'description' => $request->input("description"),
            // ...
        ]);

        $cotizacion = Cotizacion::find($id);
        $impuestoUni = ($detalle_cotizacion->monto/1.18) * 0.18;
        $cotizacion->total += $detalle_cotizacion->monto/1.18 + $impuestoUni;
        $cotizacion->subtotal += $detalle_cotizacion->monto/1.18;
        $cotizacion->impuestos += $impuestoUni ;
        $cotizacion->save();

//        if($request->input('tipo') == 'Producto'){
//            $producto->stock = $producto->stock - $request->input("cantidad");
//            $producto->save();
//        }

        return $detalle_cotizacion;
    }

    public function update($id, Request $request)
    {
        $data = $request->validate([
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0',
        ]);

        CotizacionDetalle::find($id)->update($data);

        return redirect()->route('cotizaciones.edit');
    }

    // Eliminar Pedido

    public function destroy($id)
    {
        $detalle_cotizacion = CotizacionDetalle::find($id);
        $response = $detalle_cotizacion;
        if($detalle_cotizacion->cotizacion_id != null){
            try {
                //hay que actualizar LA COTIZACION
                $cotizacion = Cotizacion::find($detalle_cotizacion->cotizacion_id);

                // Calcula los montos y ajustes antes de actualizar el pedido
                $detalle_monto = $detalle_cotizacion->monto;
                $detalle_impuesto = $detalle_cotizacion->monto/1.18 * 0.18;

                // Actualiza los valores del pedido
                $cotizacion->total -= ($detalle_monto/1.18 + $detalle_impuesto);
                $cotizacion->impuestos -= $detalle_impuesto;
                $cotizacion->subtotal -= $detalle_monto/1.18;

                // Si el pedido ya no tiene productos/servicios, restablece el descuento
                $tolerancia = 0.0001; // Tolerancia permitida para las comparaciones
                if (abs($cotizacion->subtotal) < $tolerancia) {
                    $cotizacion->descuento = 0;
                    $cotizacion->total = 0;
                }
//                if($detalle_cotizacion->tipo =="Producto"){
//                    $producto = Producto::where('id',$detalle_cotizacion->item_id)->first();
//                    $producto->stock = $producto->stock + $detalle_cotizacion->cantidad;
//                    $producto->save();
//                }

                $cotizacion->save();

                $detalle_cotizacion->delete();
            } catch (\Exception $e) {
                // Maneja la excepción de acuerdo a tus necesidades
                return "ERROR";
                //return response()->json(['message' => 'Error al eliminar el detalle de pedido'], 500);
            }
        }else{
//            if($detalle_cotizacion->tipo =="Producto"){
//                $producto = Producto::where('id',$detalle_cotizacion->item_id)->first();
//                $producto->stock = $producto->stock + $detalle_cotizacion->cantidad;
//                $producto->save();
//            }
            $detalle_cotizacion->delete();

        }
        return $response;


        //este codigo es para el editar pedido
    }
}
