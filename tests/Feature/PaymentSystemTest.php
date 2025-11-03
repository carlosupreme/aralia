<?php

use App\Models\User;
use App\Models\Program;
use App\Models\Payment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create roles
    Role::firstOrCreate(['name' => 'student']);
    Role::firstOrCreate(['name' => 'psychologist']);
});

test('program has monthly price field', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 99.99,
    ]);

    expect($program->monthly_price)->toBe('99.99');
});

test('student can upload payment receipt', function () {
    Storage::fake('public');

    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    $receipt = UploadedFile::fake()->image('receipt.jpg');

    $response = $this->actingAs($student)->post(route('payments.store', $program), [
        'receipt' => $receipt,
    ]);

    $response->assertRedirect(route('payments.index', $program));
    $response->assertSessionHas('success');

    // Verify payment was created
    $payment = Payment::where('user_id', $student->id)
        ->where('program_id', $program->id)
        ->first();

    expect($payment)->not->toBeNull();
    expect($payment->status)->toBe(Payment::STATUS_PENDING);
    expect($payment->amount)->toBe('100.00');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $payment->receipt_url));
});

test('payment status workflow from pending to confirmed', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    $payment = Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'status' => Payment::STATUS_PENDING,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    expect($payment->isPending())->toBeTrue();

    // Psychologist approves payment
    $response = $this->actingAs($psychologist)->post(route('payments.approve', $payment));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $payment->refresh();
    expect($payment->isConfirmed())->toBeTrue();
    expect($payment->due_date)->not->toBeNull();
    expect($payment->paid_at)->not->toBeNull();
});

test('payment status workflow from pending to rejected', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    $payment = Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'status' => Payment::STATUS_PENDING,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    // Psychologist rejects payment
    $response = $this->actingAs($psychologist)->post(route('payments.reject', $payment), [
        'rejection_reason' => 'Receipt not clear',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $payment->refresh();
    expect($payment->isRejected())->toBeTrue();
    expect($payment->rejection_reason)->toBe('Receipt not clear');
});

test('first payment sets due date one month from now', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    $payment = Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'status' => Payment::STATUS_PENDING,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    // Approve first payment
    $this->actingAs($psychologist)->post(route('payments.approve', $payment));

    $payment->refresh();
    $expectedDueDate = now()->addMonth()->startOfDay();

    expect($payment->due_date->format('Y-m-d'))->toBe($expectedDueDate->format('Y-m-d'));
});

test('student without confirmed payment has no access to program content', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    expect($student->hasAccessToProgram($program))->toBeFalse();
    expect($student->needsToPayFor($program))->toBeTrue();
});

test('student with confirmed payment has access to program content', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    // Create confirmed payment
    Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'paid_at' => now(),
        'due_date' => now()->addMonth(),
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    expect($student->hasAccessToProgram($program))->toBeTrue();
    expect($student->needsToPayFor($program))->toBeFalse();
});

test('student with overdue payment loses access immediately', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    // Create payment that is overdue (1 day past due date)
    Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now()->subMonths(2),
        'paid_at' => now()->subMonths(2),
        'due_date' => now()->subDay(), // Overdue by 1 day
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    expect($student->hasAccessToProgram($program))->toBeFalse();
    expect($student->needsToPayFor($program))->toBeTrue();
});

test('student with payment due today still has access', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    // Create payment due today
    Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now()->subMonth(),
        'paid_at' => now()->subMonth(),
        'due_date' => now(), // Due today
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    expect($student->hasAccessToProgram($program))->toBeTrue();
});

test('psychologist can only approve payments for their own programs', function () {
    $psychologist1 = User::factory()->create();
    $psychologist1->assignRole('psychologist');

    $psychologist2 = User::factory()->create();
    $psychologist2->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist1->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    $payment = Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'status' => Payment::STATUS_PENDING,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    // Psychologist 2 tries to approve psychologist 1's program payment
    $response = $this->actingAs($psychologist2)->post(route('payments.approve', $payment));

    $response->assertForbidden();
});

test('student can enroll in multiple programs with separate payments', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program1 = Program::create([
        'name' => 'Program 1',
        'description' => 'Description 1',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $program2 = Program::create([
        'name' => 'Program 2',
        'description' => 'Description 2',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 150.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program1);
    $student->enrollInProgram($program2);

    // Pay for program 1 only
    Payment::create([
        'user_id' => $student->id,
        'program_id' => $program1->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'paid_at' => now(),
        'due_date' => now()->addMonth(),
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test1.jpg',
    ]);

    expect($student->hasAccessToProgram($program1))->toBeTrue();
    expect($student->hasAccessToProgram($program2))->toBeFalse();
    expect($student->needsToPayFor($program2))->toBeTrue();
});

test('payment records are immutable with soft deletes', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    $student->enrollInProgram($program);

    $payment = Payment::create([
        'user_id' => $student->id,
        'program_id' => $program->id,
        'amount' => 100.00,
        'payment_date' => now(),
        'status' => Payment::STATUS_CONFIRMED,
        'receipt_url' => '/storage/receipts/test.jpg',
    ]);

    $paymentId = $payment->id;

    // Soft delete
    $payment->delete();

    // Payment still exists in database with deleted_at
    $deletedPayment = Payment::withTrashed()->find($paymentId);
    expect($deletedPayment)->not->toBeNull();
    expect($deletedPayment->trashed())->toBeTrue();

    // Payment not returned in normal queries
    $activePayment = Payment::find($paymentId);
    expect($activePayment)->toBeNull();
});

test('student cannot upload payment for program they are not enrolled in', function () {
    Storage::fake('public');

    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    $student = User::factory()->create();
    $student->assignRole('student');
    // Note: NOT enrolling student in program

    $receipt = UploadedFile::fake()->image('receipt.jpg');

    $response = $this->actingAs($student)->post(route('payments.store', $program), [
        'receipt' => $receipt,
    ]);

    $response->assertForbidden();
});

test('psychologist always has access to their own programs regardless of payment', function () {
    $psychologist = User::factory()->create();
    $psychologist->assignRole('psychologist');

    $program = Program::create([
        'name' => 'Test Program',
        'description' => 'Test Description',
        'psychologist_id' => $psychologist->id,
        'is_active' => true,
        'monthly_price' => 100.00,
    ]);

    expect($psychologist->hasAccessToProgram($program))->toBeTrue();
});
