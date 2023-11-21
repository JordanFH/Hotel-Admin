<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClienteCollection;
use App\Http\Resources\CotizacionDetalleCollection;
use App\Http\Resources\ProductoCollection;
use App\Http\Resources\ServicioCollection;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Servicio;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CotizacionController extends Controller
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

    // Listar Pedidos

    public function index()
    {
        $cotizaciones = Cotizacion::orderBy('codigo', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        $clientes = Cliente::all();

        return Inertia::render('Cotizaciones/Index', [
            'cotizaciones' => $cotizaciones,
            'clientes' => $clientes->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre,
                ];
            })->toArray()
        ]);
    }

    // Crear Pedido

    public function create()
    {

        return Inertia::render('Cotizaciones/Create', [
            'clientes' => new ClienteCollection(
                Cliente::orderBy('empresa', 'asc')
                    ->groupBy('empresa', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
            'productos' => new ProductoCollection(
                Producto::orderBy('categoria_id', 'asc')
                    ->groupBy('categoria_id', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
            'servicios' => new ServicioCollection(
                Servicio::orderBy('categoria_id', 'asc')
                    ->groupBy('categoria_id', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
            'detalle_cotizacion' => new CotizacionDetalleCollection(
                CotizacionDetalle::whereNull('cotizacion_id')->get()
            ),
        ]);
    }

    // Guardar Pedido

    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'descuento' => [
                'required',
                'numeric',
            ],
            'impuestos' => 'required',
            'total' => 'required',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        //para el subtotal como cambia si hay descuento se tiene que aplicar esto: pedidoData.total- pedidoData.impuestos + pedidoData.descuentoCalculado
        $subtotal = $request->input('total') - $request->input('impuestos');
        //creamos el pedido
        $cotizacion = Cotizacion::create([
            'user_id' => auth()->user()->id,
            'cliente_id' => $request->input('cliente_id'),
            'fecha' => $request->input('fecha'),
            'descuento' => $request->input('descuentoCalculado'),
            'impuestos' => $request->input('impuestos'),
            'subtotal' => $subtotal,
            'total' => $request->input('total'),
        ]);

        //actualimos todos los detalle pedidos que estaban a null porque ya se asignaron

        CotizacionDetalle::where('cotizacion_id', null)
            ->update(['cotizacion_id' => $cotizacion->id]);

        return redirect()->route('cotizaciones.index');
    }

    // Editar Pedido

    public function edit($id)
    {
        $cotizacion = Cotizacion::findOrFail($id);
        $user = User::findOrFail($cotizacion->user_id);


        return Inertia::render('Cotizaciones/Edit', [
            'user' => $user,
            'cotizacion' => $cotizacion,
            'clientes' => new ClienteCollection(
                Cliente::orderBy('empresa', 'asc')
                    ->groupBy('empresa', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
            'detalle_cotizacion' => new CotizacionDetalleCollection(
            CotizacionDetalle::where('cotizacion_id', $cotizacion->id)->get()
            ),
            'productos' => new ProductoCollection(
                Producto::orderBy('categoria_id', 'asc')
                    ->groupBy('categoria_id', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
            'servicios' => new ServicioCollection(
                Servicio::orderBy('categoria_id', 'asc')
                    ->groupBy('categoria_id', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
        ]);
    }

    // Actualizar Pedido

    /**
     * @throws ValidationException
     */
    public function update($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'descuento' => [
                'required',
                'numeric',
            ],
            'impuestos' => 'required',
            'total' => 'required',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }


        $cotizacion = Cotizacion::find($id);
        $cotizacion->update(
            [
                'user_id' => auth()->user()->id,
                'cliente_id' => $request->input('cliente_id'),
                'fecha' => $request->input('fecha'),
                'descuento' => $request->input('descuento'),
                'impuestos' => $request->input('impuestos'),
                'subtotal' => $request->input('subtotal'),
                'total' => $request->input('total'),
            ]
        );

        return redirect()->route('cotizaciones.index');
    }

    // Eliminar Pedido

    public function destroy($id)
    {
        //el id no esta llegando por eso falla, luego esta funcionando
        $cotizacion = Cotizacion::find($id);
        if (!$cotizacion) {
            abort(404);
        }

        $cotizacion->delete();

        // Devolver una respuesta de éxito
        return response()->noContent();

    }

}
