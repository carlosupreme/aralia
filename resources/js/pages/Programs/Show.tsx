import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';
import {
    ArrowLeft,
    Settings,
    Users,
    Target,
    Play,
    FileText,
    Image,
    Video,
    File,
    Music,
    BookOpen,
    Lock,
    CheckCircle,
    Clock
} from 'lucide-react';

interface Multimedia {
    id: number;
    name: string;
    description?: string;
    type: 'video' | 'pdf' | 'image' | 'text' | 'audio' | 'document';
    url: string;
    size?: string;
    duration?: string;
    order_index: number;
}

interface Level {
    id: number;
    name: string;
    description?: string;
    order_index: number;
    is_active: boolean;
    multimedia: Multimedia[];
    is_unlocked_for_user?: boolean;
    is_completed_for_user?: boolean;
}

interface Program {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    psychologist: {
        id: number;
        name: string;
        email: string;
    };
    students?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    levels: Level[];
}

interface Props {
    program: Program;
}

const getMultimediaIcon = (type: string) => {
    switch (type) {
        case 'video':
            return Video;
        case 'pdf':
        case 'document':
            return FileText;
        case 'image':
            return Image;
        case 'audio':
            return Music;
        case 'text':
            return BookOpen;
        default:
            return File;
    }
};

export default function ShowProgram({ program }: Props) {
    const { isPsychologist, isStudent } = useAuth();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Programas y Planes',
            href: '/programs',
        },
        {
            title: program.name,
            href: `/programs/${program.id}`,
        },
    ];

    // Calculate program progress for students
    const completedLevels = program.levels.filter(level => level.is_completed_for_user).length;
    const totalLevels = program.levels.length;
    const progressPercentage = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${program.name} - Programas y Planes`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/programs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {program.name}
                            </h1>
                            <Badge variant={program.is_active ? "default" : "secondary"}>
                                {program.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                        {program.description && (
                            <p className="text-muted-foreground">
                                {program.description}
                            </p>
                        )}
                    </div>

                    {/* Edit Button - Only for Psychologists */}
                    <ProtectedRoute requiredRole="psychologist">
                        <Link href={`/programs/${program.id}/edit`}>
                            <Button variant="outline">
                                <Settings className="w-4 h-4 mr-2" />
                                Configurar
                            </Button>
                        </Link>
                    </ProtectedRoute>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Program Info */}
                    <div className="space-y-6">
                        {/* Program Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Programa</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Psicólogo</span>
                                    <span className="font-medium">{program.psychologist.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Niveles</span>
                                    <span className="font-medium">{program.levels.length}</span>
                                </div>
                                {isPsychologist && program.students && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Estudiantes</span>
                                        <span className="font-medium">{program.students.length}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Creado</span>
                                    <span className="font-medium">
                                        {new Date(program.created_at).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress for Students */}
                        {isStudent && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mi Progreso</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Niveles completados</span>
                                            <span>{completedLevels} de {totalLevels}</span>
                                        </div>
                                        <Progress value={progressPercentage} />
                                        <p className="text-xs text-muted-foreground text-center">
                                            {Math.round(progressPercentage)}% completado
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Students List for Psychologists */}
                        {isPsychologist && program.students && program.students.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Estudiantes Inscritos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {program.students.map((student) => (
                                            <div key={student.id} className="flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                                                    {student.name[0].toUpperCase()}
                                                </div>
                                                <span>{student.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Levels Content */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Niveles del Programa</h2>
                            <ProtectedRoute requiredRole="psychologist">
                                <Link href={`/programs/${program.id}/levels/create`}>
                                    <Button>
                                        <Target className="w-4 h-4 mr-2" />
                                        Agregar Nivel
                                    </Button>
                                </Link>
                            </ProtectedRoute>
                        </div>

                        {program.levels.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Target className="w-12 h-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No hay niveles creados
                                    </h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Este programa aún no tiene niveles de aprendizaje
                                    </p>
                                    <ProtectedRoute requiredRole="psychologist">
                                        <Link href={`/programs/${program.id}/levels/create`}>
                                            <Button>
                                                <Target className="w-4 h-4 mr-2" />
                                                Crear Primer Nivel
                                            </Button>
                                        </Link>
                                    </ProtectedRoute>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {program.levels.map((level, index) => {
                                    const isUnlocked = isPsychologist || level.is_unlocked_for_user;
                                    const isCompleted = level.is_completed_for_user;

                                    return (
                                        <Card key={level.id} className={`${!isUnlocked ? 'opacity-60' : ''}`}>
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : isUnlocked ? (
                                                            <Clock className="w-5 h-5 text-blue-600" />
                                                        ) : (
                                                            <Lock className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg">
                                                            Nivel {index + 1}: {level.name}
                                                        </CardTitle>
                                                        {level.description && (
                                                            <CardDescription>
                                                                {level.description}
                                                            </CardDescription>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={isCompleted ? "default" : isUnlocked ? "secondary" : "outline"}>
                                                            {isCompleted ? "Completado" : isUnlocked ? "Disponible" : "Bloqueado"}
                                                        </Badge>
                                                        {isUnlocked ? (
                                                            <Link href={`/levels/${level.id}/learn`}>
                                                                <Button size="sm" variant="outline" className="flex items-center gap-2">
                                                                    <Play className="w-3 h-3" />
                                                                    Aprender
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Button size="sm" variant="outline" disabled className="flex items-center gap-2">
                                                                <Lock className="w-3 h-3" />
                                                                Bloqueado
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            {/* Multimedia Content */}
                                            {level.multimedia.length > 0 && (isUnlocked || isPsychologist) && (
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium text-sm">Contenido multimedia:</h4>
                                                        <div className="grid gap-2 sm:grid-cols-2">
                                                            {level.multimedia.map((media) => {
                                                                const Icon = getMultimediaIcon(media.type);
                                                                return (
                                                                    <div key={media.id} className="flex items-center gap-2 p-2 border rounded-lg text-sm">
                                                                        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="truncate font-medium">{media.name}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {media.type} {media.duration && `• ${media.duration}`}
                                                                            </p>
                                                                        </div>
                                                                        {isUnlocked && (
                                                                            <Button variant="ghost" size="sm">
                                                                                <Play className="w-3 h-3" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Level Actions for Psychologists */}
                                                    <ProtectedRoute requiredRole="psychologist">
                                                        <div className="flex gap-2 mt-4 pt-4 border-t">
                                                            <Link href={`/levels/${level.id}/multimedia/create`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    Agregar Contenido
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/levels/${level.id}/edit`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Settings className="w-4 h-4 mr-2" />
                                                                    Editar Nivel
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </ProtectedRoute>
                                                </CardContent>
                                            )}

                                            {level.multimedia.length === 0 && (isUnlocked || isPsychologist) && (
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Este nivel no tiene contenido multimedia
                                                    </p>
                                                    <ProtectedRoute requiredRole="psychologist">
                                                        <div className="flex gap-2">
                                                            <Link href={`/levels/${level.id}/multimedia/create`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    Agregar Contenido
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/levels/${level.id}/edit`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Settings className="w-4 h-4 mr-2" />
                                                                    Editar Nivel
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </ProtectedRoute>
                                                </CardContent>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}