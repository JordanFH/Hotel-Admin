<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriaCollection;
use App\Models\Categoria;
use App\Models\ServicioDetalle;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Models\Servicio;
use Illuminate\Support\Facades\Validator;

class ServicioController extends Controller
{
    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('can:servicios')->only('index');
        $this->middleware('can:servicios.create')->only('create', 'store');
        $this->middleware('can:servicios.edit')->only('edit', 'update');
        $this->middleware('can:servicios.destroy')->only('destroy');
        $this->middleware('can:servicios.show')->only('show');
        $this->middleware('can:servicios.store')->only('store');
        $this->middleware('can:servicios.update')->only('update');
    }

    // Listar Servicios

    public function index()
    {
        $servicios = Servicio::orderBy('categoria_id', 'asc')
            ->groupBy('categoria_id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get();
        $categorias = Categoria::all();

        return Inertia::render('Servicios/Index', [
            'servicios' => $servicios,
            'categorias' => $categorias->map(function ($categoria) {
                return [
                    'id' => $categoria->id,
                    'nombre' => $categoria->nombre,
                ];
            })->toArray()
        ]);
    }

    // Crear Servicio

    public function create()
    {
        return Inertia::render('Servicios/Create', [
            'categorias' => new CategoriaCollection(
                Categoria::orderBy('tipo', 'asc')
                    ->groupBy('tipo', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
        ]);
    }

    // Guardar Servicio

    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:' . Servicio::class,
        ]);

        Servicio::create($request->all());

        return redirect()->route('servicios.index');
    }

    // Editar Servicio

    public function edit(Servicio $servicio)
    {
        return Inertia::render('Servicios/Edit', [
            'servicio' => $servicio,
            'categorias' => new CategoriaCollection(
                Categoria::orderBy('tipo', 'asc')
                    ->groupBy('tipo', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
        ]);
    }

    // Actualizar Servicio

    /**
     * @throws ValidationException
     */
    public function update($id, Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:servicios,nombre,' . $id,
        ]);

        Servicio::find($id)->update($request->all());
        return redirect()->route('servicios.index');
    }

    // Eliminar Servicio

    public function destroy($id)
    {
        $servicio = Servicio::find($id);

        if (!$servicio) {
            abort(404);
        }
        //verificamos si no hay detalles para eliminar, caso contrario no se puede eliminar por integridad referencial
        $servicioDetalle = ServicioDetalle::where('servicio_id', $servicio->id)->first();
        if($servicioDetalle){
            abort(403, 'No se puede eliminar el producto porque tiene detalles asociados');
        }

        $servicio->delete();

        return response()->noContent();
    }
}
