<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\MultimediaController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;

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

    // Program management routes
    Route::resource('programs', ProgramController::class);
    Route::post('programs/{program}/enroll', [ProgramController::class, 'enrollStudent'])->name('programs.enroll');
    Route::delete('programs/{program}/students/{student}', [ProgramController::class, 'removeStudent'])->name('programs.remove-student');

    // Level management routes (nested under programs)
    Route::resource('programs.levels', LevelController::class)->shallow();
    Route::get('levels/{level}/learn', [LevelController::class, 'studentView'])->name('levels.learn')->middleware('check.payment');
    Route::post('levels/{level}/unlock/{student}', [LevelController::class, 'unlockForStudent'])->name('levels.unlock');
    Route::post('levels/{level}/complete/{student}', [LevelController::class, 'markComplete'])->name('levels.complete');

    // Multimedia management routes (nested under levels)
    Route::resource('levels.multimedia', MultimediaController::class)->shallow();

    // Multimedia streaming and progress routes (protected by payment middleware)
    Route::get('multimedia/{multimedia}/stream', [MultimediaController::class, 'stream'])->name('multimedia.stream')->middleware('check.payment');
    Route::get('multimedia/{multimedia}/progress', [MultimediaController::class, 'getProgress'])->name('multimedia.progress.get')->middleware('check.payment');
    Route::post('multimedia/{multimedia}/progress', [MultimediaController::class, 'updateProgress'])->name('multimedia.progress.update')->middleware('check.payment');

    // File upload routes
    Route::post('upload/file', [FileUploadController::class, 'upload'])->name('upload.file');
    Route::delete('upload/file', [FileUploadController::class, 'delete'])->name('upload.delete');
    Route::get('upload/info', [FileUploadController::class, 'info'])->name('upload.info');

    // Payment routes (student)
    Route::middleware('role:student')->group(function () {
        Route::get('payments', [PaymentController::class, 'studentIndex'])->name('student.payments.index');
        Route::get('programs/{program}/payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('programs/{program}/payments/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('programs/{program}/payments', [PaymentController::class, 'store'])->name('payments.store');
    });

    // Payment routes (admin/psychologist)
    Route::middleware('role:psychologist')->group(function () {
        Route::get('admin/payments', [PaymentController::class, 'adminIndex'])->name('admin.payments.index');
        Route::post('payments/{payment}/approve', [PaymentController::class, 'approve'])->name('payments.approve');
        Route::post('payments/{payment}/reject', [PaymentController::class, 'reject'])->name('payments.reject');
    });

    // Notification routes (accessible by both students and admin)
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

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
