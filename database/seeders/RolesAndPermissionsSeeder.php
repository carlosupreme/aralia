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
use App\Models\Level;
use App\Models\Multimedia;
use App\Models\Payment;
use App\Models\Appointment;
use App\Models\AppointmentProposal;

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
                'is_active' => true,
            ]
        );

        // Create levels for the program if they don't exist
        if ($program->levels()->count() === 0) {
            $level1 = Level::create([
                'name' => 'Nivel 1: Fundamentos',
                'description' => 'Conceptos básicos de entrenamiento mental',
                'program_id' => $program->id,
                'order_index' => 1,
                'is_active' => true,
            ]);

            $level2 = Level::create([
                'name' => 'Nivel 2: Intermedio',
                'description' => 'Técnicas intermedias de concentración',
                'program_id' => $program->id,
                'order_index' => 2,
                'is_active' => true,
            ]);

            $level3 = Level::create([
                'name' => 'Nivel 3: Avanzado',
                'description' => 'Estrategias avanzadas de rendimiento',
                'program_id' => $program->id,
                'order_index' => 3,
                'is_active' => true,
            ]);

            $level4 = Level::create([
                'name' => 'Nivel 4: Maestría',
                'description' => 'Dominio completo de técnicas mentales',
                'program_id' => $program->id,
                'order_index' => 4,
                'is_active' => true,
            ]);

            // Add multimedia content to each level
            foreach ([$level1, $level2, $level3, $level4] as $index => $level) {
                // Video
                Multimedia::create([
                    'name' => "Video Introductorio - {$level->name}",
                    'description' => 'Video de introducción al nivel',
                    'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'type' => 'video',
                    'duration' => '15:30',
                    'level_id' => $level->id,
                    'order_index' => 1,
                    'is_active' => true,
                ]);

                // Document
                Multimedia::create([
                    'name' => "Guía de Estudio - {$level->name}",
                    'description' => 'Documento PDF con ejercicios prácticos',
                    'url' => 'https://example.com/guia.pdf',
                    'type' => 'document',
                    'level_id' => $level->id,
                    'order_index' => 2,
                    'is_active' => true,
                ]);

                // Audio (only for levels 2 and 3)
                if ($index >= 1 && $index <= 2) {
                    Multimedia::create([
                        'name' => "Meditación Guiada - {$level->name}",
                        'description' => 'Audio de meditación para mejorar la concentración',
                        'url' => 'https://example.com/meditacion.mp3',
                        'type' => 'audio',
                        'duration' => '10:00',
                        'level_id' => $level->id,
                        'order_index' => 3,
                        'is_active' => true,
                    ]);
                }
            }
        }

        // Inscribir al estudiante en el programa
        // This will automatically unlock the first level
        if (!$program->hasStudent($studentUser)) {
            $studentUser->enrollInProgram($program);
        }

        // Create a confirmed payment for the student so they can access the program
        if (!$studentUser->payments()->where('program_id', $program->id)->exists()) {
            Payment::create([
                'user_id' => $studentUser->id,
                'program_id' => $program->id,
                'amount' => 500.00,
                'status' => Payment::STATUS_CONFIRMED,
                'paid_at' => now(),
                'due_date' => now()->addMonth(),
            ]);
        }

        // Create sample appointments
        // 1. Upcoming scheduled appointment
        $upcomingAppointment = Appointment::firstOrCreate(
            [
                'program_id' => $program->id,
                'psychologist_id' => $psychologist->id,
                'student_id' => $studentUser->id,
                'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            ],
            [
                'scheduled_time' => '10:00:00',
                'duration_minutes' => 60,
                'meeting_type' => Appointment::TYPE_ONLINE,
                'meeting_link' => 'https://meet.google.com/abc-defg-hij',
                'notes' => 'Primera sesión de evaluación del progreso en el nivel 1.',
                'status' => Appointment::STATUS_SCHEDULED,
                'is_recurring' => false,
            ]
        );

        // 2. Appointment with pending reschedule and proposals
        $rescheduleAppointment = Appointment::firstOrCreate(
            [
                'program_id' => $program->id,
                'psychologist_id' => $psychologist->id,
                'student_id' => $studentUser->id,
                'scheduled_date' => now()->addDays(7)->format('Y-m-d'),
            ],
            [
                'scheduled_time' => '15:00:00',
                'duration_minutes' => 90,
                'meeting_type' => Appointment::TYPE_ONLINE,
                'meeting_link' => 'https://zoom.us/j/123456789',
                'notes' => 'Sesión de revisión de técnicas de concentración.',
                'status' => Appointment::STATUS_PENDING_RESCHEDULE,
                'is_recurring' => false,
            ]
        );

        // Add reschedule proposals to demonstrate the chat flow
        if ($rescheduleAppointment->proposals()->count() === 0) {
            // Student proposes new dates
            $studentProposal = AppointmentProposal::create([
                'appointment_id' => $rescheduleAppointment->id,
                'user_id' => $studentUser->id,
                'proposed_dates' => [
                    ['date' => now()->addDays(8)->format('Y-m-d'), 'time' => '16:00:00'],
                    ['date' => now()->addDays(9)->format('Y-m-d'), 'time' => '15:00:00'],
                    ['date' => now()->addDays(10)->format('Y-m-d'), 'time' => '14:00:00'],
                ],
                'message' => 'Disculpa, tengo entrenamiento ese día. ¿Te funcionan estas opciones?',
                'status' => AppointmentProposal::STATUS_PENDING,
            ]);

            // Psychologist counter-proposes
            AppointmentProposal::create([
                'appointment_id' => $rescheduleAppointment->id,
                'user_id' => $psychologist->id,
                'proposed_dates' => [
                    ['date' => now()->addDays(8)->format('Y-m-d'), 'time' => '16:00:00'],
                    ['date' => now()->addDays(11)->format('Y-m-d'), 'time' => '11:00:00'],
                ],
                'message' => 'El martes 16:00 me funciona perfecto. También tengo disponible el viernes por la mañana.',
                'status' => AppointmentProposal::STATUS_PENDING,
            ]);
        }

        // 3. Completed appointment (past)
        Appointment::firstOrCreate(
            [
                'program_id' => $program->id,
                'psychologist_id' => $psychologist->id,
                'student_id' => $studentUser->id,
                'scheduled_date' => now()->subDays(5)->format('Y-m-d'),
            ],
            [
                'scheduled_time' => '14:00:00',
                'duration_minutes' => 60,
                'meeting_type' => Appointment::TYPE_ONLINE,
                'meeting_link' => 'https://meet.google.com/xyz-abcd-efg',
                'notes' => 'Sesión inicial de introducción al programa.',
                'status' => Appointment::STATUS_COMPLETED,
                'is_recurring' => false,
            ]
        );

        // 4. Recurring weekly appointment
        Appointment::firstOrCreate(
            [
                'program_id' => $program->id,
                'psychologist_id' => $psychologist->id,
                'student_id' => $studentUser->id,
                'scheduled_date' => now()->addDays(14)->format('Y-m-d'),
            ],
            [
                'scheduled_time' => '09:00:00',
                'duration_minutes' => 45,
                'meeting_type' => Appointment::TYPE_ONLINE,
                'meeting_link' => 'https://meet.google.com/recurring-link',
                'notes' => 'Sesión semanal de seguimiento. Se repetirá cada semana durante 4 semanas.',
                'status' => Appointment::STATUS_SCHEDULED,
                'is_recurring' => true,
                'recurrence_pattern' => 'weekly',
                'recurrence_count' => 4,
            ]
        );
    }
}
