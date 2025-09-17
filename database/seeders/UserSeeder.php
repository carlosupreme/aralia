<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Permission::create(['name' => 'see users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'delete users']);

        Permission::create(['name' => 'see levels']);
        Permission::create(['name' => 'edit levels']);
        Permission::create(['name' => 'create levels']);
        Permission::create(['name' => 'delete levels']);

        Permission::create(['name' => 'see calls']);
        Permission::create(['name' => 'create calls']);
        Permission::create(['name' => 'edit calls']);
        Permission::create(['name' => 'delete calls']);

        Permission::create(['name' => 'watch rewards']);
        Permission::create(['name' => 'create rewards']);
        Permission::create(['name' => 'edit rewards']);
        Permission::create(['name' => 'delete rewards']);

        Permission::create(['name' => 'manage suscribtions']);

        Permission::create(['name' => 'see progress']);
        Permission::create(['name' => 'see media content']);

        $professionalUser = User::query()->create([
            'name' => 'Profesional',
            'email' => 'admin@admin.co',
            'password' => 'password',
            'users.email_verified_at' => now()
        ]);

        $roleProfessional = Role::create(['name' => 'Psicologo']);
        $professionalUser->assignRole('Psicologo');
        $permissionsProfessional = Permission::query()->pluck('name');
        $roleProfessional->syncPermissions($permissionsProfessional);

        $athleteUser = User::query()->create([
            'name' => 'Deportista',
            'email' => 'user@user.com',
            'password' => 'password',
            'users.email_verified_at' => now()
        ]);

        $roleAthlete = Role::create(['name' => 'Athlete']);
        $athleteUser->assignRole($roleAthlete);
        $roleAthlete->syncPermissions(['see levels']);




    }
}
