import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GamificationCard } from '@/components/gamification-card';
import { LevelCard } from '@/components/level-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    Calendar,
    Video,
    Trophy,
    Target,
    Star,
    BookOpen,
    Clock,
    Users,
    Award,
    Zap
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Generalidades',
        href: dashboard().url,
    },
];

// Mock data para el estudiante deportista
const mockAchievements = [
    {
        id: '1',
        title: 'Primera Sesión',
        description: 'Completaste tu primera sesión de entrenamiento mental',
        icon: 'star' as const,
        rarity: 'common' as const,
        unlocked: true,
    },
    {
        id: '2',
        title: 'Racha de 7 Días',
        description: 'Mantuviste una racha de entrenamiento por 7 días consecutivos',
        icon: 'trophy' as const,
        rarity: 'rare' as const,
        unlocked: true,
    },
    {
        id: '3',
        title: 'Maestro de la Concentración',
        description: 'Completa 10 ejercicios de concentración con puntuación perfecta',
        icon: 'target' as const,
        rarity: 'epic' as const,
        unlocked: false,
        progress: 6,
        maxProgress: 10,
    },
    {
        id: '4',
        title: 'Leyenda del Deporte Mental',
        description: 'Alcanza el nivel 10 y mantén el rendimiento por un mes',
        icon: 'award' as const,
        rarity: 'legendary' as const,
        unlocked: false,
        progress: 3,
        maxProgress: 10,
    }
];

const mockLevels = [
    {
        id: 1,
        title: 'Fundamentos de la Confianza',
        description: 'Aprende los conceptos básicos de la confianza en el deporte',
        isUnlocked: true,
        isCompleted: true,
        progress: 100,
        totalContent: 4,
        completedContent: 4,
        contents: [
            { id: '1', title: 'Introducción a la confianza', type: 'video' as const, duration: '15 min', completed: true },
            { id: '2', title: 'Ejercicios de autoestima', type: 'exercise' as const, completed: true },
            { id: '3', title: 'Lectura: Confianza deportiva', type: 'article' as const, completed: true },
            { id: '4', title: 'Quiz: Evaluación inicial', type: 'quiz' as const, completed: true },
        ]
    },
    {
        id: 2,
        title: 'Control de la Ansiedad Pre-Competencia',
        description: 'Técnicas para manejar los nervios antes de competir',
        isUnlocked: true,
        isCompleted: false,
        progress: 60,
        totalContent: 5,
        completedContent: 3,
        contents: [
            { id: '5', title: 'Respiración consciente', type: 'video' as const, duration: '12 min', completed: true },
            { id: '6', title: 'Técnicas de relajación', type: 'exercise' as const, completed: true },
            { id: '7', title: 'Visualización positiva', type: 'video' as const, duration: '18 min', completed: true },
            { id: '8', title: 'Rutinas pre-competencia', type: 'article' as const, completed: false },
            { id: '9', title: 'Evaluación de progreso', type: 'quiz' as const, completed: false },
        ]
    },
    {
        id: 3,
        title: 'Concentración y Enfoque',
        description: 'Desarrolla tu capacidad de mantener la concentración durante el entrenamiento y competencia',
        isUnlocked: true,
        isCompleted: false,
        progress: 0,
        totalContent: 6,
        completedContent: 0,
        contents: [
            { id: '10', title: 'Fundamentos del enfoque', type: 'video' as const, duration: '20 min', completed: false },
            { id: '11', title: 'Ejercicios de atención plena', type: 'exercise' as const, completed: false },
            { id: '12', title: 'Manejo de distracciones', type: 'article' as const, completed: false },
            { id: '13', title: 'Práctica de concentración', type: 'exercise' as const, completed: false },
            { id: '14', title: 'Técnicas avanzadas', type: 'video' as const, duration: '25 min', completed: false },
            { id: '15', title: 'Examen de concentración', type: 'quiz' as const, completed: false },
        ]
    },
    {
        id: 4,
        title: 'Motivación y Metas',
        description: 'Establece metas efectivas y mantén la motivación a largo plazo',
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        totalContent: 5,
        completedContent: 0,
        requiredLevel: 3,
        contents: [
            { id: '16', title: 'Establecimiento de metas SMART', type: 'video' as const, duration: '15 min', completed: false },
            { id: '17', title: 'Plan de acción personal', type: 'exercise' as const, completed: false },
            { id: '18', title: 'Mantener la motivación', type: 'article' as const, completed: false },
            { id: '19', title: 'Seguimiento de progreso', type: 'exercise' as const, completed: false },
            { id: '20', title: 'Evaluación de metas', type: 'quiz' as const, completed: false },
        ]
    }
];

export default function Dashboard() {
    const currentLevel = 3;
    const nextVideoCall = new Date('2025-01-15');
    const totalXP = 1250;
    const weeklyGoal = 5; // sesiones por semana
    const completedThisWeek = 3;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Psicología para el deporte" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header con saludo personalizado */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        ¡Hola, Alex! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Continúa desarrollando tu fortaleza mental. ¡Vas genial!
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nivel Actual</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currentLevel}</div>
                            <p className="text-xs text-muted-foreground">
                                65% al siguiente nivel
                            </p>
                            <Progress value={65} className="mt-2 h-1" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tus superpoderes como deportistas</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalXP.toLocaleString()} XP</div>
                            <p className="text-xs text-muted-foreground">
                                +150 Super puntos esta semana
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Objetivo Semanal</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedThisWeek}/{weeklyGoal}</div>
                            <p className="text-xs text-muted-foreground">
                                Sesiones completadas
                            </p>
                            <Progress value={(completedThisWeek / weeklyGoal) * 100} className="mt-2 h-1" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">15</div>
                            <p className="text-xs text-muted-foreground">
                                Enero - 4:00 PM
                            </p>
                            <Badge variant="outline" className="mt-2">
                                <Video className="w-3 h-3 mr-1" />
                                Videollamada
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Levels */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Mis Niveles de Entrenamiento
                            </h2>
                            <Button variant="outline" size="sm">
                                Ver Todos
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {mockLevels.slice(0, 4).map((level) => (
                                <LevelCard key={level.id} level={level} />
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Achievements & Quick Actions */}
                    <div className="space-y-6">
                        {/* Recent Achievements */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    Logros Recientes
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {mockAchievements.slice(0, 3).map((achievement) => (
                                    <GamificationCard
                                        key={achievement.id}
                                        achievement={achievement}
                                        className="h-auto"
                                    />
                                ))}
                            </div>

                            <Button variant="outline" className="w-full mt-3">
                                Ver Todos los Logros
                            </Button>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Acciones Rápidas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" variant="default">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Continuar Nivel Actual
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Video className="w-4 h-4 mr-2" />
                                    Programar Videollamada
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Users className="w-4 h-4 mr-2" />
                                    Unirse al Foro
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
