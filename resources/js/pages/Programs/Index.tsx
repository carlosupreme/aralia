import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';
import {
    BookMarked,
    Plus,
    Users,
    Target,
    Settings,
    Eye,
    Calendar,
    User
} from 'lucide-react';

interface Program {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    psychologist?: {
        id: number;
        name: string;
        email: string;
    };
    levels_count: number;
    students_count?: number;
}

interface Props {
    programs: Program[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programas y Planes',
        href: '/programs',
    },
];

export default function ProgramsIndex({ programs }: Props) {
    const { isPsychologist, isStudent } = useAuth();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programas y Planes" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isPsychologist ? 'Mis Programas' : 'Mis Programas Inscritos'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isPsychologist
                                ? 'Gestiona y crea programas de entrenamiento mental'
                                : 'Accede a tus programas de entrenamiento mental'
                            }
                        </p>
                    </div>

                    {/* Create Program Button - Only for Psychologists */}
                    <ProtectedRoute requiredRole="psychologist">
                        <Link href="/programs/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Programa
                            </Button>
                        </Link>
                    </ProtectedRoute>
                </div>

                {/* Programs Grid */}
                {programs.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookMarked className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {isPsychologist ? 'No has creado ningún programa' : 'No tienes programas inscritos'}
                            </h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {isPsychologist
                                    ? 'Comienza creando tu primer programa de entrenamiento mental'
                                    : 'Contacta a tu psicólogo para inscribirte en un programa'
                                }
                            </p>
                            {isPsychologist && (
                                <Link href="/programs/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Primer Programa
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {programs.map((program) => (
                            <Card key={program.id} className="relative">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{program.name}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={program.is_active ? "default" : "secondary"}>
                                                {program.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {program.description || 'Sin descripción'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        {/* Program Stats */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Target className="w-4 h-4" />
                                                <span>{program.levels_count} niveles</span>
                                            </div>
                                            {isPsychologist && (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                    <span>{program.students_count || 0} estudiantes</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Psychologist Info for Students */}
                                        {isStudent && program.psychologist && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                <span>{program.psychologist.name}</span>
                                            </div>
                                        )}

                                        {/* Created Date */}
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>Creado {new Date(program.created_at).toLocaleDateString('es-ES')}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/programs/${program.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Ver Programa
                                                </Button>
                                            </Link>

                                            {isPsychologist && (
                                                <Link href={`/programs/${program.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Settings className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}