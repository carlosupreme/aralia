import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard, progreso, niveles, multimedia, videollamadas, logros, suscripcion, manual, soporte } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid, 
    Users, 
    UserCheck,
    GraduationCap,
    Trophy,
    CreditCard,
    BookMarked,
    TrendingUp,
    Play,
    Video,
    MessageCircle,
    Target,
    Calendar,
    Star
} from 'lucide-react';
import AppLogo from './app-logo';

// Navegación Principal - Área del Estudiante/Deportista
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Mi Progreso',
        href: progreso(),
        icon: TrendingUp,
    },
    {
        title: 'Niveles',
        href: niveles(),
        icon: Target,
    },
    {
        title: 'Contenido Multimedia',
        href: multimedia(),
        icon: Play,
    },
    {
        title: 'Videollamadas',
        href: videollamadas(),
        icon: Video,
    },
    {
        title: 'Logros',
        href: logros(),
        icon: Trophy,
    },
    {
        title: 'Suscripción',
        href: suscripcion(),
        icon: CreditCard,
    },
];

// Navegación Administrativa (Solo visible para psicólogos)
const adminNavItems: NavItem[] = [
    {
        title: 'Gestión de Usuarios',
        href: '/admin/usuarios',
        icon: Users,
    },
    {
        title: 'Estudiantes',
        href: '/admin/estudiantes',
        icon: GraduationCap,
    },
    {
        title: 'Padres de Familia',
        href: '/admin/padres',
        icon: UserCheck,
    },
    {
        title: 'Programas y Planes',
        href: '/admin/programas',
        icon: BookMarked,
    },
    {
        title: 'Pagos y Suscripciones',
        href: '/admin/pagos',
        icon: CreditCard,
    },
    {
        title: 'Foros y Chats',
        href: '/admin/comunicacion',
        icon: MessageCircle,
    },
    {
        title: 'Citas Programadas',
        href: '/admin/citas',
        icon: Calendar,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Manual de Usuario',
        href: manual(),
        icon: BookOpen,
    },
    {
        title: 'Soporte Técnico',
        href: soporte(),
        icon: Folder,
    },
];

export function AppSidebar() {
    // Mock user role - en una app real esto vendría del auth context
    const userRole = 'student'; // 'student', 'parent', 'psychologist'
    const currentLevel = 3; // Nivel actual del estudiante (gamificación)
    const totalAchievements = 12; // Logros desbloqueados
    const progressToNextLevel = 65; // Porcentaje de progreso al siguiente nivel

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Gamification Status - Solo para estudiantes */}
                {userRole === 'student' && (
                    <div className="px-4 py-3 bg-muted/50 rounded-lg mx-3 mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-medium">Nivel {currentLevel}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                <span className="text-xs text-muted-foreground">{totalAchievements}</span>
                            </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                            <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressToNextLevel}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {progressToNextLevel}% al siguiente nivel
                        </p>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                {/* Navegación para Estudiantes/Padres */}
                {(userRole === 'student' || userRole === 'parent') && (
                    <>
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Mi Área de Entrenamiento
                            </h3>
                        </div>
                        <NavMain items={mainNavItems} />
                    </>
                )}

                {/* Navegación para Psicólogos */}
                {userRole === 'psychologist' && (
                    <>
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Panel de Estudiantes
                            </h3>
                        </div>
                        <NavMain items={mainNavItems} />
                        
                        <div className="px-4 py-2 mt-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Administración
                            </h3>
                        </div>
                        <NavMain items={adminNavItems} />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
