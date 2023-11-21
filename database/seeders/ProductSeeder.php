<?php

namespace Database\Seeders;

use App\Models\Producto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Producto::create([
            'nombre' => "Producto 1",
            'categoria_id' => 1,
            'precio' => 100,
            'stock' => 10,
            'categoria_id' => 1,
        ]);

        Producto::create([
            'nombre' => "Producto 2",
            'categoria_id' => 1,
            'precio' => 200,
            'stock' => 20,
            'categoria_id' => 2,
        ]);
    }
}
