<?php
// database/seeders/RolesAndPermissionsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\Student;
use App\Models\Program;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view dashboard', 'view profile', 'edit profile',
            'view progress', 'view levels', 'view multimedia',
            'join videocalls', 'view achievements', 'manage subscription',
            'manage users', 'view all students', 'manage students',
            'manage parents', 'manage programs', 'create programs',
            'edit programs', 'delete programs', 'manage levels',
            'create levels', 'edit levels', 'delete levels',
            'manage multimedia', 'create multimedia', 'edit multimedia',
            'delete multimedia', 'enroll students', 'unlock levels',
            'manage payments', 'manage communication', 'manage appointments',
            'create videocalls', 'view reports', 'view enrolled programs',
            'access unlocked levels', 'view program multimedia',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $psychologistRole = Role::firstOrCreate(['name' => 'psychologist']);

        $studentRole->syncPermissions([
            'view dashboard', 'view profile', 'edit profile',
            'view progress', 'view levels', 'view multimedia',
            'join videocalls', 'view achievements', 'manage subscription',
            'view enrolled programs', 'access unlocked levels', 'view program multimedia',
        ]);

        $psychologistRole->syncPermissions(Permission::all());

        // Psicólogo de ejemplo
        $psychologist = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Dr. Admin',
                'password' => Hash::make('password')
            ]
        );

        if (!$psychologist->hasRole('psychologist')) {
            $psychologist->assignRole('psychologist');
        }

        // Estudiante de ejemplo
        $studentUser = User::firstOrCreate(
            ['email' => 'estudiante@example.com'],
            [
                'name' => 'Carlos Rodríguez',
                'password' => Hash::make('password')
            ]
        );

        if (!$studentUser->hasRole('student')) {
            $studentUser->assignRole('student');
        }

        Student::firstOrCreate(
            ['user_id' => $studentUser->id],
            [
                'date_of_birth' => now()->subYears(16),
                'team' => 'Águilas FC',
                'sport' => 'Fútbol',
                'country' => 'México',
                'city' => 'Oaxaca',
                'parent' => '+52 951 123 4567',
                'parent_name' => 'María Rodríguez',
            ]
        );

        // Crear programa de ejemplo
        $program = Program::firstOrCreate(
            ['name' => 'Programa de Desarrollo Mental'],
            [
                'description' => 'Programa completo para el desarrollo de habilidades mentales en deportistas.',
                'psychologist_id' => $psychologist->id,
                'monthly_price' => 500.00,
            ]
        );

        // Inscribir al estudiante en el programa
        if (!$program->hasStudent($studentUser)) {
            $studentUser->enrollInProgram($program);
        }
    }
}
