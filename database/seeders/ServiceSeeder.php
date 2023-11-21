<?php

namespace Database\Seeders;

use App\Models\Servicio;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Servicio::create([
            'nombre' => "Servicio 1",
            'categoria_id' => 2,
            'costo' => 100,
        ]);

        Servicio::create([
            'nombre' => "Servicio 2",
            'categoria_id' => 2,
            'costo' => 200,
        ]);
    }
}
