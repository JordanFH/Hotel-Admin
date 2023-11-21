<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('can:clientes')->only('index');
        $this->middleware('can:clientes.create')->only('create', 'store');
        $this->middleware('can:clientes.edit')->only('edit', 'update');
        $this->middleware('can:clientes.destroy')->only('destroy');
        $this->middleware('can:clientes.show')->only('show');
        $this->middleware('can:clientes.store')->only('store');
        $this->middleware('can:clientes.update')->only('update');
    }

    public function index()
    {
        $clientes = Cliente::orderBy('nombre', 'asc')
            ->groupBy('nombre', 'empresa')
            ->orderBy('empresa', 'asc')
            ->get();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes
        ]);
    }

    // Crear Cliente

    public function create()
    {
        return Inertia::render('Clientes/Create');
    }

    // Guardar Cliente

    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:' . Cliente::class,
            'dni' => 'numeric|nullable|unique:' . Cliente::class,
            'ruc' => 'numeric|nullable|unique:' . Cliente::class,
            'correo' => 'nullable|email|unique:' . Cliente::class,
        ]);

        Cliente::create($request->all());

        return redirect()->route('clientes.index');
    }

    // Editar Cliente

    public function edit(Cliente $cliente)
    {
        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente
        ]);
    }

    // Actualizar Cliente

    /**
     * @throws ValidationException
     */
    public function update($id, Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:clientes,nombre,' . $id,
            'dni' => 'numeric|nullable|unique:clientes,dni,' . $id,
            'ruc' => 'numeric|nullable|unique:clientes,ruc,' . $id,
            'correo' => 'nullable|email|unique:clientes,correo,' . $id,
        ]);

        Cliente::find($id)->update($request->all());
        return redirect()->route('clientes.index');
    }

    // Eliminar Cliente

    /*public function destroy($id)
    {
        Cliente::find($id)->delete();
        return redirect()->route('clientes.index');
    }*/

    public function destroy($id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            abort(404);
        }

        $pedido = Pedido::where('cliente_id', $id)->first();
        if($pedido){
            return response()->json([
                'message' => 'No se puede eliminar el cliente porque tiene pedidos asociados'
            ], 409);
        }
        $cliente->delete();

        return response()->noContent();
    }
}
