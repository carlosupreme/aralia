import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
    requiredPermission?: string;
    requiredRoles?: string[];
    requiredPermissions?: string[];
    fallback?: ReactNode;
}

export function ProtectedRoute({
                                   children,
                                   requiredRole,
                                   requiredPermission,
                                   requiredRoles,
                                   requiredPermissions,
                                   fallback
                               }: ProtectedRouteProps) {
    const { hasRole, hasPermission, hasAnyRole, hasAnyPermission } = useAuth();

    // Verificar rol específico
    if (requiredRole && !hasRole(requiredRole)) {
        return <>{fallback || <AccessDenied />}</>;
    }

    // Verificar permiso específico
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <>{fallback || <AccessDenied />}</>;
    }

    // Verificar cualquier rol de la lista
    if (requiredRoles && !hasAnyRole(requiredRoles)) {
        return <>{fallback || <AccessDenied />}</>;
    }

    // Verificar cualquier permiso de la lista
    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
        return <>{fallback || <AccessDenied />}</>;
    }

    return <>{children}</>;
}

// Componente de acceso denegado por defecto
function AccessDenied() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Acceso Restringido
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        No tienes los permisos necesarios para ver este contenido.
                        Si crees que esto es un error, contacta a tu administrador.
                    </p>
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}

// Componente específico para contenido solo de estudiantes
export function StudentOnly({
                                children,
                                fallback
                            }: {
    children: ReactNode;
    fallback?: ReactNode;
}) {
    return (
        <ProtectedRoute requiredRole="student" fallback={fallback}>
            {children}
        </ProtectedRoute>
    );
}

// Componente específico para contenido solo de psicólogos
export function PsychologistOnly({
                                     children,
                                     fallback
                                 }: {
    children: ReactNode;
    fallback?: ReactNode;
}) {
    return (
        <ProtectedRoute requiredRole="psychologist" fallback={fallback}>
            {children}
        </ProtectedRoute>
    );
}

// Componente para mostrar contenido según permisos específicos
export function PermissionGuard({
                                    permission,
                                    children,
                                    fallback
                                }: {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
}) {
    return (
        <ProtectedRoute requiredPermission={permission} fallback={fallback}>
            {children}
        </ProtectedRoute>
    );
}
