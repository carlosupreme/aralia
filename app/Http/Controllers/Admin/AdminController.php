<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class AdminController extends Controller
{
    /**
     * Gestión de usuarios
     */
    public function usuarios(Request $request): Response
    {
        // Simular datos de usuarios
        $users = [
            [
                'id' => 1,
                'name' => 'María González',
                'email' => 'maria@example.com',
                'role' => 'student',
                'status' => 'active',
                'created_at' => '2025-01-10'
            ],
            [
                'id' => 2,
                'name' => 'Carlos Rodríguez',
                'email' => 'carlos@example.com',
                'role' => 'student',
                'status' => 'active',
                'created_at' => '2025-01-08'
            ],
            [
                'id' => 3,
                'name' => 'Dr. Ana López',
                'email' => 'ana@example.com',
                'role' => 'psychologist',
                'status' => 'active',
                'created_at' => '2025-01-05'
            ]
        ];

        return Inertia::render('admin/usuarios', [
            'users' => $users,
            'stats' => [
                'total_users' => 45,
                'students' => 38,
                'psychologists' => 7,
                'active' => 42,
                'inactive' => 3
            ]
        ]);
    }

    /**
     * Gestión de estudiantes
     */
    public function estudiantes(Request $request): Response
    {
        $students = [
            [
                'id' => 1,
                'name' => 'María González',
                'email' => 'maria@example.com',
                'level' => 3,
                'progress' => 65,
                'psychologist' => 'Dr. Juan Pérez',
                'sessions_completed' => 8,
                'last_activity' => '2025-01-15'
            ],
            [
                'id' => 2,
                'name' => 'Carlos Rodríguez',
                'email' => 'carlos@example.com',
                'level' => 2,
                'progress' => 45,
                'psychologist' => 'Dr. Juan Pérez',
                'sessions_completed' => 5,
                'last_activity' => '2025-01-14'
            ]
        ];

        return Inertia::render('admin/estudiantes', [
            'students' => $students,
            'filters' => [
                'levels' => [1, 2, 3, 4, 5],
                'psychologists' => ['Dr. Juan Pérez', 'Dr. Ana López'],
                'status' => ['active', 'inactive', 'on-hold']
            ]
        ]);
    }

    /**
     * Gestión de padres
     */
    public function padres(Request $request): Response
    {
        $parents = [
            [
                'id' => 1,
                'name' => 'Roberto González',
                'email' => 'roberto@example.com',
                'student' => 'María González',
                'phone' => '+52 55 1234 5678',
                'notifications_enabled' => true
            ],
            [
                'id' => 2,
                'name' => 'Carmen Rodríguez',
                'email' => 'carmen@example.com',
                'student' => 'Carlos Rodríguez',
                'phone' => '+52 55 8765 4321',
                'notifications_enabled' => false
            ]
        ];

        return Inertia::render('admin/padres', [
            'parents' => $parents,
            'stats' => [
                'total' => 32,
                'with_notifications' => 28,
                'active_communications' => 15
            ]
        ]);
    }

    /**
     * Gestión de programas
     */
    public function programas(Request $request): Response
    {
        $programs = [
            [
                'id' => 1,
                'name' => 'Fundamentos',
                'description' => 'Programa básico de psicología deportiva',
                'levels' => 4,
                'duration_weeks' => 8,
                'students_enrolled' => 25,
                'status' => 'active'
            ],
            [
                'id' => 2,
                'name' => 'Avanzado',
                'description' => 'Técnicas avanzadas de rendimiento',
                'levels' => 6,
                'duration_weeks' => 12,
                'students_enrolled' => 15,
                'status' => 'active'
            ]
        ];

        return Inertia::render('admin/programas', [
            'programs' => $programs,
            'categories' => ['Fundamentos', 'Intermedio', 'Avanzado', 'Especialización']
        ]);
    }

    /**
     * Gestión de pagos
     */
    public function pagos(Request $request): Response
    {
        $payments = [
            [
                'id' => 1,
                'student' => 'María González',
                'plan' => 'Premium',
                'amount' => 59.00,
                'status' => 'completed',
                'date' => '2025-01-15',
                'next_billing' => '2025-02-15'
            ],
            [
                'id' => 2,
                'student' => 'Carlos Rodríguez',
                'plan' => 'Básico',
                'amount' => 29.00,
                'status' => 'pending',
                'date' => '2025-01-14',
                'next_billing' => '2025-02-14'
            ]
        ];

        return Inertia::render('admin/pagos', [
            'payments' => $payments,
            'stats' => [
                'monthly_revenue' => 2450.00,
                'pending_payments' => 3,
                'failed_payments' => 1,
                'active_subscriptions' => 38
            ]
        ]);
    }

    /**
     * Gestión de comunicación
     */
    public function comunicacion(Request $request): Response
    {
        $communications = [
            'forums' => [
                ['title' => 'Técnicas de Respiración', 'posts' => 25, 'active' => true],
                ['title' => 'Experiencias de Competencia', 'posts' => 18, 'active' => true]
            ],
            'chat_rooms' => [
                ['name' => 'Sala General', 'participants' => 15, 'status' => 'active'],
                ['name' => 'Nivel Avanzado', 'participants' => 8, 'status' => 'active']
            ],
            'recent_messages' => [
                ['from' => 'María González', 'message' => '¿Alguien más practica meditación?', 'time' => '10:30'],
                ['from' => 'Carlos Rodríguez', 'message' => 'Excelente sesión hoy', 'time' => '09:45']
            ]
        ];

        return Inertia::render('admin/comunicacion', [
            'communications' => $communications
        ]);
    }

    /**
     * Gestión de citas
     */
    public function citas(Request $request): Response
    {
        $appointments = [
            'today' => [
                [
                    'id' => 1,
                    'student' => 'María González',
                    'time' => '10:00',
                    'duration' => 60,
                    'type' => 'Seguimiento',
                    'status' => 'confirmed'
                ],
                [
                    'id' => 2,
                    'student' => 'Carlos Rodríguez',
                    'time' => '11:30',
                    'duration' => 45,
                    'type' => 'Evaluación',
                    'status' => 'pending'
                ]
            ],
            'upcoming' => [
                [
                    'student' => 'Ana López',
                    'date' => '2025-01-18',
                    'time' => '09:00',
                    'type' => 'Primera consulta'
                ]
            ]
        ];

        return Inertia::render('admin/citas', [
            'appointments' => $appointments,
            'calendar' => [
                'current_date' => '2025-01-17',
                'appointments_this_week' => 12,
                'available_slots' => 8
            ]
        ]);
    }
}
