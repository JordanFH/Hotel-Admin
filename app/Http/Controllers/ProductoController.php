<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriaCollection;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\ProductoDetalle;
use App\Models\ServicioDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductoController extends Controller
{
    // Listar Productos

    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('can:productos')->only('index');
        $this->middleware('can:productos.create')->only('create', 'store');
        $this->middleware('can:productos.edit')->only('edit', 'update');
        $this->middleware('can:productos.destroy')->only('destroy');
        $this->middleware('can:productos.show')->only('show');
        $this->middleware('can:productos.store')->only('store');
        $this->middleware('can:productos.update')->only('update');

    }
    public function index()
    {
        $productos = Producto::orderBy('categoria_id', 'asc')
            ->groupBy('categoria_id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get();
        $categorias = Categoria::all();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias->map(function ($categoria)
            {
                return [
                    'id' => $categoria->id,
                    'nombre' => $categoria->nombre,
                ];
            })->toArray()
        ]);
    }

    // Crear Producto

    public function create()
    {
        return Inertia::render('Productos/Create', [
            'categorias' => new CategoriaCollection(
                Categoria::orderBy('tipo', 'asc')
                    ->groupBy('tipo', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
        ]);
    }

    // Guardar Producto

    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:' . Producto::class,
        ]);

        Producto::create($request->all());

        return redirect()->route('productos.index');
    }

    // Editar Producto

    public function edit(Producto $producto)
    {
        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'categorias' => new CategoriaCollection(
                Categoria::orderBy('tipo', 'asc')
                    ->groupBy('tipo', 'nombre')
                    ->orderBy('nombre', 'asc')
                    ->get()
            ),
        ]);
    }

    // Actualizar Producto

    /**
     * @throws ValidationException
     */
    public function update($id, Request $request)
    {
        $request->validate([
            'nombre' => 'required|unique:productos,nombre,' . $id,
        ]);

        Producto::find($id)->update($request->all());
        return redirect()->route('productos.index');
    }

    // Eliminar Producto

    public function destroy($id)
    {
        $producto = Producto::find($id);

        if (!$producto)
        {
            abort(404);
        }

        //validar si hay detalles con el producto en ese caso no eliminar o dar opcion de eliminar todos
        $productoDetalle = ProductoDetalle::where('producto_id', $id)->first();
        if($productoDetalle){
            abort(409, 'No se puede eliminar el producto porque tiene detalles asociados');
        }

        $producto->delete();

        return response()->noContent();
    }
}
