<?php

use App\Models\User;
use App\Models\Program;
use App\Models\Level;
use App\Models\Student;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create roles
    \Spatie\Permission\Models\Role::create(['name' => 'student']);
    \Spatie\Permission\Models\Role::create(['name' => 'psychologist']);
});

test('student registration assigns student role', function () {
    // Create a psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name'            => 'Test Program',
        'description'     => 'Test program for students',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add a level to the program
    $level = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    // Register a new student
    $response = $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program->id,
    ]);

    // Should redirect to dashboard
    $response->assertRedirect('/dashboard');

    // Verify user was created
    $user = User::where('email', 'student@example.com')->first();
    // Verify student role was assigned
    expect($user)->not->toBeNull()
                      ->and($user->hasRole('student'))->toBeTrue()
                      ->and($user->isStudent())->toBeTrue();

});

test('student registration enrolls student in selected program', function () {
    // Create a psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name'            => 'Test Program',
        'description'     => 'Test program for students',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add a level to the program
    $level = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    // Register a new student
    $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program->id,
    ]);

    $user = User::where('email', 'student@example.com')->first();

    // Verify student is enrolled in the program
    expect($user->enrolledPrograms()->count())->toBe(1);
    expect($user->enrolledPrograms->first()->id)->toBe($program->id);
    expect($program->hasStudent($user))->toBeTrue();
});

test('student registration unlocks first level of program', function () {
    // Create a psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name'            => 'Test Program',
        'description'     => 'Test program for students',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add multiple levels to the program
    $level1 = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    $level2 = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 2',
        'description' => 'Second level',
        'order_index' => 2,
        'is_active'   => true,
    ]);

    // Register a new student
    $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program->id,
    ]);

    $user = User::where('email', 'student@example.com')->first();

    // Verify first level is unlocked
    expect($level1->isUnlockedFor($user))->toBeTrue();

    // Verify second level is NOT unlocked
    expect($level2->isUnlockedFor($user))->toBeFalse();
});

test('student can access first level after registration', function () {
    // Create a psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name'            => 'Test Program',
        'description'     => 'Test program for students',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add levels
    $level1 = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    $level2 = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 2',
        'description' => 'Second level',
        'order_index' => 2,
        'is_active'   => true,
    ]);

    // Register and login student
    $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program->id,
    ]);

    $user = User::where('email', 'student@example.com')->first();

    // Create a confirmed payment so student can access content
    Payment::create([
        'user_id' => $user->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'paid_at' => now(),
        'due_date' => now()->addMonth(),
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    // Try to access first level (should succeed)
    $response = $this->actingAs($user)->get("/levels/{$level1->id}/learn");
    $response->assertStatus(200);
});

test('student cannot access locked level', function () {
    // Create a psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name'            => 'Test Program',
        'description'     => 'Test program for students',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add levels
    $level1 = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    $level2 = Level::create([
        'program_id'  => $program->id,
        'name'        => 'Level 2',
        'description' => 'Second level',
        'order_index' => 2,
        'is_active'   => true,
    ]);

    // Register and login student
    $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program->id,
    ]);

    $user = User::where('email', 'student@example.com')->first();

    // Create a confirmed payment so payment check passes
    Payment::create([
        'user_id' => $user->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'paid_at' => now(),
        'due_date' => now()->addMonth(),
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    // Try to access second level (should be redirected with error because level is locked)
    $response = $this->actingAs($user)->get("/levels/{$level2->id}/learn");
    $response->assertRedirect("/programs/{$program->id}");
    $response->assertSessionHas('error');
});

test('student can see their enrolled program in program list', function () {
    // Create a psychologist and programs
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program1 = Program::create([
        'name'            => 'Enrolled Program',
        'description'     => 'Student is enrolled here',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    $program2 = Program::create([
        'name'            => 'Other Program',
        'description'     => 'Student is NOT enrolled here',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add first level to program1
    Level::create([
        'program_id'  => $program1->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    // Register student
    $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program1->id,
    ]);

    $user = User::where('email', 'student@example.com')->first();

    // Check programs index - should only see enrolled program
    $response = $this->actingAs($user)->get('/programs');
    $response->assertStatus(200);

    // Verify only enrolled program is returned
    $programs = $user->enrolledPrograms;
    expect($programs->count())->toBe(1);
    expect($programs->first()->id)->toBe($program1->id);
});

test('student cannot access program they are not enrolled in', function () {
    // Create a psychologist and programs
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program1 = Program::create([
        'name'            => 'Enrolled Program',
        'description'     => 'Student is enrolled here',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    $program2 = Program::create([
        'name'            => 'Other Program',
        'description'     => 'Student is NOT enrolled here',
        'psychologist_id' => $psychologist->id,
        'is_active'       => true,
    ]);

    // Add first level to program1
    Level::create([
        'program_id'  => $program1->id,
        'name'        => 'Level 1',
        'description' => 'First level',
        'order_index' => 1,
        'is_active'   => true,
    ]);

    // Register student
    $this->post('/register', [
        'name'                  => 'Test Student',
        'email'                 => 'student@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'date_of_birth'         => '2005-01-01',
        'team'                  => 'Test Team',
        'sport'                 => 'Soccer',
        'country'               => 'Mexico',
        'city'                  => 'Oaxaca',
        'parent'                => '555-1234',
        'parent_name'           => 'Parent Name',
        'program_id'            => $program1->id,
    ]);

    $user = User::where('email', 'student@example.com')->first();

    // Try to access program2 (should fail with 403)
    $response = $this->actingAs($user)->get("/programs/{$program2->id}");
    $response->assertStatus(403);
});
