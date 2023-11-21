<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Categoria::create([
            'nombre' => "Categoria 1 Product",
            'tipo' => 'Producto', // 'producto' o 'servicio'
        ]);

        Categoria::create([
            'nombre' => "Categoria 2 Service",
            'tipo' => 'Servicio', // 'producto' o 'servicio'
        ]);

    }
}
