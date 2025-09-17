<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
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
            'manage payments',
            'manage communication',
            'manage appointments',
            'create videocalls',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Crear roles y asignar permisos
        $studentRole = Role::create(['name' => 'student']);
        $psychologistRole = Role::create(['name' => 'psychologist']);

        // Permisos para estudiantes
        $studentRole->givePermissionTo([
            'view dashboard',
            'view profile',
            'edit profile',
            'view progress',
            'view levels',
            'view multimedia',
            'join videocalls',
            'view achievements',
            'manage subscription',
        ]);

        // Permisos para psicólogos (todos los permisos)
        $psychologistRole->givePermissionTo(Permission::all());

        // Crear usuarios de ejemplo
        $psychologist = User::factory()->create([
            'name' => 'Dr. Juan Pérez',
            'email' => 'psicologo@example.com',
            'password' => '123456'
        ]);
        $psychologist->assignRole('psychologist');

        $student = User::factory()->create([
            'name' => 'María González',
            'email' => 'estudiante@example.com',
            'password' => '123456'
        ]);
        $student->assignRole('student');
    }
}
