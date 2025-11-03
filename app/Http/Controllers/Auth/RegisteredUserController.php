<?php
// app/Http/Controllers/Auth/RegisteredUserController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        // Get active programs for selection
        $programs = \App\Models\Program::where('is_active', true)
            ->with('psychologist:id,name')
            ->select('id', 'name', 'description', 'psychologist_id', 'monthly_price')
            ->orderBy('name')
            ->get();

        return Inertia::render('auth/register', [
            'programs' => $programs,
        ]);
    }

    /**
     * Handle an incoming registration request for STUDENTS.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'date_of_birth' => 'required|date|before:today',
            'team' => 'nullable|string|max:255',
            'sport' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'parent' => 'nullable|string|max:255',
            'parent_name' => 'required|string|max:255',
            'program_id' => 'required|exists:programs,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('student');

        Student::create([
            'user_id' => $user->id,
            'date_of_birth' => $request->date_of_birth,
            'team' => $request->team,
            'sport' => $request->sport,
            'country' => $request->country,
            'city' => $request->city,
            'parent' => $request->parent,
            'parent_name' => $request->parent_name,
        ]);

        // Enroll student in selected program
        $program = \App\Models\Program::findOrFail($request->program_id);
        $user->enrollInProgram($program);

        // Unlock the first level of the program
        $firstLevel = $program->firstLevel();
        if ($firstLevel) {
            $firstLevel->unlockFor($user);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
