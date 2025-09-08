import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, Play, CheckCircle, Star, Trophy, BookOpen, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelContent {
    id: string;
    title: string;
    type: 'video' | 'article' | 'exercise' | 'quiz';
    duration?: string;
    completed: boolean;
}

interface Level {
    id: number;
    title: string;
    description: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    progress: number; // 0-100
    totalContent: number;
    completedContent: number;
    requiredLevel?: number;
    contents: LevelContent[];
}

interface LevelCardProps {
    level: Level;
    className?: string;
}

const contentTypeIcons = {
    video: Video,
    article: BookOpen,
    exercise: Trophy,
    quiz: Star,
};

const contentTypeColors = {
    video: 'text-red-500',
    article: 'text-blue-500',
    exercise: 'text-green-500',
    quiz: 'text-purple-500',
};

export function LevelCard({ level, className }: LevelCardProps) {
    return (
        <Card 
            className={cn(
                'transition-all duration-200 hover:shadow-lg relative overflow-hidden',
                !level.isUnlocked && 'opacity-60',
                level.isCompleted && 'ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-900/10',
                className
            )}
        >
            {/* Level Number Badge */}
            <div className="absolute top-4 right-4">
                <Badge 
                    variant={level.isCompleted ? 'default' : level.isUnlocked ? 'secondary' : 'outline'}
                    className={cn(
                        'text-sm font-bold',
                        level.isCompleted && 'bg-green-500 hover:bg-green-600',
                        !level.isUnlocked && 'opacity-50'
                    )}
                >
                    Nivel {level.id}
                </Badge>
            </div>

            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className={cn(
                        'p-3 rounded-full flex-shrink-0 transition-colors',
                        level.isCompleted 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : level.isUnlocked 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                    )}>
                        {level.isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                        ) : level.isUnlocked ? (
                            <Play className="w-6 h-6" />
                        ) : (
                            <Lock className="w-6 h-6" />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1">{level.title}</CardTitle>
                        <CardDescription className="text-sm">
                            {level.description}
                        </CardDescription>
                        
                        {!level.isUnlocked && level.requiredLevel && (
                            <Badge variant="outline" className="mt-2 text-xs">
                                Requiere completar Nivel {level.requiredLevel}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Progress Section */}
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">
                            {level.completedContent}/{level.totalContent} completados
                        </span>
                    </div>
                    <Progress value={level.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                        {level.progress}% completado
                    </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Contenido:</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {level.contents.slice(0, 4).map((content) => {
                            const Icon = contentTypeIcons[content.type];
                            return (
                                <div 
                                    key={content.id}
                                    className={cn(
                                        'flex items-center gap-2 text-xs p-2 rounded-md border',
                                        content.completed 
                                            ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
                                            : 'bg-muted/50'
                                    )}
                                >
                                    <Icon className={cn('w-3 h-3', contentTypeColors[content.type])} />
                                    <span className="truncate">{content.title}</span>
                                    {content.completed && (
                                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {level.contents.length > 4 && (
                        <p className="text-xs text-muted-foreground">
                            +{level.contents.length - 4} elementos más
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <Button 
                    className="w-full" 
                    disabled={!level.isUnlocked}
                    variant={level.isCompleted ? 'outline' : 'default'}
                >
                    {level.isCompleted ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Revisar Contenido
                        </>
                    ) : level.isUnlocked ? (
                        level.progress > 0 ? (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Continuar
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Comenzar Nivel
                            </>
                        )
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Bloqueado
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}