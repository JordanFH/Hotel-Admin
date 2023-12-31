<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:roles')->only('index');
        $this->middleware('can:roles.create')->only('create');
        $this->middleware('can:roles.store')->only('store');
        $this->middleware('can:roles.edit')->only('edit');
        $this->middleware('can:roles.update')->only('update');
        $this->middleware('can:roles.destroy')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // mostrar todos los roles menos el de administrador
        $roles = Role::where('name', '!=', 'Admin')
            ->where('name', '!=', 'User')
            ->where('name', '!=', 'SuperAdmin')
            ->with('permissions')
            ->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render(
            'Roles/Create',
            ['permissions' => Permission::all()]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'max:255', 'unique:roles'],
            'permissions' => 'required|array',
        ]);

        $role = Role::create(['name' => $request->name]);

        // Definir los permisos por defecto
        $defaultPermissions = [
            'profile.edit',
            'profile.update',
            'profile.destroy',
        ];

        // Obtener permisos del request y agregar los permisos de perfil
        $requestedPermissions = array_merge($request->permissions, $defaultPermissions);

        // Filtrar permisos duplicados
        $uniquePermissions = array_unique($requestedPermissions);

        // Asignar permisos al nuevo rol
        $role->syncPermissions($uniquePermissions);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $role = Role::find($id);

        // Verificar si el rol es "Admin" o "User" y no permitir su eliminación
        if ($role && in_array($role->name, ['Admin', 'User'])) {
            abort(403, 'No puedes eliminar el rol de Admin o User.');
        }

        if ($role) {
            $role->delete();
            return response()->noContent(200);
        } else {
            abort(404, 'Rol no encontrado.');
        }
    }
}
