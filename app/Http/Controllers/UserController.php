<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct()
    {
        // Solo permitir a los usuarios con el rol de administrador acceder a todas estas rutas
        $this->middleware('can:users')->only('index');
        $this->middleware('can:users.create')->only('create');
        $this->middleware('can:users.store')->only('store');
        $this->middleware('can:users.edit')->only('edit');
        $this->middleware('can:users.update')->only('update');
        $this->middleware('can:users.destroy')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()->hasRole('SuperAdmin')) {
            $users = User::where('id', '!=', Auth::user()->id)
                ->whereHas('roles', function ($query) {
                    $query->where('name', '!=', 'SuperAdmin');
                })
                ->orderBy('name')
                ->with('roles')
                ->get();
        } else {
            $users = User::where('id', '!=', Auth::user()->id)
                ->whereHas('roles', function ($query) {
                    $query->where('name', '!=', 'SuperAdmin')
                        ->where('name', '!=', 'Admin');
                })
                ->orderBy('name')
                ->with('roles')
                ->get();
        }
        return Inertia::render('Users/Index', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        // Si el usuario actual es SuperAdmin, mostrar todos los roles menos SuperAdmin
        if (Auth::user()->hasRole('SuperAdmin|Admin')) {
            $roles = Role::where('name', '!=', 'SuperAdmin')->get();
        }
        return Inertia::render('Users/Edit', ['user' => $user, 'roles' => $roles]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        /*// Asegurarse de que el usuario autenticado tenga permiso para actualizar roles
        if (!Auth::user()->can('update_roles')) {
            abort(403, 'No tienes permiso para actualizar roles de usuario.');
        }*/


        // Validar la solicitud
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);


        // Encontrar al usuario por ID
        $user = User::findOrFail($id);

        // Verificar si el usuario no es el usuario actual
        if ($user->id === Auth::user()->id) {
            abort(403, 'No puedes cambiar tu propio rol.');
        }

        // Actualizar el rol del usuario
        $user->syncRoles([$request->role]);


        return redirect()->route('users.index')
            ->with('success', 'Rol actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Encontrar al usuario por ID
        $user = User::find($id);

        // Verificar si el usuario existe
        if (!$user) {
            abort(404);
        }

        /*// Verificar si el usuario autenticado tiene permiso para eliminar usuarios
        if (!Auth::user()->can('delete_users')) {
            return response()->json(['message' => 'No tienes permiso para eliminar usuarios'], 403);
        }*/

        // Verificar si el usuario que se va a eliminar no es el usuario autenticado
        if ($user->id === Auth::user()->id) {
            abort(403, 'No puedes eliminarte a ti mismo desde aquí.');
        }

        // Eliminar al usuario
        $user->delete();

        return response()->noContent();
    }

    // Función para devolver los roles del usuario actual
    public function info()
    {
        $user = Auth::user();

        if ($user) {
            $user->load('roles');
        }

        return response()->json($user);
    }
}
