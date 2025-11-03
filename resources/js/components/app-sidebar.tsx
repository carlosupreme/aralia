import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard, progreso, niveles, multimedia, videollamadas, logros, suscripcion, manual, soporte } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
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
        title: 'Pagos',
        href: '/payments',
        icon: CreditCard,
    },
    {
        title: 'Suscripción',
        href: suscripcion(),
        icon: Star,
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
        title: 'Deportistas Ganadores',
        href: '/admin/deportistas',
        icon: GraduationCap,
    },
    {
        title: 'Familias Ganadoras',
        href: '/admin/padres',
        icon: UserCheck,
    },
    {
        title: 'Programas y Planes',
        href: '/programs',
        icon: BookMarked,
    },
    {
        title: 'Pagos y Suscripciones',
        href: '/admin/payments',
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
    // Obtener datos del usuario desde Inertia
    const { auth } = usePage<{
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                roles: string[];
                permissions: string[];
                gamification?: {
                    current_level: number;
                    total_achievements: number;
                    progress_to_next_level: number;
                };
            } | null;
        };
    }>().props;

    const user = auth.user;

    // Verificar roles
    const isStudent = user?.roles.includes('student');
    const isPsychologist = user?.roles.includes('psychologist');

    // Datos de gamificación
    const currentLevel = user?.gamification?.current_level ?? 1;
    const totalAchievements = user?.gamification?.total_achievements ?? 0;
    const progressToNextLevel = user?.gamification?.progress_to_next_level ?? 0;

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
                {isStudent && user?.gamification && (
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
                {/* Navegación para Estudiantes - Panel de Estudiantes */}
                {isStudent && (
                    <>
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Panel de Estudiantes
                            </h3>
                        </div>
                        <NavMain items={mainNavItems} />
                    </>
                )}

                {/* Navegación para Psicólogos - Administración */}
                {isPsychologist && (
                    <>
                        <div className="px-4 py-2">
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
