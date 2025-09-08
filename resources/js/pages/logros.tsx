import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GamificationCard } from '@/components/gamification-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard, logros } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Trophy, 
    Star,
    Target,
    Zap,
    Award,
    Medal,
    Filter,
    Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Logros',
        href: logros().url,
    },
];

// Mock data completo para logros
const allAchievements = [
    // Logros Básicos (Common)
    {
        id: '1',
        title: 'Primera Sesión',
        description: 'Completaste tu primera sesión de entrenamiento mental',
        icon: 'star' as const,
        rarity: 'common' as const,
        unlocked: true,
        category: 'inicio'
    },
    {
        id: '2',
        title: 'Primer Nivel Completado',
        description: 'Terminaste completamente tu primer nivel de entrenamiento',
        icon: 'target' as const,
        rarity: 'common' as const,
        unlocked: true,
        category: 'progreso'
    },
    {
        id: '3',
        title: 'Estudiante Dedicado',
        description: 'Completa 5 sesiones de entrenamiento',
        icon: 'trophy' as const,
        rarity: 'common' as const,
        unlocked: true,
        category: 'dedicacion'
    },

    // Logros Raros (Rare)
    {
        id: '4',
        title: 'Racha de 7 Días',
        description: 'Mantuviste una racha de entrenamiento por 7 días consecutivos',
        icon: 'zap' as const,
        rarity: 'rare' as const,
        unlocked: true,
        category: 'consistencia'
    },
    {
        id: '5',
        title: 'Explorador Mental',
        description: 'Completa contenido de 3 niveles diferentes',
        icon: 'award' as const,
        rarity: 'rare' as const,
        unlocked: false,
        progress: 2,
        maxProgress: 3,
        category: 'exploracion'
    },
    {
        id: '6',
        title: 'Velocista del Aprendizaje',
        description: 'Completa 10 sesiones en una semana',
        icon: 'zap' as const,
        rarity: 'rare' as const,
        unlocked: false,
        progress: 6,
        maxProgress: 10,
        category: 'velocidad'
    },

    // Logros Épicos (Epic)
    {
        id: '7',
        title: 'Maestro de la Concentración',
        description: 'Completa 10 ejercicios de concentración con puntuación perfecta',
        icon: 'target' as const,
        rarity: 'epic' as const,
        unlocked: false,
        progress: 6,
        maxProgress: 10,
        category: 'maestria'
    },
    {
        id: '8',
        title: 'Mentor en Formación',
        description: 'Alcanza el nivel 5 y mantén una racha de 30 días',
        icon: 'medal' as const,
        rarity: 'epic' as const,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        category: 'liderazgo'
    },
    {
        id: '9',
        title: 'Coleccionista de Conocimiento',
        description: 'Completa todos los tipos de contenido: videos, artículos, ejercicios y quizzes',
        icon: 'star' as const,
        rarity: 'epic' as const,
        unlocked: false,
        progress: 3,
        maxProgress: 4,
        category: 'completitud'
    },

    // Logros Legendarios (Legendary)
    {
        id: '10',
        title: 'Leyenda del Deporte Mental',
        description: 'Alcanza el nivel 10 y mantén el rendimiento por un mes',
        icon: 'award' as const,
        rarity: 'legendary' as const,
        unlocked: false,
        progress: 3,
        maxProgress: 10,
        category: 'leyenda'
    },
    {
        id: '11',
        title: 'Perfectionist Supreme',
        description: 'Obtén puntuación perfecta en todos los quizzes y ejercicios',
        icon: 'trophy' as const,
        rarity: 'legendary' as const,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        category: 'perfeccion'
    },
    {
        id: '12',
        title: 'Campeón Mental',
        description: 'Completa el programa completo con excelencia (95% o más)',
        icon: 'medal' as const,
        rarity: 'legendary' as const,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        category: 'excelencia'
    }
];

const categories = [
    { id: 'todos', name: 'Todos', count: allAchievements.length },
    { id: 'desbloqueados', name: 'Desbloqueados', count: allAchievements.filter(a => a.unlocked).length },
    { id: 'progreso', name: 'En Progreso', count: allAchievements.filter(a => !a.unlocked && a.progress).length },
    { id: 'bloqueados', name: 'Bloqueados', count: allAchievements.filter(a => !a.unlocked && !a.progress).length },
];

const rarityStats = [
    { 
        rarity: 'common', 
        name: 'Común', 
        count: allAchievements.filter(a => a.rarity === 'common').length,
        unlocked: allAchievements.filter(a => a.rarity === 'common' && a.unlocked).length,
        color: 'text-muted-foreground'
    },
    { 
        rarity: 'rare', 
        name: 'Raro', 
        count: allAchievements.filter(a => a.rarity === 'rare').length,
        unlocked: allAchievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
        color: 'text-primary'
    },
    { 
        rarity: 'epic', 
        name: 'Épico', 
        count: allAchievements.filter(a => a.rarity === 'epic').length,
        unlocked: allAchievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
        color: 'text-foreground'
    },
    { 
        rarity: 'legendary', 
        name: 'Legendario', 
        count: allAchievements.filter(a => a.rarity === 'legendary').length,
        unlocked: allAchievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
        color: 'text-primary'
    },
];

export default function Logros() {
    const totalUnlocked = allAchievements.filter(a => a.unlocked).length;
    const totalProgress = (totalUnlocked / allAchievements.length) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Logros - MenteSport" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Trophy className="w-8 h-8" />
                        Mis Logros
                    </h1>
                    <p className="text-muted-foreground">
                        Descubre y desbloquea todos los logros disponibles en tu jornada de entrenamiento mental
                    </p>
                </div>

                {/* Progress Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Award className="w-6 h-6" />
                            Progreso de Logros
                        </CardTitle>
                        <CardDescription>
                            Has desbloqueado {totalUnlocked} de {allAchievements.length} logros disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-4">
                                {rarityStats.map((stat) => (
                                    <div key={stat.rarity} className="text-center">
                                        <div className={`text-2xl font-bold ${stat.color}`}>
                                            {stat.unlocked}/{stat.count}
                                        </div>
                                        <div className="text-sm text-muted-foreground capitalize">
                                            {stat.name}
                                        </div>
                                        <Progress 
                                            value={(stat.unlocked / stat.count) * 100} 
                                            className="mt-2 h-2" 
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Progreso Total</span>
                                    <span className="text-sm text-muted-foreground">
                                        {Math.round(totalProgress)}% completado
                                    </span>
                                </div>
                                <Progress value={totalProgress} className="h-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={category.id === 'todos' ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs"
                            >
                                {category.name} ({category.count})
                            </Button>
                        ))}
                    </div>
                    
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar logros..."
                            className="pl-8 w-full sm:w-[200px]"
                        />
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="space-y-6">
                    {/* Recent/Unlocked Achievements */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Logros Desbloqueados
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {allAchievements
                                .filter(achievement => achievement.unlocked)
                                .map((achievement) => (
                                    <GamificationCard 
                                        key={achievement.id} 
                                        achievement={achievement}
                                    />
                                ))}
                        </div>
                    </div>

                    {/* In Progress Achievements */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            En Progreso
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {allAchievements
                                .filter(achievement => !achievement.unlocked && achievement.progress)
                                .map((achievement) => (
                                    <GamificationCard 
                                        key={achievement.id} 
                                        achievement={achievement}
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Locked/Mystery Achievements */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Medal className="w-5 h-5" />
                            Por Desbloquear
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {allAchievements
                                .filter(achievement => !achievement.unlocked && !achievement.progress)
                                .map((achievement) => (
                                    <GamificationCard 
                                        key={achievement.id} 
                                        achievement={achievement}
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Achievement Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Consejos para Desbloquear Logros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <Target className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Mantén la Consistencia</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Muchos logros requieren práctica regular durante varios días
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <Star className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Explora Todo el Contenido</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Intenta diferentes tipos de ejercicios y actividades
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Busca la Excelencia</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Los logros más raros requieren alto rendimiento
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}