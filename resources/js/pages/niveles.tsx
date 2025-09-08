import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { LevelCard } from '@/components/level-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard, niveles } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Target, 
    Star,
    BookOpen,
    Video,
    Trophy,
    CheckCircle,
    Lock,
    Play
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Niveles',
        href: niveles().url,
    },
];

// Mock data completo para todos los niveles
const allLevels = [
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
    },
    {
        id: 5,
        title: 'Manejo de la Presión Competitiva',
        description: 'Técnicas avanzadas para competir bajo presión',
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        totalContent: 7,
        completedContent: 0,
        requiredLevel: 4,
        contents: [
            { id: '21', title: 'Psicología de la competencia', type: 'video' as const, duration: '22 min', completed: false },
            { id: '22', title: 'Técnicas de autorregulación', type: 'exercise' as const, completed: false },
            { id: '23', title: 'Manejo del público', type: 'article' as const, completed: false },
            { id: '24', title: 'Simulacros de presión', type: 'exercise' as const, completed: false },
            { id: '25', title: 'Recuperación post-competencia', type: 'video' as const, duration: '18 min', completed: false },
            { id: '26', title: 'Análisis de rendimiento', type: 'article' as const, completed: false },
            { id: '27', title: 'Examen final de presión', type: 'quiz' as const, completed: false },
        ]
    },
    {
        id: 6,
        title: 'Liderazgo Deportivo',
        description: 'Desarrolla habilidades de liderazgo en tu equipo',
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        totalContent: 6,
        completedContent: 0,
        requiredLevel: 5,
        contents: [
            { id: '28', title: 'Fundamentos del liderazgo', type: 'video' as const, duration: '25 min', completed: false },
            { id: '29', title: 'Comunicación efectiva', type: 'exercise' as const, completed: false },
            { id: '30', title: 'Motivar al equipo', type: 'article' as const, completed: false },
            { id: '31', title: 'Resolución de conflictos', type: 'exercise' as const, completed: false },
            { id: '32', title: 'Liderazgo situacional', type: 'video' as const, duration: '20 min', completed: false },
            { id: '33', title: 'Evaluación de liderazgo', type: 'quiz' as const, completed: false },
        ]
    }
];

const programInfo = {
    title: 'Programa de Psicología Deportiva Integral',
    description: 'Un programa completo diseñado para desarrollar la fortaleza mental en deportistas jóvenes',
    totalLevels: 6,
    estimatedDuration: '6-8 meses',
    difficulty: 'Intermedio',
};

export default function Niveles() {
    const completedLevels = allLevels.filter(level => level.isCompleted).length;
    const unlockedLevels = allLevels.filter(level => level.isUnlocked).length;
    const totalProgress = (allLevels.reduce((sum, level) => sum + level.progress, 0) / allLevels.length);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Niveles - MenteSport" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Target className="w-8 h-8 text-blue-600" />
                        Niveles de Entrenamiento
                    </h1>
                    <p className="text-muted-foreground">
                        Avanza a través del programa completo de psicología deportiva
                    </p>
                </div>

                {/* Program Overview */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                    <CardHeader>
                        <CardTitle className="text-xl">{programInfo.title}</CardTitle>
                        <CardDescription className="text-base">
                            {programInfo.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{completedLevels}</div>
                                <div className="text-sm text-muted-foreground">Niveles Completados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{unlockedLevels}</div>
                                <div className="text-sm text-muted-foreground">Niveles Desbloqueados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{Math.round(totalProgress)}%</div>
                                <div className="text-sm text-muted-foreground">Progreso Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{programInfo.estimatedDuration}</div>
                                <div className="text-sm text-muted-foreground">Duración Estimada</div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Progreso General del Programa</span>
                                <span className="text-sm text-muted-foreground">
                                    {completedLevels}/{programInfo.totalLevels} niveles
                                </span>
                            </div>
                            <Progress value={totalProgress} className="h-3" />
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Path */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Ruta de Aprendizaje</h2>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Completado
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Play className="w-3 h-3 text-blue-500" />
                                Disponible
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Lock className="w-3 h-3 text-gray-400" />
                                Bloqueado
                            </Badge>
                        </div>
                    </div>

                    {/* Levels Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allLevels.map((level, index) => (
                            <div key={level.id} className="relative">
                                {/* Connection Line */}
                                {index < allLevels.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-border z-0" />
                                )}
                                
                                <LevelCard level={level} className="relative z-10" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Consejos para el Aprendizaje
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                                    <Target className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Consistencia es Clave</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Practica regularmente, aunque sea por períodos cortos
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                                    <Trophy className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Aplica en la Práctica</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Usa las técnicas durante tus entrenamientos reales
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/20">
                                    <Video className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Revisa el Material</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Repasa los videos y artículos cuando lo necesites
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