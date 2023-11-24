<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CotizacionController;
use App\Http\Controllers\CotizacionDetalleController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportCotizacionController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (Auth::check()) { // Verificar si el usuario está autenticado
        return redirect()->route('dashboard'); // Redirigir al dashboard
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('users', UserController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('categorias', CategoriaController::class);
    Route::resource('servicios', ServicioController::class)->names('servicios');
    Route::resource('productos', ProductoController::class)->names('productos');
    Route::resource('clientes', ClienteController::class)->names('clientes');
    Route::resource('roles', RoleController::class)->names('roles');
    Route::resource('cotizaciones', CotizacionController::class)->names('cotizaciones');

    //para cotizacion
    Route::get('/report/cotizacion', [ReportCotizacionController::class, 'report'])->name('cotizaciones.report');
    Route::get('/report/cotizacion/edit/{cotizacion_id}', [ReportCotizacionController::class, 'reportEdit'])->name('cotizaciones.edit.report');
    Route::resource('cotizaciondetalles', CotizacionDetalleController::class); //->only(['store', 'update', 'destroy']);
    Route::post('/cotizaciones/detalles/{id}', [CotizacionDetalleController::class, 'storeDetalle'])->name('cotizaciones.storeDetalle');
});

require __DIR__ . '/auth.php';
