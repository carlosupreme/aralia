<?php

use App\Models\User;
use App\Models\Program;
use App\Models\Level;
use App\Models\Multimedia;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create roles
    \Spatie\Permission\Models\Role::create(['name' => 'student']);
    \Spatie\Permission\Models\Role::create(['name' => 'psychologist']);

    // Fake storage for file uploads
    Storage::fake('public');
});

test('psychologist can create a program', function () {
    // Create and authenticate psychologist
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    // Create program
    $response = $this->actingAs($psychologist)->post('/programs', [
        'name' => 'Mental Strength Training',
        'description' => 'A comprehensive program for athletes',
        'is_active' => true,
    ]);

    // Verify program was created
    $response->assertRedirect();

    $program = Program::where('name', 'Mental Strength Training')->first();
    expect($program)->not->toBeNull();
    expect($program->psychologist_id)->toBe($psychologist->id);
    expect($program->description)->toBe('A comprehensive program for athletes');
    expect($program->is_active)->toBeTrue();
});

test('student cannot create a program', function () {
    // Create and authenticate student
    $student = User::factory()->create();
    $student->assignRole('student');

    // Attempt to create program
    $response = $this->actingAs($student)->post('/programs', [
        'name' => 'Unauthorized Program',
        'description' => 'This should not be created',
        'is_active' => true,
    ]);

    // Should be forbidden
    $response->assertStatus(403);

    // Verify program was NOT created
    $program = Program::where('name', 'Unauthorized Program')->first();
    expect($program)->toBeNull();
});

test('psychologist can add level to their program', function () {
    // Create psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Program description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
    ]);

    // Add level to program
    $response = $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Introduction to Focus',
        'description' => 'Learn the basics of mental focus',
        'is_active' => true,
        'multimedia' => [],
    ]);

    $response->assertRedirect("/programs/{$program->id}");

    // Verify level was created
    $level = Level::where('name', 'Introduction to Focus')->first();
    expect($level)->not->toBeNull();
    expect($level->program_id)->toBe($program->id);
    expect($level->order_index)->toBe(1);
    expect($level->is_active)->toBeTrue();
});

test('psychologist can add multiple levels to program in correct order', function () {
    // Create psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Program description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
    ]);

    // Add first level
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Level 1: Introduction',
        'description' => 'First level',
        'is_active' => true,
        'multimedia' => [],
    ]);

    // Add second level
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Level 2: Advanced',
        'description' => 'Second level',
        'is_active' => true,
        'multimedia' => [],
    ]);

    // Add third level
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Level 3: Mastery',
        'description' => 'Third level',
        'is_active' => true,
        'multimedia' => [],
    ]);

    // Verify levels have correct order
    $levels = Level::where('program_id', $program->id)
        ->orderBy('order_index')
        ->get();

    expect($levels->count())->toBe(3);
    expect($levels[0]->name)->toBe('Level 1: Introduction');
    expect($levels[0]->order_index)->toBe(1);
    expect($levels[1]->name)->toBe('Level 2: Advanced');
    expect($levels[1]->order_index)->toBe(2);
    expect($levels[2]->name)->toBe('Level 3: Mastery');
    expect($levels[2]->order_index)->toBe(3);
});

test('psychologist can add multimedia to level during creation', function () {
    // Create psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Program description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
    ]);

    // Create level with multimedia
    $response = $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Introduction Level',
        'description' => 'Learn the basics',
        'is_active' => true,
        'multimedia' => [
            [
                'name' => 'Welcome Video',
                'description' => 'Introduction to the program',
                'url' => '/storage/multimedia/videos/welcome.mp4',
                'type' => 'video',
                'size' => '15.5 MB',
                'duration' => '10:30',
            ],
            [
                'name' => 'Course Materials PDF',
                'description' => 'Downloadable study guide',
                'url' => '/storage/multimedia/documents/guide.pdf',
                'type' => 'pdf',
                'size' => '2.3 MB',
                'duration' => '',
            ],
        ],
    ]);

    $response->assertRedirect("/programs/{$program->id}");

    // Verify level was created
    $level = Level::where('name', 'Introduction Level')->first();
    expect($level)->not->toBeNull();

    // Verify multimedia was created
    $multimedia = Multimedia::where('level_id', $level->id)->get();
    expect($multimedia->count())->toBe(2);

    // Verify video
    $video = $multimedia->firstWhere('type', 'video');
    expect($video->name)->toBe('Welcome Video');
    expect($video->url)->toBe('/storage/multimedia/videos/welcome.mp4');
    expect($video->size)->toBe('15.5 MB');
    expect($video->duration)->toBe('10:30');
    expect($video->order_index)->toBe(0);

    // Verify PDF
    $pdf = $multimedia->firstWhere('type', 'pdf');
    expect($pdf->name)->toBe('Course Materials PDF');
    expect($pdf->url)->toBe('/storage/multimedia/documents/guide.pdf');
    expect($pdf->size)->toBe('2.3 MB');
    expect($pdf->order_index)->toBe(1);
});

test('psychologist can create complete program with multiple levels and multimedia', function () {
    // Create psychologist
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    // Step 1: Create program
    $this->actingAs($psychologist)->post('/programs', [
        'name' => 'Complete Mental Training',
        'description' => 'Full program with all content',
        'is_active' => true,
    ]);

    $program = Program::where('name', 'Complete Mental Training')->first();

    // Step 2: Add Level 1 with video
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Foundation',
        'description' => 'Basic concepts',
        'is_active' => true,
        'multimedia' => [
            [
                'name' => 'Foundation Video',
                'description' => 'Core principles',
                'url' => '/storage/multimedia/videos/foundation.mp4',
                'type' => 'video',
                'size' => '25 MB',
                'duration' => '15:00',
            ],
        ],
    ]);

    // Step 3: Add Level 2 with multiple multimedia
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Intermediate Techniques',
        'description' => 'Advanced practices',
        'is_active' => true,
        'multimedia' => [
            [
                'name' => 'Technique Tutorial',
                'description' => 'Step by step guide',
                'url' => '/storage/multimedia/videos/tutorial.mp4',
                'type' => 'video',
                'size' => '40 MB',
                'duration' => '8:45',
            ],
            [
                'name' => 'Exercise Guide',
                'description' => 'Printable exercises',
                'url' => '/storage/multimedia/documents/exercises.pdf',
                'type' => 'pdf',
                'size' => '1.2 MB',
                'duration' => '',
            ],
            [
                'name' => 'Motivational Image',
                'description' => 'Inspirational quote',
                'url' => '/storage/multimedia/images/motivation.jpg',
                'type' => 'image',
                'size' => '500 KB',
                'duration' => '',
            ],
        ],
    ]);

    // Step 4: Add Level 3
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Advanced Mastery',
        'description' => 'Expert level content',
        'is_active' => true,
        'multimedia' => [
            [
                'name' => 'Mastery Workshop',
                'description' => 'Complete workshop recording',
                'url' => '/storage/multimedia/videos/workshop.mp4',
                'type' => 'video',
                'size' => '120 MB',
                'duration' => '45:30',
            ],
        ],
    ]);

    // Verify program structure
    $program = Program::with(['levels.multimedia'])->find($program->id);

    expect($program->levels->count())->toBe(3);

    // Verify Level 1
    $level1 = $program->levels[0];
    expect($level1->name)->toBe('Foundation');
    expect($level1->multimedia->count())->toBe(1);
    expect($level1->multimedia[0]->type)->toBe('video');

    // Verify Level 2
    $level2 = $program->levels[1];
    expect($level2->name)->toBe('Intermediate Techniques');
    expect($level2->multimedia->count())->toBe(3);
    expect($level2->multimedia->pluck('type')->toArray())->toContain('video', 'pdf', 'image');

    // Verify Level 3
    $level3 = $program->levels[2];
    expect($level3->name)->toBe('Advanced Mastery');
    expect($level3->multimedia->count())->toBe(1);
    expect($level3->multimedia[0]->duration)->toBe('45:30');
});

test('psychologist can upload video file and create multimedia entry', function () {
    // Create psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Program description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
    ]);

    // Create a fake video file
    $videoFile = UploadedFile::fake()->create('test-video.mp4', 5000, 'video/mp4'); // 5MB

    // Upload file
    $response = $this->actingAs($psychologist)->post('/upload/file', [
        'file' => $videoFile,
        'type' => 'video',
    ]);

    $response->assertStatus(200);
    $uploadData = $response->json();

    // Verify response structure
    expect($uploadData)->toHaveKey('success');
    expect($uploadData)->toHaveKey('data');
    expect($uploadData['success'])->toBeTrue();

    // Verify file data
    $fileData = $uploadData['data'];
    expect($fileData)->toHaveKey('url');
    expect($fileData)->toHaveKey('path');
    expect($fileData)->toHaveKey('type');
    expect($fileData['type'])->toBe('video');

    // Verify file exists in storage
    $path = str_replace('/storage/', '', $fileData['path']);
    Storage::disk('public')->assertExists($path);
});

test('multimedia entries maintain correct order within level', function () {
    // Create psychologist and program
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Program description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
    ]);

    // Create level with 5 multimedia items
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Ordered Content Level',
        'description' => 'Level with ordered multimedia',
        'is_active' => true,
        'multimedia' => [
            [
                'name' => 'First: Introduction',
                'description' => 'Watch first',
                'url' => '/storage/multimedia/videos/intro.mp4',
                'type' => 'video',
                'size' => '10 MB',
                'duration' => '5:00',
            ],
            [
                'name' => 'Second: Theory',
                'description' => 'Read second',
                'url' => '/storage/multimedia/documents/theory.pdf',
                'type' => 'pdf',
                'size' => '2 MB',
                'duration' => '',
            ],
            [
                'name' => 'Third: Practice Video',
                'description' => 'Watch third',
                'url' => '/storage/multimedia/videos/practice.mp4',
                'type' => 'video',
                'size' => '15 MB',
                'duration' => '8:30',
            ],
            [
                'name' => 'Fourth: Exercise Sheet',
                'description' => 'Complete fourth',
                'url' => '/storage/multimedia/documents/exercises.pdf',
                'type' => 'pdf',
                'size' => '1 MB',
                'duration' => '',
            ],
            [
                'name' => 'Fifth: Summary',
                'description' => 'Review last',
                'url' => '/storage/multimedia/images/summary.jpg',
                'type' => 'image',
                'size' => '500 KB',
                'duration' => '',
            ],
        ],
    ]);

    $level = Level::where('name', 'Ordered Content Level')->first();
    $multimedia = Multimedia::where('level_id', $level->id)
        ->orderBy('order_index')
        ->get();

    // Verify correct order
    expect($multimedia->count())->toBe(5);
    expect($multimedia[0]->name)->toBe('First: Introduction');
    expect($multimedia[0]->order_index)->toBe(0);
    expect($multimedia[1]->name)->toBe('Second: Theory');
    expect($multimedia[1]->order_index)->toBe(1);
    expect($multimedia[2]->name)->toBe('Third: Practice Video');
    expect($multimedia[2]->order_index)->toBe(2);
    expect($multimedia[3]->name)->toBe('Fourth: Exercise Sheet');
    expect($multimedia[3]->order_index)->toBe(3);
    expect($multimedia[4]->name)->toBe('Fifth: Summary');
    expect($multimedia[4]->order_index)->toBe(4);
});

test('psychologist cannot modify another psychologists program', function () {
    // Create two psychologists
    $psychologist1 = User::factory()->create();
    $psychologist1->assignRole('psychologist');

    $psychologist2 = User::factory()->create();
    $psychologist2->assignRole('psychologist');

    // Psychologist 1 creates program
    $program = Program::create([
        'name' => 'Psychologist 1 Program',
        'description' => 'Owned by psychologist 1',
        'psychologist_id' => $psychologist1->id,
        'is_active' => true,
    ]);

    // Psychologist 2 tries to add level
    $response = $this->actingAs($psychologist2)->post("/programs/{$program->id}/levels", [
        'name' => 'Unauthorized Level',
        'description' => 'This should not be created',
        'is_active' => true,
        'multimedia' => [],
    ]);

    // Should be forbidden
    $response->assertStatus(403);

    // Verify level was NOT created
    $level = Level::where('name', 'Unauthorized Level')->first();
    expect($level)->toBeNull();
});

test('video duration is detected for uploaded videos', function () {
    // Create psychologist and program with level
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
    ]);

    // Create level with video that has duration
    $this->actingAs($psychologist)->post("/programs/{$program->id}/levels", [
        'name' => 'Video Level',
        'description' => 'Level with timed video',
        'is_active' => true,
        'multimedia' => [
            [
                'name' => 'Long Training Video',
                'description' => 'Extended workshop',
                'url' => '/storage/multimedia/videos/long-video.mp4',
                'type' => 'video',
                'size' => '150 MB',
                'duration' => '35:45', // 35 minutes 45 seconds
            ],
        ],
    ]);

    $level = Level::where('name', 'Video Level')->first();
    $video = Multimedia::where('level_id', $level->id)->first();

    // Verify duration is stored
    expect($video->duration)->toBe('35:45');

    // Verify video is marked for streaming (>5 minutes)
    // Convert duration to seconds: 35*60 + 45 = 2145 seconds
    $durationParts = explode(':', $video->duration);
    $totalSeconds = (int)$durationParts[0] * 60 + (int)$durationParts[1];
    expect($totalSeconds)->toBeGreaterThan(300); // More than 5 minutes
});
