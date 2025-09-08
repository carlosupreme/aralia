import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard, progreso } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    TrendingUp, 
    Calendar, 
    Target, 
    Star,
    BarChart3,
    Clock,
    Award,
    Zap,
    CheckCircle,
    Trophy
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Mi Progreso',
        href: progreso().url,
    },
];

// Mock data para el progreso
const weeklyStats = [
    { week: 'Sem 1', sessions: 4, xp: 200, level: 2.8 },
    { week: 'Sem 2', sessions: 5, xp: 250, level: 3.0 },
    { week: 'Sem 3', sessions: 3, xp: 150, level: 3.1 },
    { week: 'Sem 4', sessions: 6, xp: 300, level: 3.3 },
];

const skillProgress = [
    { skill: 'Confianza', current: 85, target: 90, color: 'bg-blue-500' },
    { skill: 'Control de Ansiedad', current: 72, target: 85, color: 'bg-green-500' },
    { skill: 'Concentración', current: 60, target: 80, color: 'bg-purple-500' },
    { skill: 'Motivación', current: 45, target: 75, color: 'bg-orange-500' },
    { skill: 'Manejo de Presión', current: 30, target: 70, color: 'bg-red-500' },
];

const recentActivities = [
    {
        id: 1,
        type: 'session',
        title: 'Completó: Técnicas de Respiración',
        description: 'Nivel 2 - Control de Ansiedad',
        date: '2025-01-08',
        xp: 50,
        icon: CheckCircle,
    },
    {
        id: 2,
        type: 'achievement',
        title: 'Logro Desbloqueado: Racha de 7 días',
        description: 'Mantuvo consistencia por una semana',
        date: '2025-01-07',
        xp: 150,
        icon: Trophy,
    },
    {
        id: 3,
        type: 'level',
        title: 'Subió al Nivel 3',
        description: 'Desbloqueó contenido de Concentración',
        date: '2025-01-05',
        xp: 200,
        icon: Star,
    },
];

export default function Progreso() {
    const currentLevel = 3;
    const currentXP = 1250;
    const nextLevelXP = 1500;
    const progressToNext = ((currentXP - 1000) / (nextLevelXP - 1000)) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi Progreso - Psicología para el deporte" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        Mi Progreso
                    </h1>
                    <p className="text-muted-foreground">
                        Seguimiento detallado de tu desarrollo en psicología deportiva
                    </p>
                </div>

                {/* Level Progress Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Target className="w-6 h-6" />
                                    Nivel Actual: {currentLevel}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
                                </CardDescription>
                            </div>
                            <Badge className="text-lg px-4 py-2">
                                {Math.round(progressToNext)}% completado
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Progress value={progressToNext} className="h-4 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Necesitas {nextLevelXP - currentXP} XP más para alcanzar el Nivel {currentLevel + 1}
                        </p>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">+6 este mes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12h 30m</div>
                            <p className="text-xs text-muted-foreground">+3h esta semana</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">7 días</div>
                            <p className="text-xs text-muted-foreground">¡Récord personal!</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Logros</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12/25</div>
                            <p className="text-xs text-muted-foreground">48% completado</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Skills Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Desarrollo de Habilidades
                            </CardTitle>
                            <CardDescription>
                                Tu progreso en las diferentes áreas de la psicología deportiva
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {skillProgress.map((skill) => (
                                <div key={skill.skill} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{skill.skill}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {skill.current}% / {skill.target}%
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Progress value={skill.current} className="flex-1" />
                                        <div className="text-xs text-muted-foreground min-w-[40px]">
                                            {skill.target - skill.current > 0 ? `-${skill.target - skill.current}%` : '✓'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Actividad Reciente
                            </CardTitle>
                            <CardDescription>
                                Tus últimas sesiones y logros obtenidos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            +{activity.xp} XP
                                        </Badge>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Weekly Progress Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Progreso Semanal
                        </CardTitle>
                        <CardDescription>
                            Tu actividad y desarrollo durante las últimas semanas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            {weeklyStats.map((week) => (
                                <div key={week.week} className="text-center space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">{week.week}</div>
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold">{week.sessions}</div>
                                        <div className="text-xs text-muted-foreground">sesiones</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-purple-600">{week.xp} XP</div>
                                        <div className="text-xs text-muted-foreground">ganados</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}