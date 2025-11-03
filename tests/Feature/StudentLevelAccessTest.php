<?php

use App\Models\Level;
use App\Models\Multimedia;
use App\Models\Payment;
use App\Models\Program;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create roles
    Role::create(['name' => 'psychologist']);
    Role::create(['name' => 'student']);

    // Create psychologist
    $this->psychologist = User::factory()->create([
        'name' => 'Dr. Test Psychologist',
        'email' => 'psychologist@test.com',
    ]);
    $this->psychologist->assignRole('psychologist');

    // Create student
    $this->student = User::factory()->create([
        'name' => 'Test Student',
        'email' => 'student@test.com',
    ]);
    $this->student->assignRole('student');

    // Create program
    $this->program = Program::create([
        'name' => 'Test Program',
        'description' => 'A test program for level access',
        'psychologist_id' => $this->psychologist->id,
        'is_active' => true,
    ]);

    // Create 4 levels with multimedia
    $this->level1 = Level::create([
        'name' => 'Level 1: Fundamentals',
        'description' => 'Basic concepts',
        'program_id' => $this->program->id,
        'order_index' => 1,
        'is_active' => true,
    ]);

    $this->level2 = Level::create([
        'name' => 'Level 2: Intermediate',
        'description' => 'Intermediate concepts',
        'program_id' => $this->program->id,
        'order_index' => 2,
        'is_active' => true,
    ]);

    $this->level3 = Level::create([
        'name' => 'Level 3: Advanced',
        'description' => 'Advanced concepts',
        'program_id' => $this->program->id,
        'order_index' => 3,
        'is_active' => true,
    ]);

    $this->level4 = Level::create([
        'name' => 'Level 4: Expert',
        'description' => 'Expert level',
        'program_id' => $this->program->id,
        'order_index' => 4,
        'is_active' => true,
    ]);

    // Add multimedia to each level
    foreach ([$this->level1, $this->level2, $this->level3, $this->level4] as $level) {
        Multimedia::create([
            'name' => "Video for {$level->name}",
            'description' => 'Test video',
            'url' => 'https://example.com/video.mp4',
            'type' => 'video',
            'level_id' => $level->id,
            'order_index' => 1,
            'is_active' => true,
        ]);
    }

    // Helper function to create confirmed payment for student
    $this->createPaymentFor = function (User $student, Program $program) {
        Payment::create([
            'user_id' => $student->id,
            'program_id' => $program->id,
            'amount' => 100.00,
            'status' => Payment::STATUS_CONFIRMED,
            'paid_at' => now(),
            'due_date' => now()->addMonth(), // Valid for next month
        ]);
    };
});

test('student enrolled in program has access only to level 1', function () {
    // Enroll student in program
    $this->student->enrollInProgram($this->program);

    // Create confirmed payment for student
    ($this->createPaymentFor)($this->student, $this->program);

    // Unlock first level (this should happen automatically on enrollment)
    $this->level1->unlockFor($this->student);

    // Verify student has access to level 1
    expect($this->student->hasAccessToLevel($this->level1))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level1))->toBeTrue();

    // Verify student does NOT have access to other levels
    expect($this->student->hasAccessToLevel($this->level2))->toBeFalse();
    expect($this->student->canViewLevelContent($this->level2))->toBeFalse();
    expect($this->student->hasAccessToLevel($this->level3))->toBeFalse();
    expect($this->student->canViewLevelContent($this->level3))->toBeFalse();
    expect($this->student->hasAccessToLevel($this->level4))->toBeFalse();
    expect($this->student->canViewLevelContent($this->level4))->toBeFalse();

    // Verify accessible levels
    $accessibleLevels = $this->student->getAccessibleLevelsForProgram($this->program);
    expect($accessibleLevels)->toHaveCount(1);
    expect($accessibleLevels)->toContain($this->level1->id);
    expect($accessibleLevels)->not->toContain($this->level2->id);
});

test('admin can unlock level 2 for student', function () {
    // Enroll student and unlock level 1
    $this->student->enrollInProgram($this->program);
    ($this->createPaymentFor)($this->student, $this->program);
    $this->level1->unlockFor($this->student);

    // Psychologist unlocks level 2 (admin action)
    $this->level2->unlockFor($this->student);

    // Verify student now has access to both level 1 and 2
    expect($this->student->hasAccessToLevel($this->level1))->toBeTrue();
    expect($this->student->hasAccessToLevel($this->level2))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level1))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level2))->toBeTrue();

    // Verify accessible levels includes both 1 and 2
    $accessibleLevels = $this->student->getAccessibleLevelsForProgram($this->program);
    expect($accessibleLevels)->toHaveCount(2);
    expect($accessibleLevels)->toContain($this->level1->id);
    expect($accessibleLevels)->toContain($this->level2->id);
    expect($accessibleLevels)->not->toContain($this->level3->id);
});

test('when level 2 is completed student can see levels 1 and 2 and access level 3 but not level 4', function () {
    // Enroll student and unlock levels 1 and 2
    $this->student->enrollInProgram($this->program);
    ($this->createPaymentFor)($this->student, $this->program);
    $this->level1->unlockFor($this->student);
    $this->level2->unlockFor($this->student);

    // Complete level 1
    $this->level1->completeFor($this->student);

    // Complete level 2
    $this->level2->completeFor($this->student);

    // When level 2 is completed, level 3 should be unlocked
    $this->level3->unlockFor($this->student);

    // Verify completion status
    expect($this->level1->isCompletedFor($this->student))->toBeTrue();
    expect($this->level2->isCompletedFor($this->student))->toBeTrue();
    expect($this->level3->isCompletedFor($this->student))->toBeFalse();
    expect($this->level4->isCompletedFor($this->student))->toBeFalse();

    // Verify student can VIEW content of levels 1, 2, and 3
    expect($this->student->canViewLevelContent($this->level1))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level2))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level3))->toBeTrue();

    // Verify student CANNOT view level 4
    expect($this->student->canViewLevelContent($this->level4))->toBeFalse();

    // Verify accessible levels
    $accessibleLevels = $this->student->getAccessibleLevelsForProgram($this->program);
    expect($accessibleLevels)->toHaveCount(3);
    expect($accessibleLevels)->toContain($this->level1->id);
    expect($accessibleLevels)->toContain($this->level2->id);
    expect($accessibleLevels)->toContain($this->level3->id);
    expect($accessibleLevels)->not->toContain($this->level4->id);

    // Verify unlock status (only 1, 2, 3 are unlocked)
    expect($this->student->hasAccessToLevel($this->level1))->toBeTrue();
    expect($this->student->hasAccessToLevel($this->level2))->toBeTrue();
    expect($this->student->hasAccessToLevel($this->level3))->toBeTrue();
    expect($this->student->hasAccessToLevel($this->level4))->toBeFalse();
});

test('student can access program show page and see correct level statuses', function () {
    // Enroll student and unlock levels 1, 2, and 3
    $this->student->enrollInProgram($this->program);
    ($this->createPaymentFor)($this->student, $this->program);
    $this->level1->unlockFor($this->student);
    $this->level2->unlockFor($this->student);
    $this->level2->completeFor($this->student);
    $this->level3->unlockFor($this->student);

    // Act as student and visit program page
    $response = $this->actingAs($this->student)
        ->get(route('programs.show', $this->program));

    $response->assertStatus(200);

    // Verify the props contain correct data
    $response->assertInertia(fn ($page) =>
        $page->component('Programs/Show')
            ->has('program.levels', 4)
            ->where('program.levels.0.is_unlocked_for_user', true)
            ->where('program.levels.0.is_accessible_for_user', true)
            ->where('program.levels.0.is_completed_for_user', false)
            ->where('program.levels.1.is_unlocked_for_user', true)
            ->where('program.levels.1.is_accessible_for_user', true)
            ->where('program.levels.1.is_completed_for_user', true)
            ->where('program.levels.2.is_unlocked_for_user', true)
            ->where('program.levels.2.is_accessible_for_user', true)
            ->where('program.levels.2.is_completed_for_user', false)
            ->where('program.levels.3.is_unlocked_for_user', false)
            ->where('program.levels.3.is_accessible_for_user', false)
            ->where('program.levels.3.is_completed_for_user', false)
    );
});

test('student can access unlocked level content page', function () {
    // Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Student should be able to access level 1 content
    $this->actingAs($this->student)
        ->get(route('levels.learn', $this->level1))
        ->assertStatus(200);
});

test('student can access previous level content when higher level is unlocked', function () {
    // Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Admin unlocks levels 2 and 3
    $this->level2->unlockFor($this->student);
    $this->level3->unlockFor($this->student);

    // Student should be able to access all levels 1, 2, and 3
    $this->actingAs($this->student)
        ->get(route('levels.learn', $this->level1))
        ->assertStatus(200);

    $this->actingAs($this->student)
        ->get(route('levels.learn', $this->level2))
        ->assertStatus(200);

    $this->actingAs($this->student)
        ->get(route('levels.learn', $this->level3))
        ->assertStatus(200);
});

test('student cannot access locked level content page', function () {
    // Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Student should NOT be able to access level 2 (not unlocked)
    $this->actingAs($this->student)
        ->get(route('levels.learn', $this->level2))
        ->assertRedirect(route('programs.show', $this->program))
        ->assertSessionHas('error');
});

test('student cannot access level 4 when only levels 1 2 3 are unlocked', function () {
    // Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Admin unlocks levels 2 and 3
    $this->level2->unlockFor($this->student);
    $this->level3->unlockFor($this->student);

    // Student should NOT be able to access level 4
    $this->actingAs($this->student)
        ->get(route('levels.learn', $this->level4))
        ->assertRedirect(route('programs.show', $this->program))
        ->assertSessionHas('error');
});

test('completing level automatically unlocks next level', function () {
    // Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Psychologist marks level 1 as complete
    $this->actingAs($this->psychologist)
        ->post(route('levels.complete', [
            'level' => $this->level1,
            'student' => $this->student,
        ]))
        ->assertRedirect()
        ->assertSessionHas('success');

    // Verify level 1 is completed
    expect($this->level1->isCompletedFor($this->student))->toBeTrue();

    // Verify level 2 is now unlocked
    expect($this->level2->isUnlockedFor($this->student))->toBeTrue();
});

test('student can see multimedia only for accessible levels', function () {
    // Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Admin unlocks level 2
    $this->level2->unlockFor($this->student);

    // Get the program with level access data
    $response = $this->actingAs($this->student)
        ->get(route('programs.show', $this->program));

    $response->assertStatus(200);

    // Levels 1 and 2 should have multimedia visible
    $response->assertInertia(fn ($page) =>
        $page->component('Programs/Show')
            ->where('program.levels.0.is_accessible_for_user', true)
            ->has('program.levels.0.multimedia', 1)
            ->where('program.levels.1.is_accessible_for_user', true)
            ->has('program.levels.1.multimedia', 1)
            // Levels 3 and 4 should not be accessible
            ->where('program.levels.2.is_accessible_for_user', false)
            ->where('program.levels.3.is_accessible_for_user', false)
    );
});

test('psychologist can see all levels regardless of unlock status', function () {
    // Psychologist should see all levels without any unlock restrictions
    $this->actingAs($this->psychologist)
        ->get(route('programs.show', $this->program))
        ->assertStatus(200)
        ->assertInertia(fn ($page) =>
            $page->component('Programs/Show')
                ->has('program.levels', 4)
        );

    // Psychologist can access any level's content
    $this->actingAs($this->psychologist)
        ->get(route('levels.learn', $this->level1))
        ->assertStatus(200);

    $this->actingAs($this->psychologist)
        ->get(route('levels.learn', $this->level4))
        ->assertStatus(200);
});

test('non enrolled student cannot access program', function () {
    // Create another student not enrolled in the program
    $otherStudent = User::factory()->create([
        'email' => 'other@test.com',
    ]);
    $otherStudent->assignRole('student');

    // Try to access the program
    $this->actingAs($otherStudent)
        ->get(route('programs.show', $this->program))
        ->assertStatus(403);
});

test('level access progression scenario', function () {
    // This test simulates the complete user journey

    // 1. Create payment and enroll student (automatically unlocks level 1)
    ($this->createPaymentFor)($this->student, $this->program);
    $this->student->enrollInProgram($this->program);

    // Verify initial state: only level 1 accessible
    $accessible = $this->student->getAccessibleLevelsForProgram($this->program);
    expect($accessible)->toHaveCount(1);
    expect($accessible)->toContain($this->level1->id);

    // 2. Student completes level 1, admin unlocks level 2
    $this->level1->completeFor($this->student);
    $this->level2->unlockFor($this->student);

    // Verify: levels 1 and 2 accessible
    $accessible = $this->student->getAccessibleLevelsForProgram($this->program);
    expect($accessible)->toHaveCount(2);
    expect($accessible)->toContain($this->level1->id);
    expect($accessible)->toContain($this->level2->id);

    // 3. Student completes level 2, admin unlocks level 3
    $this->level2->completeFor($this->student);
    $this->level3->unlockFor($this->student);

    // Verify: levels 1, 2, and 3 accessible, but NOT 4
    $accessible = $this->student->getAccessibleLevelsForProgram($this->program);
    expect($accessible)->toHaveCount(3);
    expect($accessible)->toContain($this->level1->id);
    expect($accessible)->toContain($this->level2->id);
    expect($accessible)->toContain($this->level3->id);
    expect($accessible)->not->toContain($this->level4->id);

    // Verify multimedia access
    expect($this->student->canViewLevelContent($this->level1))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level2))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level3))->toBeTrue();
    expect($this->student->canViewLevelContent($this->level4))->toBeFalse();
});
