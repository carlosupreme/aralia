import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { dashboard, multimedia } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Play, 
    BookOpen,
    FileText,
    Trophy,
    Clock,
    CheckCircle,
    Download,
    Bookmark,
    Filter,
    Search,
    Star,
    Target,
    Headphones
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Contenido Multimedia',
        href: multimedia().url,
    },
];

// Mock data para contenido multimedia
const multimediaContent = [
    // Videos
    {
        id: 1,
        title: 'Introducción a la Confianza Deportiva',
        type: 'video',
        level: 1,
        duration: '15:30',
        description: 'Aprende los fundamentos de la confianza en el deporte y cómo desarrollarla',
        thumbnail: '/thumbnails/confidence-intro.jpg',
        completed: true,
        rating: 4.8,
        category: 'fundamentos',
        difficulty: 'principiante',
        tags: ['confianza', 'autoestima', 'fundamentos']
    },
    {
        id: 2,
        title: 'Técnicas de Respiración Consciente',
        type: 'video',
        level: 2,
        duration: '12:45',
        description: 'Domina las técnicas de respiración para controlar la ansiedad',
        thumbnail: '/thumbnails/breathing.jpg',
        completed: true,
        rating: 4.9,
        category: 'ansiedad',
        difficulty: 'principiante',
        tags: ['respiración', 'ansiedad', 'relajación']
    },
    {
        id: 3,
        title: 'Visualización para el Alto Rendimiento',
        type: 'video',
        level: 2,
        duration: '18:20',
        description: 'Aprende técnicas avanzadas de visualización mental',
        thumbnail: '/thumbnails/visualization.jpg',
        completed: true,
        rating: 4.7,
        category: 'ansiedad',
        difficulty: 'intermedio',
        tags: ['visualización', 'rendimiento', 'mental']
    },
    {
        id: 4,
        title: 'Fundamentos del Enfoque Mental',
        type: 'video',
        level: 3,
        duration: '20:15',
        description: 'Desarrolla tu capacidad de concentración y enfoque',
        thumbnail: '/thumbnails/focus.jpg',
        completed: false,
        rating: 4.6,
        category: 'concentracion',
        difficulty: 'intermedio',
        tags: ['concentración', 'enfoque', 'atención']
    },

    // Artículos
    {
        id: 5,
        title: 'La Psicología del Deportista Ganador',
        type: 'article',
        level: 1,
        duration: '8 min lectura',
        description: 'Un análisis profundo de la mentalidad de los campeones',
        completed: true,
        rating: 4.5,
        category: 'fundamentos',
        difficulty: 'principiante',
        tags: ['mentalidad', 'ganador', 'psicología']
    },
    {
        id: 6,
        title: 'Estrategias Pre-Competencia',
        type: 'article',
        level: 2,
        duration: '12 min lectura',
        description: 'Rutinas y estrategias para prepararte antes de competir',
        completed: false,
        rating: 4.4,
        category: 'ansiedad',
        difficulty: 'intermedio',
        tags: ['competencia', 'preparación', 'rutinas']
    },

    // Ejercicios
    {
        id: 7,
        title: 'Ejercicios de Autoestima Deportiva',
        type: 'exercise',
        level: 1,
        duration: '20 min',
        description: 'Actividades prácticas para fortalecer tu autoestima',
        completed: true,
        rating: 4.3,
        category: 'fundamentos',
        difficulty: 'principiante',
        tags: ['autoestima', 'ejercicios', 'práctica']
    },
    {
        id: 8,
        title: 'Práctica de Concentración Avanzada',
        type: 'exercise',
        level: 3,
        duration: '25 min',
        description: 'Ejercicios desafiantes para mejorar tu concentración',
        completed: false,
        rating: 4.7,
        category: 'concentracion',
        difficulty: 'avanzado',
        tags: ['concentración', 'práctica', 'avanzado']
    },

    // Podcasts/Audio
    {
        id: 9,
        title: 'Historias de Éxito: Atletas Olímpicos',
        type: 'audio',
        level: 2,
        duration: '35:45',
        description: 'Testimonios reales de atletas que superaron sus miedos',
        completed: false,
        rating: 4.9,
        category: 'motivacion',
        difficulty: 'intermedio',
        tags: ['testimonios', 'éxito', 'motivación']
    },

    // Quiz
    {
        id: 10,
        title: 'Evaluación: Control de Ansiedad',
        type: 'quiz',
        level: 2,
        duration: '10 min',
        description: 'Evalúa tu progreso en el manejo de la ansiedad',
        completed: false,
        rating: 4.2,
        category: 'ansiedad',
        difficulty: 'intermedio',
        tags: ['evaluación', 'ansiedad', 'progreso']
    }
];

const categories = [
    { id: 'todos', name: 'Todos', count: multimediaContent.length },
    { id: 'videos', name: 'Videos', count: multimediaContent.filter(c => c.type === 'video').length },
    { id: 'articulos', name: 'Artículos', count: multimediaContent.filter(c => c.type === 'article').length },
    { id: 'ejercicios', name: 'Ejercicios', count: multimediaContent.filter(c => c.type === 'exercise').length },
    { id: 'completados', name: 'Completados', count: multimediaContent.filter(c => c.completed).length },
];

const contentTypeIcons = {
    video: Play,
    article: BookOpen,
    exercise: Trophy,
    quiz: Target,
    audio: Headphones,
};

const contentTypeColors = {
    video: 'text-red-500 bg-red-100 dark:bg-red-900/20',
    article: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
    exercise: 'text-green-500 bg-green-100 dark:bg-green-900/20',
    quiz: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
    audio: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
};

const difficultyColors = {
    principiante: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    intermedio: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    avanzado: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export default function Multimedia() {
    const completedContent = multimediaContent.filter(c => c.completed).length;
    const totalProgress = (completedContent / multimediaContent.length) * 100;
    const totalWatchTime = multimediaContent
        .filter(c => c.completed)
        .reduce((total, c) => {
            const minutes = parseInt(c.duration.split(':')[0]) || parseInt(c.duration.split(' ')[0]) || 0;
            return total + minutes;
        }, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contenido Multimedia - MenteSport" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Play className="w-8 h-8 text-red-600" />
                        Contenido Multimedia
                    </h1>
                    <p className="text-muted-foreground">
                        Accede a videos, artículos, ejercicios y más recursos para tu desarrollo
                    </p>
                </div>

                {/* Progress Overview */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10">
                    <CardHeader>
                        <CardTitle className="text-xl">Tu Progreso de Contenido</CardTitle>
                        <CardDescription>
                            Has completado {completedContent} de {multimediaContent.length} recursos disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{completedContent}</div>
                                <div className="text-sm text-muted-foreground">Contenidos Completados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalWatchTime}h</div>
                                <div className="text-sm text-muted-foreground">Tiempo de Estudio</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{Math.round(totalProgress)}%</div>
                                <div className="text-sm text-muted-foreground">Progreso Total</div>
                            </div>
                        </div>
                        
                        <Progress value={totalProgress} className="h-3" />
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
                    
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar contenido..."
                                className="pl-8 w-[200px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {/* Continue Learning */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Continúa Aprendiendo
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {multimediaContent
                                .filter(content => !content.completed)
                                .slice(0, 3)
                                .map((content) => {
                                    const Icon = contentTypeIcons[content.type];
                                    return (
                                        <Card key={content.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className={`p-2 rounded-full ${contentTypeColors[content.type]}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            Nivel {content.level}
                                                        </Badge>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`text-xs ${difficultyColors[content.difficulty]}`}
                                                        >
                                                            {content.difficulty}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardTitle className="text-base line-clamp-2">
                                                    {content.title}
                                                </CardTitle>
                                                <CardDescription className="text-sm line-clamp-2">
                                                    {content.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{content.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                        <span>{content.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 flex-wrap">
                                                    {content.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Button className="w-full" size="sm">
                                                    <Icon className="w-4 h-4 mr-2" />
                                                    {content.type === 'video' ? 'Ver Video' :
                                                     content.type === 'article' ? 'Leer Artículo' :
                                                     content.type === 'exercise' ? 'Hacer Ejercicio' :
                                                     content.type === 'quiz' ? 'Tomar Quiz' : 'Escuchar'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Completed Content */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Contenido Completado
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {multimediaContent
                                .filter(content => content.completed)
                                .map((content) => {
                                    const Icon = contentTypeIcons[content.type];
                                    return (
                                        <Card key={content.id} className="hover:shadow-md transition-shadow relative">
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                            <CardHeader className="pb-3">
                                                <div className={`p-2 rounded-full ${contentTypeColors[content.type]} w-fit`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <CardTitle className="text-sm line-clamp-2">
                                                    {content.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span>{content.duration}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                        <span>{content.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                                                        Repasar
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Bookmark className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                {/* Learning Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Tips de Aprendizaje
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                                    <Play className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Toma Notas</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Anota los puntos clave mientras ves los videos
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                                    <Trophy className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Practica Regularmente</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Dedica tiempo diario a los ejercicios prácticos
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/20">
                                    <Bookmark className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Repasa Contenido</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Vuelve a revisar el material después de aplicarlo
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