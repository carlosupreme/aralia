# Roles and Permissions System

This project uses **Spatie Laravel Permission** package to manage user roles and permissions in a sports psychology application for students and psychologists.

## Overview

The system implements a Role-Based Access Control (RBAC) with two main roles:
- **Student**: Athletes who access training content and psychological support
- **Psychologist**: Mental health professionals who manage students and content

## System Architecture

### Backend (Laravel)
- **Package**: `spatie/laravel-permission`
- **User Model**: Uses `HasRoles` trait
- **Custom Middleware**: `CheckRole` for route protection
- **Seeder**: `RolesAndPermissionsSeeder` for initial data

### Frontend (React + Inertia)
- **Hook**: `useAuth()` for permission checking
- **Components**: `ProtectedRoute`, `StudentOnly`, `PsychologistOnly`
- **Guards**: `PermissionGuard` for granular content protection

## Roles and Permissions

### Student Role
Students can:
- ✅ `view dashboard` - Access main dashboard
- ✅ `view profile` - View their profile
- ✅ `edit profile` - Edit their personal information
- ✅ `view progress` - See their learning progress
- ✅ `view levels` - Access training levels/modules
- ✅ `view multimedia` - View multimedia content
- ✅ `join videocalls` - Join scheduled video sessions
- ✅ `view achievements` - See their gamification achievements
- ✅ `manage subscription` - Handle subscription settings

### Psychologist Role
Psychologists have **all permissions** including student permissions plus:
- ✅ `manage users` - Create and manage user accounts
- ✅ `view all students` - See all students in the system
- ✅ `manage students` - Modify student information and progress
- ✅ `manage parents` - Handle parent/guardian accounts
- ✅ `manage programs` - Create and edit training programs
- ✅ `manage payments` - Handle billing and payments
- ✅ `manage communication` - Send messages and notifications
- ✅ `manage appointments` - Schedule and manage sessions
- ✅ `create videocalls` - Create video call sessions
- ✅ `view reports` - Access analytical reports and data

## Implementation Examples

### Backend Usage

#### In Controllers
```php
// Check role
if (auth()->user()->hasRole('psychologist')) {
    // Psychologist-only logic
}

// Check permission
if (auth()->user()->hasPermission('manage students')) {
    // Allow student management
}
```

#### In Routes with Middleware
```php
// Protect routes with role middleware
Route::middleware(['auth', 'role:psychologist'])->group(function () {
    Route::get('/admin/students', [AdminController::class, 'students']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
});

// Protect with specific permissions
Route::middleware(['auth', 'permission:manage payments'])->group(function () {
    Route::get('/billing', [BillingController::class, 'index']);
});
```

#### In Blade Templates (if used)
```php
@role('psychologist')
    <a href="/admin">Admin Panel</a>
@endrole

@can('manage students')
    <button>Edit Student</button>
@endcan
```

### Frontend Usage (React)

#### Using the useAuth Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

function DashboardComponent() {
    const { user, hasRole, hasPermission, isStudent, isPsychologist } = useAuth();

    return (
        <div>
            {isStudent && <StudentDashboard />}
            {isPsychologist && <PsychologistDashboard />}

            {hasPermission('manage students') && (
                <button>Manage Students</button>
            )}
        </div>
    );
}
```

#### Using Protected Route Components
```tsx
import { ProtectedRoute, StudentOnly, PsychologistOnly } from '@/components/ProtectedRoute';

function App() {
    return (
        <div>
            {/* Only students can see this */}
            <StudentOnly>
                <StudentProgressChart />
            </StudentOnly>

            {/* Only psychologists can see this */}
            <PsychologistOnly>
                <AdminPanel />
            </PsychologistOnly>

            {/* Specific permission required */}
            <ProtectedRoute requiredPermission="manage payments">
                <BillingSection />
            </ProtectedRoute>

            {/* Multiple roles allowed */}
            <ProtectedRoute requiredRoles={['student', 'psychologist']}>
                <ProfileSettings />
            </ProtectedRoute>
        </div>
    );
}
```

#### Permission Guard for Conditional Content
```tsx
import { PermissionGuard } from '@/components/ProtectedRoute';

function Toolbar() {
    return (
        <div className="toolbar">
            <PermissionGuard permission="manage users">
                <button>Create User</button>
            </PermissionGuard>

            <PermissionGuard permission="view reports">
                <button>View Reports</button>
            </PermissionGuard>
        </div>
    );
}
```

## Database Structure

The package creates these tables:
- `roles` - Stores role definitions
- `permissions` - Stores permission definitions
- `role_has_permissions` - Links roles to permissions
- `model_has_roles` - Links users to roles
- `model_has_permissions` - Links users to direct permissions (optional)

## User Relationship

The `User` model includes helper methods:
```php
// Check if user is a psychologist
$user->isPsychologist(); // returns boolean

// Check if user is a student
$user->isStudent(); // returns boolean

// User relationships
$psychologist->students; // Get all students assigned to this psychologist
$student->psychologist; // Get the assigned psychologist
```

## Security Features

1. **Middleware Protection**: Routes are protected at the server level
2. **Frontend Guards**: UI elements are conditionally shown
3. **Custom Middleware**: `CheckRole` middleware provides role-based route access
4. **Cache Optimization**: Permissions are cached for 24 hours for performance
5. **Exception Handling**: Clear error messages for unauthorized access

## Setup and Seeding

### Running the Seeder
```bash
php artisan db:seed --class=RolesAndPermissionsSeeder
```

This creates:
- **Test Psychologist**: `psicologo@example.com` / `123456`
- **Test Student**: `estudiante@example.com` / `123456`

### Custom Configuration
The system can be configured in `config/permission.php` for:
- Cache settings
- Table names
- Team support (currently disabled)
- Event listeners

## Best Practices

1. **Always check permissions on both frontend and backend**
2. **Use specific permissions rather than just roles when possible**
3. **Cache user permissions for better performance**
4. **Provide clear error messages for unauthorized access**
5. **Use the provided React components for consistent UI protection**
6. **Test permission logic thoroughly with different user types**

## Adding New Permissions

1. Add to the seeder:
```php
$permissions = [
    'existing permissions...',
    'new permission name',
];
```

2. Assign to appropriate roles:
```php
$studentRole->givePermissionTo(['new permission name']);
```

3. Use in frontend:
```tsx
{hasPermission('new permission name') && <NewFeature />}
```

4. Protect backend routes:
```php
Route::middleware(['auth', 'permission:new permission name'])->group(function () {
    // Protected routes
});
```