import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: 'trophy' | 'star' | 'target' | 'zap' | 'medal' | 'award';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
}

interface GamificationCardProps {
    achievement: Achievement;
    className?: string;
}

const iconMap = {
    trophy: Trophy,
    star: Star,
    target: Target,
    zap: Zap,
    medal: Medal,
    award: Award,
};

const rarityColors = {
    common: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    rare: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    epic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    legendary: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
};

const rarityBorders = {
    common: 'border-gray-200 dark:border-gray-700',
    rare: 'border-blue-200 dark:border-blue-800',
    epic: 'border-purple-200 dark:border-purple-800',
    legendary: 'border-orange-200 dark:border-orange-800',
};

export function GamificationCard({ achievement, className }: GamificationCardProps) {
    const Icon = iconMap[achievement.icon];
    const isInProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined;
    
    return (
        <Card 
            className={cn(
                'transition-all duration-200 hover:shadow-md',
                rarityBorders[achievement.rarity],
                !achievement.unlocked && 'opacity-60 grayscale',
                className
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'p-2 rounded-full',
                            achievement.unlocked 
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                : 'bg-muted text-muted-foreground'
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base leading-tight">
                                {achievement.title}
                            </CardTitle>
                            <Badge 
                                variant="outline" 
                                className={cn('mt-1 text-xs', rarityColors[achievement.rarity])}
                            >
                                {achievement.rarity}
                            </Badge>
                        </div>
                    </div>
                    {achievement.unlocked && (
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">+{achievement.rarity === 'legendary' ? 500 : achievement.rarity === 'epic' ? 300 : achievement.rarity === 'rare' ? 150 : 50} XP</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                </p>
                
                {isInProgress && !achievement.unlocked && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100}
                            className="h-2"
                        />
                    </div>
                )}
                
                {achievement.unlocked && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                        <Trophy className="w-4 h-4" />
                        ¡Logro Desbloqueado!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}