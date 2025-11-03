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
import { Book, BookMarked, BookOpen, Calendar, CreditCard, Folder, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

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
        title: 'Mis Pagos',
        href: '/payments',
        icon: CreditCard,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
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
        title: 'Citas',
        href: '/appointments',
        icon: Calendar,
    },
    {
        title: 'Pagos',
        href: '/admin/payments',
        icon: CreditCard,
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

    const isStudent = user?.roles.includes('student');
    const isPsychologist = user?.roles.includes('psychologist');

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
