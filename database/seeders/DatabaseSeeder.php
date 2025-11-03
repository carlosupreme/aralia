<?php

namespace Database\Seeders;

use App\Models\PaymentReminder;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // User::factory(10)->create();

        //  User::factory()->create([
        //      'name' => 'Test User',
        //      'email' => 'test@example.com',
        //  ]);

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        PaymentReminder::create(['days_before' => 7, 'is_active' => false]);
        PaymentReminder::create(['days_before' => 3, 'is_active' => true]);
    }
}
