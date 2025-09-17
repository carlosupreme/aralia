<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Admin\AdminController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard dinámico según el rol del usuario
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas específicas para estudiantes
    Route::middleware('role:student')->group(function () {
        Route::get('progreso', [StudentController::class, 'progreso'])->name('progreso');
        Route::get('niveles', [StudentController::class, 'niveles'])->name('niveles');
        Route::get('multimedia', [StudentController::class, 'multimedia'])->name('multimedia');
        Route::get('videollamadas', [StudentController::class, 'videollamadas'])->name('videollamadas');
        Route::get('logros', [StudentController::class, 'logros'])->name('logros');
        Route::get('suscripcion', [StudentController::class, 'suscripcion'])->name('suscripcion');
    });

    // Rutas administrativas (solo para psicólogos)
    Route::middleware('role:psychologist')->prefix('admin')->name('admin.')->group(function () {
        Route::get('usuarios', [AdminController::class, 'usuarios'])->name('usuarios');
        Route::get('estudiantes', [AdminController::class, 'estudiantes'])->name('estudiantes');
        Route::get('padres', [AdminController::class, 'padres'])->name('padres');
        Route::get('programas', [AdminController::class, 'programas'])->name('programas');
        Route::get('pagos', [AdminController::class, 'pagos'])->name('pagos');
        Route::get('comunicacion', [AdminController::class, 'comunicacion'])->name('comunicacion');
        Route::get('citas', [AdminController::class, 'citas'])->name('citas');
    });

    // Rutas de soporte (accesibles por ambos roles)
    Route::get('manual', function () {
        return Inertia::render('manual');
    })->name('manual');

    Route::get('soporte', function () {
        return Inertia::render('soporte');
    })->name('soporte');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
