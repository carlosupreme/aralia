import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard, manual, soporte } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Book, BookMarked, BookOpen, Calendar, CreditCard, Folder, LayoutGrid, Star, Trophy, Users } from 'lucide-react';
import AppLogo from './app-logo';

// Navegación Principal - Área del Estudiante/Deportista
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Mis Programas',
        href: '/programs',
        icon: Book,
    },

    {
        title: 'Mis Citas',
        href: '/appointments',
        icon: Calendar,
    },
    {
        title: 'Pagos',
        href: '/payments',
        icon: CreditCard,
    },
];

// Navegación Administrativa (Solo visible para psicólogos)
const adminNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/admin/usuarios',
        icon: Users,
    },

    {
        title: 'Programas',
        href: '/programs',
        icon: BookMarked,
    },
    {
        title: 'Pagos',
        href: '/admin/payments',
        icon: CreditCard,
    },

    {
        title: 'Citas',
        href: '/appointments',
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
    const { open } = useSidebar();

    // Verificar roles
    const isStudent = user?.roles.includes('student');
    const isPsychologist = user?.roles.includes('psychologist');

    // Datos de gamificación
    const currentLevel = user?.gamification?.current_level ?? 1;
    const totalAchievements = user?.gamification?.total_achievements ?? 0;
    const progressToNextLevel = user?.gamification?.progress_to_next_level ?? 0;

    return (
        <Sidebar collapsible="icon" variant="floating">
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
                    <div className="mx-3 mt-2 rounded-lg bg-muted/50 px-4 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                <span className="text-sm font-medium">Nivel {currentLevel}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">{totalAchievements}</span>
                            </div>
                        </div>
                        <div className="mb-1 h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-2 rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${progressToNextLevel}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">{progressToNextLevel}% al siguiente nivel</p>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                {open && (
                    <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Panel</h3>
                    </div>
                )}
                {isStudent && <NavMain items={mainNavItems} />}
                {isPsychologist && <NavMain items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
