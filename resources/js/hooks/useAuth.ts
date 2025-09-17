import { usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    gamification?: {
        current_level: number;
        total_achievements: number;
        progress_to_next_level: number;
    };
}

interface Auth {
    user: User | null;
}

interface PageProps {
    auth: Auth;
}

export function useAuth() {
    const { auth } = usePage<PageProps>().props;

    const user = auth.user;

    const hasRole = (role: string): boolean => {
        return user?.roles.includes(role) ?? false;
    };

    const hasPermission = (permission: string): boolean => {
        return user?.permissions.includes(permission) ?? false;
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };

    const isStudent = hasRole('student');
    const isPsychologist = hasRole('psychologist');

    return {
        user,
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,
        isStudent,
        isPsychologist,
    };
}
