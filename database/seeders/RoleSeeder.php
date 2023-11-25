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
        // Buscar o crear los roles
        $role0 = Role::findOrCreate('SuperAdmin', 'web');
        $role1 = Role::findOrCreate('Admin', 'web');
        $role2 = Role::findOrCreate('User', 'web');

        // Buscar o crear el permiso home
        // Permission::findOrCreate('home', 'web');

        // Buscar o crear el permiso para las rutas de dashboard y profile
        Permission::findOrCreate('dashboard', 'web')->syncRoles([$role0, $role1, $role2]);

        Permission::findOrCreate('profile.edit', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('profile.update', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('profile.destroy', 'web')->syncRoles([$role0, $role1, $role2]);

        // Buscar o crear el permiso para las rutas de categorias
        Permission::findOrCreate('categorias', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('categorias.create', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('categorias.store', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('categorias.edit', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('categorias.update', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('categorias.destroy', 'web')->syncRoles([$role0, $role1]);

        // Buscar o crear el permiso para las rutas de productos
        Permission::findOrCreate('productos', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('productos.create', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('productos.store', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('productos.edit', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('productos.update', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('productos.destroy', 'web')->syncRoles([$role0, $role1]);

        // Buscar o crear el permiso para las rutas de servicios
        Permission::findOrCreate('servicios', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('servicios.create', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('servicios.store', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('servicios.edit', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('servicios.update', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('servicios.destroy', 'web')->syncRoles([$role0, $role1]);

        // Buscar o crear el permiso para las rutas de clientes
        Permission::findOrCreate('clientes', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('clientes.create', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('clientes.store', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('clientes.edit', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('clientes.update', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('clientes.destroy', 'web')->syncRoles([$role0, $role1]);

        // Buscar o crear el permiso para las rutas de cotizaciones
        Permission::findOrCreate('cotizaciones', 'web')->syncRoles([$role0, $role1, $role2]);
        Permission::findOrCreate('cotizaciones.create', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('cotizaciones.store', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('cotizaciones.edit', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('cotizaciones.update', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('cotizaciones.destroy', 'web')->syncRoles([$role0, $role1]);

        // Buscar o crear el permiso para las rutas de usuarios
        Permission::findOrCreate('users', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('users.create', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('users.store', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('users.edit', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('users.update', 'web')->syncRoles([$role0, $role1]);
        Permission::findOrCreate('users.destroy', 'web')->syncRoles([$role0, $role1]);

        // Buscar o crear el permiso para las rutas de roles
        Permission::findOrCreate('roles', 'web')->syncRoles([$role0]);
        Permission::findOrCreate('roles.create', 'web')->syncRoles([$role0]);
        Permission::findOrCreate('roles.store', 'web')->syncRoles([$role0]);
        Permission::findOrCreate('roles.edit', 'web')->syncRoles([$role0]);
        Permission::findOrCreate('roles.update', 'web')->syncRoles([$role0]);
        Permission::findOrCreate('roles.destroy', 'web')->syncRoles([$role0]);
    }
}
