<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Mostrar progreso del estudiante
     */
    public function progreso(Request $request): Response
    {
        $user = $request->user();

        // Simular datos de progreso
        $progressData = [
            'current_level' => 3,
            'progress_percentage' => 65,
            'completed_sessions' => 8,
            'total_sessions' => 12,
            'weekly_stats' => [
                ['week' => 'Sem 1', 'sessions' => 2, 'progress' => 20],
                ['week' => 'Sem 2', 'sessions' => 3, 'progress' => 45],
                ['week' => 'Sem 3', 'sessions' => 3, 'progress' => 65],
            ],
            'skills_progress' => [
                ['skill' => 'Concentración', 'level' => 75],
                ['skill' => 'Manejo del Estrés', 'level' => 60],
                ['skill' => 'Confianza', 'level' => 80],
                ['skill' => 'Motivación', 'level' => 55],
            ]
        ];

        return Inertia::render('progreso', [
            'progress' => $progressData,
            'recommendations' => [
                'Continúa practicando las técnicas de respiración',
                'Intenta completar al menos 3 sesiones esta semana',
                'Revisa los videos de motivación en multimedia'
            ]
        ]);
    }

    /**
     * Mostrar niveles disponibles
     */
    public function niveles(Request $request): Response
    {
        $levels = [
            [
                'id' => 1,
                'title' => 'Fundamentos',
                'description' => 'Conceptos básicos de psicología deportiva',
                'status' => 'completed',
                'progress' => 100,
                'sessions' => 4,
                'unlocked' => true
            ],
            [
                'id' => 2,
                'title' => 'Concentración',
                'description' => 'Técnicas de enfoque y concentración',
                'status' => 'completed',
                'progress' => 100,
                'sessions' => 5,
                'unlocked' => true
            ],
            [
                'id' => 3,
                'title' => 'Manejo del Estrés',
                'description' => 'Estrategias para controlar la presión',
                'status' => 'current',
                'progress' => 65,
                'sessions' => 6,
                'unlocked' => true
            ],
            [
                'id' => 4,
                'title' => 'Confianza',
                'description' => 'Desarrollo de autoconfianza',
                'status' => 'locked',
                'progress' => 0,
                'sessions' => 5,
                'unlocked' => false
            ]
        ];

        return Inertia::render('niveles', [
            'levels' => $levels,
            'currentLevel' => 3
        ]);
    }

    /**
     * Mostrar contenido multimedia
     */
    public function multimedia(Request $request): Response
    {
        $content = [
            'videos' => [
                ['title' => 'Técnicas de Respiración', 'duration' => '10:30', 'category' => 'Relajación'],
                ['title' => 'Visualización Positiva', 'duration' => '15:45', 'category' => 'Motivación'],
                ['title' => 'Manejo de la Ansiedad', 'duration' => '12:20', 'category' => 'Control'],
            ],
            'audios' => [
                ['title' => 'Meditación Guiada', 'duration' => '20:00', 'category' => 'Relajación'],
                ['title' => 'Afirmaciones Positivas', 'duration' => '8:30', 'category' => 'Motivación'],
            ],
            'readings' => [
                ['title' => 'Guía de Concentración', 'pages' => 12, 'category' => 'Fundamentos'],
                ['title' => 'Ejercicios Mentales', 'pages' => 8, 'category' => 'Práctica'],
            ]
        ];

        return Inertia::render('multimedia', [
            'content' => $content,
            'favorites' => [1, 3, 5] // IDs de contenido favorito
        ]);
    }

    /**
     * Mostrar videollamadas
     */
    public function videollamadas(Request $request): Response
    {
        $sessions = [
            'upcoming' => [
                [
                    'id' => 1,
                    'psychologist' => 'Dr. Juan Pérez',
                    'date' => '2025-01-18',
                    'time' => '10:00',
                    'duration' => 60,
                    'type' => 'Seguimiento'
                ]
            ],
            'past' => [
                [
                    'psychologist' => 'Dr. Juan Pérez',
                    'date' => '2025-01-15',
                    'time' => '10:00',
                    'duration' => 60,
                    'rating' => 5
                ]
            ]
        ];

        return Inertia::render('videollamadas', [
            'sessions' => $sessions
        ]);
    }

    /**
     * Mostrar logros
     */
    public function logros(Request $request): Response
    {
        $achievements = [
            [
                'id' => 1,
                'title' => 'Primera Sesión',
                'description' => 'Completaste tu primera sesión',
                'icon' => 'star',
                'earned' => true,
                'date_earned' => '2025-01-10'
            ],
            [
                'id' => 2,
                'title' => 'Una Semana',
                'description' => 'Completaste una semana de entrenamiento',
                'icon' => 'calendar',
                'earned' => true,
                'date_earned' => '2025-01-14'
            ],
            [
                'id' => 3,
                'title' => 'Nivel Maestro',
                'description' => 'Alcanza el nivel 5',
                'icon' => 'trophy',
                'earned' => false,
                'date_earned' => null
            ]
        ];

        return Inertia::render('logros', [
            'achievements' => $achievements,
            'totalEarned' => 2,
            'totalAvailable' => 3
        ]);
    }

    /**
     * Mostrar información de suscripción
     */
    public function suscripcion(Request $request): Response
    {
        $subscription = [
            'plan' => 'Premium',
            'status' => 'active',
            'next_billing' => '2025-02-15',
            'features' => [
                'Acceso ilimitado a contenido',
                'Videollamadas con psicólogos',
                'Seguimiento personalizado',
                'Contenido exclusivo'
            ]
        ];

        return Inertia::render('suscripcion', [
            'subscription' => $subscription,
            'plans' => [
                ['name' => 'Básico', 'price' => 29, 'features' => ['Acceso básico', '2 videollamadas/mes']],
                ['name' => 'Premium', 'price' => 59, 'features' => ['Acceso completo', 'Videollamadas ilimitadas']],
            ]
        ]);
    }
}
