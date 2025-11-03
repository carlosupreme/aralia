<?php

namespace App\Http\Middleware;

use App\Models\Program;
use App\Models\Level;
use App\Models\Multimedia;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProgramPayment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        // Only check for students
        if (!$user || !$user->isStudent()) {
            return $next($request);
        }

        // Determine the program from the route
        $program = null;

        // Check if we have a direct program parameter
        if ($request->route('program')) {
            $program = $request->route('program');
        }
        // Check if we have a level parameter
        elseif ($request->route('level')) {
            $level = $request->route('level');
            if ($level instanceof Level) {
                $program = $level->program;
            }
        }
        // Check if we have a multimedia parameter
        elseif ($request->route('multimedia')) {
            $multimedia = $request->route('multimedia');
            if ($multimedia instanceof Multimedia) {
                $program = $multimedia->level->program;
            }
        }

        // If no program found, allow the request (other middleware will handle authorization)
        if (!$program || !($program instanceof Program)) {
            return $next($request);
        }

        // Check if student has access to the program
        if (!$user->hasAccessToProgram($program)) {
            return redirect()->route('payments.index', $program)
                ->with('error', 'Tu pago está vencido. Por favor, sube tu comprobante de pago para continuar accediendo al contenido.');
        }

        return $next($request);
    }
}
