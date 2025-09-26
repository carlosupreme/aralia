<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos
        $permissions = [
            // Permisos generales
            'view dashboard',
            'view profile',
            'edit profile',

            // Permisos de estudiante
            'view progress',
            'view levels',
            'view multimedia',
            'join videocalls',
            'view achievements',
            'manage subscription',

            // Permisos de psicólogo
            'manage users',
            'view all students',
            'manage students',
            'manage parents',
            'manage programs',
            'create programs',
            'edit programs',
            'delete programs',
            'manage levels',
            'create levels',
            'edit levels',
            'delete levels',
            'manage multimedia',
            'create multimedia',
            'edit multimedia',
            'delete multimedia',
            'enroll students',
            'unlock levels',
            'manage payments',
            'manage communication',
            'manage appointments',
            'create videocalls',
            'view reports',

            // Permisos de estudiante para programas
            'view enrolled programs',
            'access unlocked levels',
            'view program multimedia',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Crear roles y asignar permisos
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $psychologistRole = Role::firstOrCreate(['name' => 'psychologist']);

        // Permisos para estudiantes
        $studentRole->syncPermissions([
            'view dashboard',
            'view profile',
            'edit profile',
            'view progress',
            'view levels',
            'view multimedia',
            'join videocalls',
            'view achievements',
            'manage subscription',
            'view enrolled programs',
            'access unlocked levels',
            'view program multimedia',
        ]);

        // Permisos para psicólogos (todos los permisos)
        $psychologistRole->syncPermissions(Permission::all());

        // Crear usuarios de ejemplo
        $psychologist = User::factory()->create(['email' => 'admin@admin.com']);

        if (!$psychologist->hasRole('psychologist')) {
            $psychologist->assignRole('psychologist');
        }

        $student = User::firstOrCreate(
            ['email' => 'estudiante@example.com'],
            [
                'name' => 'María González',
                'password' => Hash::make('password')
            ]
        );
        if (!$student->hasRole('student')) {
            $student->assignRole('student');
        }
    }
}
