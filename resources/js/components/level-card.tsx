import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, Play, CheckCircle, Star, Trophy, BookOpen, Video, Clock, Users } from 'lucide-react';
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

const contentTypeLabels = {
    video: 'Video',
    article: 'Artículo', 
    exercise: 'Ejercicio',
    quiz: 'Quiz',
};

const getEstimatedTime = (contents: LevelContent[]) => {
    const videoTime = contents.filter(c => c.type === 'video').length * 12; // avg 12 min per video
    const articleTime = contents.filter(c => c.type === 'article').length * 8; // avg 8 min per article
    const exerciseTime = contents.filter(c => c.type === 'exercise').length * 15; // avg 15 min per exercise
    const quizTime = contents.filter(c => c.type === 'quiz').length * 5; // avg 5 min per quiz
    return videoTime + articleTime + exerciseTime + quizTime;
};

export function LevelCard({ level, className }: LevelCardProps) {
    const estimatedTime = getEstimatedTime(level.contents);
    const contentSummary = level.contents.reduce((acc, content) => {
        acc[content.type] = (acc[content.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <Card 
            className={cn(
                'group transition-all duration-300 hover:shadow-xl relative overflow-hidden border-2',
                'hover:scale-[1.02] hover:-translate-y-1',
                level.isCompleted 
                    ? 'bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/30' 
                    : level.isUnlocked 
                        ? 'border-border hover:border-primary/40 bg-gradient-to-br from-background to-muted/20'
                        : 'opacity-60 border-muted bg-muted/20',
                className
            )}
        >
            {/* Completion Status Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            
            {/* Level Badge */}
            <div className="absolute top-4 right-4 z-10">
                <Badge 
                    variant="secondary"
                    className={cn(
                        'font-semibold text-xs px-2 py-1 shadow-sm',
                        level.isCompleted && 'bg-primary text-primary-foreground',
                        level.isUnlocked && !level.isCompleted && 'bg-background border border-primary/20',
                        !level.isUnlocked && 'bg-muted text-muted-foreground'
                    )}
                >
                    Nivel {level.id}
                </Badge>
            </div>

            <CardHeader className="pb-4 relative">
                {/* Status Icon */}
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300',
                    'shadow-sm group-hover:shadow-md',
                    level.isCompleted 
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/20'
                        : level.isUnlocked 
                            ? 'bg-gradient-to-br from-muted to-muted/60 text-muted-foreground hover:text-primary'
                            : 'bg-muted/50 text-muted-foreground'
                )}>
                    {level.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                    ) : level.isUnlocked ? (
                        <Play className="w-6 h-6" />
                    ) : (
                        <Lock className="w-6 h-6" />
                    )}
                </div>
                
                <div className="space-y-2">
                    <CardTitle className="text-xl font-bold leading-tight pr-16">
                        {level.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                        {level.description}
                    </CardDescription>
                </div>

                {/* Level Requirements */}
                {!level.isUnlocked && level.requiredLevel && (
                    <div className="mt-3">
                        <Badge variant="outline" className="text-xs bg-background/50">
                            <Lock className="w-3 h-3 mr-1" />
                            Requiere Nivel {level.requiredLevel}
                        </Badge>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Progress Section with better visual hierarchy */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Progreso del Nivel</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{level.progress}%</span>
                            <div className="text-xs text-muted-foreground">
                                ({level.completedContent}/{level.totalContent})
                            </div>
                        </div>
                    </div>
                    <Progress 
                        value={level.progress} 
                        className="h-2.5 bg-muted/60" 
                    />
                </div>

                {/* Content Type Summary */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Contenido</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>~{estimatedTime} min</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(contentSummary).map(([type, count]) => {
                            const Icon = contentTypeIcons[type as keyof typeof contentTypeIcons];
                            const label = contentTypeLabels[type as keyof typeof contentTypeLabels];
                            const completed = level.contents.filter(c => c.type === type && c.completed).length;
                            
                            return (
                                <div
                                    key={type}
                                    className={cn(
                                        'flex items-center justify-between p-3 rounded-lg border transition-colors',
                                        'hover:bg-muted/40',
                                        completed === count ? 'bg-primary/10 border-primary/20' : 'bg-background/60'
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs font-medium">{label}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-semibold">
                                            {completed}/{count}
                                        </span>
                                        {completed === count && (
                                            <CheckCircle className="w-3 h-3 text-primary" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Button with better states */}
                <Button 
                    className={cn(
                        "w-full h-11 font-semibold transition-all duration-200",
                        "shadow-sm hover:shadow-md",
                        level.isCompleted && "bg-muted hover:bg-muted/80 text-muted-foreground border",
                        !level.isUnlocked && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!level.isUnlocked}
                    variant={level.isCompleted ? "outline" : "default"}
                >
                    {level.isCompleted ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Repasar Contenido
                        </>
                    ) : level.isUnlocked ? (
                        level.progress > 0 ? (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Continuar Aprendizaje
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
                            Nivel Bloqueado
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}