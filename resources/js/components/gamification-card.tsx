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
    common: 'text-muted-foreground',
    rare: 'text-primary',
    epic: 'text-foreground',
    legendary: 'text-primary',
};

const rarityBorders = {
    common: 'border-border',
    rare: 'border-border',
    epic: 'border-border',
    legendary: 'border-border',
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
                                ? 'bg-primary text-primary-foreground'
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
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
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
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Trophy className="w-4 h-4" />
                        ¡Logro Desbloqueado!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}