<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear los roles
        $role0 = Role::findOrCreate('SuperAdmin', 'web');
        $role1 = Role::findOrCreate('Admin', 'web');
        $role2 = Role::findOrCreate('User', 'web');

        $all = [$role0, $role1, $role2];
        $onlyAdmin = [$role0, $role1];
        $onlySuperAdmin = [$role0];


        // Crear el permiso home
        // Permission::findOrCreate('home', 'web');

        // Crear el permiso para las rutas de dashboard y perfil
        Permission::create(['name' => 'dashboard', 'description' => 'Ver Dashboard'])->syncRoles($all);

        Permission::create(['name' => 'profile.edit', 'description' => 'Editar Perfil'])->syncRoles($all);
        Permission::create(['name' => 'profile.update', 'description' => 'Actualizar Perfil'])->syncRoles($all);
        Permission::create(['name' => 'profile.destroy', 'description' => 'Eliminar Perfil'])->syncRoles($all);

        // Crear el permiso para las rutas de roles y permisos
        Permission::create(['name' => 'roles', 'description' => 'Listar Roles'])->syncRoles($onlySuperAdmin);
        Permission::create(['name' => 'roles.create', 'description' => 'Crear Roles'])->syncRoles($onlySuperAdmin);
        Permission::create(['name' => 'roles.store', 'description' => 'Guardar Roles'])->syncRoles($onlySuperAdmin);
        Permission::create(['name' => 'roles.edit', 'description' => 'Editar Roles'])->syncRoles($onlySuperAdmin);
        Permission::create(['name' => 'roles.update', 'description' => 'Actualizar Roles'])->syncRoles($onlySuperAdmin);
        Permission::create(['name' => 'roles.destroy', 'description' => 'Eliminar Roles'])->syncRoles($onlySuperAdmin);

        $routes = [
            'categorias' => 'Categorías',
            'productos' => 'Productos',
            'servicios' => 'Servicios',
            'clientes' => 'Clientes',
            'cotizaciones' => 'Cotizaciones',
            'users' => 'Usuarios',
        ];

        foreach ($routes as $route => $description) {
            Permission::create(['name' => $route, 'description' => "Listar $description"])->syncRoles($all);
            Permission::create(['name' => "$route.create", 'description' => "Crear $description"])->syncRoles($onlyAdmin);
            Permission::create(['name' => "$route.store", 'description' => "Guardar $description"])->syncRoles($onlyAdmin);
            Permission::create(['name' => "$route.edit", 'description' => "Editar $description"])->syncRoles($onlyAdmin);
            Permission::create(['name' => "$route.update", 'description' => "Actualizar $description"])->syncRoles($onlyAdmin);
            Permission::create(['name' => "$route.destroy", 'description' => "Eliminar $description"])->syncRoles($onlyAdmin);
        }
    }
}
