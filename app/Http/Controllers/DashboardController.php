<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('student')) {
            return $this->studentDashboard($user);
        } elseif ($user->hasRole('psychologist')) {
            return $this->psychologistDashboard($user);
        }

        // Fallback para usuarios sin rol específico
        return Inertia::render('dashboard', [
            'userRole' => 'unknown',
            'message' => 'Tu cuenta no tiene un rol asignado. Contacta al administrador.'
        ]);
    }

    /**
     * Dashboard específico para estudiantes
     */
    private function studentDashboard($user): Response
    {
        // Simular datos de gamificación - en producción vendrían de la BD
        $gamificationData = [
            'current_level' => 3,
            'total_achievements' => 12,
            'progress_to_next_level' => 65,
            'completed_sessions' => 8,
            'total_sessions' => 12,
            'weekly_goals' => [
                'completed' => 4,
                'total' => 6
            ]
        ];

        $recentActivity = [
            ['type' => 'session', 'title' => 'Sesión de Concentración', 'date' => '2025-01-15'],
            ['type' => 'achievement', 'title' => 'Logro: Primera Semana', 'date' => '2025-01-14'],
            ['type' => 'level', 'title' => 'Nivel 3 Desbloqueado', 'date' => '2025-01-13'],
        ];

        return Inertia::render('dashboard', [
            'userRole' => 'student',
            'stats' => $gamificationData,
            'recentActivity' => $recentActivity,
            'nextSession' => [
                'title' => 'Técnicas de Respiración',
                'scheduled_at' => '2025-01-18 10:00:00',
                'psychologist' => 'Dr. Juan Pérez'
            ]
        ]);
    }

    /**
     * Dashboard específico para psicólogos
     */
    private function psychologistDashboard($user): Response
    {
        // Simular estadísticas del psicólogo
        $stats = [
            'total_students' => 25,
            'active_students' => 18,
            'sessions_today' => 4,
            'sessions_this_week' => 16,
            'avg_progress' => 78
        ];

        $recentStudents = [
            ['name' => 'María González', 'level' => 3, 'last_session' => '2025-01-15', 'progress' => 85],
            ['name' => 'Carlos Rodríguez', 'level' => 2, 'last_session' => '2025-01-14', 'progress' => 67],
            ['name' => 'Ana López', 'level' => 4, 'last_session' => '2025-01-15', 'progress' => 92],
        ];

        $upcomingAppointments = [
            ['student' => 'Pedro Martínez', 'time' => '10:00', 'type' => 'Seguimiento'],
            ['student' => 'Lucía Fernández', 'time' => '11:30', 'type' => 'Evaluación'],
            ['student' => 'Miguel Torres', 'time' => '14:00', 'type' => 'Terapia'],
        ];

        return Inertia::render('dashboard', [
            'userRole' => 'psychologist',
            'stats' => $stats,
            'recentStudents' => $recentStudents,
            'upcomingAppointments' => $upcomingAppointments,
            'alerts' => [
                'pending_evaluations' => 3,
                'overdue_reports' => 1
            ]
        ]);
    }
}
