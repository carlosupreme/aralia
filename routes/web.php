<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Sports Psychology App Routes
    Route::get('progreso', function () {
        return Inertia::render('progreso');
    })->name('progreso');

    Route::get('niveles', function () {
        return Inertia::render('niveles');
    })->name('niveles');

    Route::get('multimedia', function () {
        return Inertia::render('multimedia');
    })->name('multimedia');

    Route::get('videollamadas', function () {
        return Inertia::render('videollamadas');
    })->name('videollamadas');

    Route::get('logros', function () {
        return Inertia::render('logros');
    })->name('logros');

    // Admin Routes (for psychologists)
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('usuarios', function () {
            return Inertia::render('admin/usuarios');
        })->name('usuarios');

        Route::get('estudiantes', function () {
            return Inertia::render('admin/estudiantes');
        })->name('estudiantes');

        Route::get('padres', function () {
            return Inertia::render('admin/padres');
        })->name('padres');

        Route::get('programas', function () {
            return Inertia::render('admin/programas');
        })->name('programas');

        Route::get('pagos', function () {
            return Inertia::render('admin/pagos');
        })->name('pagos');

        Route::get('comunicacion', function () {
            return Inertia::render('admin/comunicacion');
        })->name('comunicacion');

        Route::get('citas', function () {
            return Inertia::render('admin/citas');
        })->name('citas');
    });

    // Support Routes
    Route::get('manual', function () {
        return Inertia::render('manual');
    })->name('manual');

    Route::get('soporte', function () {
        return Inertia::render('soporte');
    })->name('soporte');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
