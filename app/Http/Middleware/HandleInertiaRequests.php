<?php
// app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getPermissionNames(),

                    // Datos adicionales para gamificación (solo estudiantes)
                    'gamification' => $request->user()->isStudent() && $request->user()->student ? [
                        'current_level' => $request->user()->student->current_level,
                        'total_achievements' => count($request->user()->student->achievements ?? []),
                        'progress_to_next_level' => $this->calculateProgressPercentage($request->user()->student),
                    ] : null,

                    // Perfil del estudiante si existe
                    'student' => $request->user()->isStudent() && $request->user()->student ? [
                        'date_of_birth' => $request->user()->student->date_of_birth?->format('Y-m-d'),
                        'team' => $request->user()->student->team,
                        'sport' => $request->user()->student->sport,
                        'country' => $request->user()->student->country,
                        'city' => $request->user()->student->city,
                        'parent' => $request->user()->student->parent,
                        'parent_name' => $request->user()->student->parent_name,
                        'total_points' => $request->user()->student->total_points,
                        'current_level' => $request->user()->student->current_level,
                        'subscription_status' => $request->user()->student->subscription_status,
                        'subscription_expires_at' => $request->user()->student->subscription_expires_at?->format('Y-m-d'),
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }

    /**
     * Calcular porcentaje de progreso al siguiente nivel
     */
    private function calculateProgressPercentage($student): float
    {
        if (!$student) {
            return 0;
        }

        $pointsForNextLevel = $student->current_level * 100;
        $currentLevelPoints = $student->total_points % $pointsForNextLevel;

        return round(($currentLevelPoints / $pointsForNextLevel) * 100, 2);
    }
}
