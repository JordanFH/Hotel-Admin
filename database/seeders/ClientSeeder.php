<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cliente::create([
            'nombre' => "Cliente 1",
            'empresa' => "empresa SAC",
            'dni' => "12345678",
            'ruc' => "12345678901",
            'telefono' => "963852741",
            'correo' => "cliente@gmail.com",
            'direccion' => "direccion 1"]);
        Cliente::create([
            'nombre' => "Cliente 2",
            'empresa' => "empresa2 SAC",
            'dni' => "22345678",
            'ruc' => "22345678901",
            'telefono' => "263852741",
            'correo' => "cliente2@gmail.com",
            'direccion' => "direccion 2"]);
    }
}
