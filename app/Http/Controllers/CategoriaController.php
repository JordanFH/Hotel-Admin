<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Models\Categoria;
use Illuminate\Support\Facades\Validator;


class CategoriaController extends Controller
{
    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('can:categorias')->only('index');
        $this->middleware('can:categorias.create')->only('create');
        $this->middleware('can:categorias.edit')->only('edit');
        $this->middleware('can:categorias.destroy')->only('destroy');
        $this->middleware('can:categorias.store')->only('store');
        $this->middleware('can:categorias.update')->only('update');
    }

    // Listar Categorías

    public function index()
    {
        $categorias = Categoria::orderBy('tipo', 'asc')
                        ->groupBy('tipo', 'nombre')
                        ->orderBy('nombre', 'asc')
                        ->get();
        return Inertia::render('Categorias/Index', ['categorias' => $categorias]);
    }

    // Crear Categoría

    public function create()
    {
        return Inertia::render('Categorias/Create');
    }

    // Guardar Categoría

    /**
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|unique:' . Categoria::class,
            'tipo' => 'required',
        ]);

        Categoria::create($validatedData);

        return redirect()->route('categorias.index');
    }

    // Editar Categoría

    public function edit(Categoria $categoria)
    {
        return Inertia::render('Categorias/Edit', [
            'categoria' => $categoria
        ]);
    }

    // Actualizar Categoría

    /**
     * @throws ValidationException
     */
    public function update($id, Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|unique:categorias,nombre,'.$id,
            'tipo' => 'required',
        ]);

        $categoria = Categoria::find($id);
        $categoria->update($data);
        // return $categoria;

        return redirect()->route('categorias.index');
    }

    // Eliminar Categoría

/*    public function destroy($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'La categoría no existe'], 404);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada correctamente']);
    }*/

    public function destroy($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            abort(404);
        }

        $categoria->delete();

        return response()->noContent();
    }

}
