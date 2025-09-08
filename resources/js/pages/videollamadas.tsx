import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard, videollamadas } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Video, 
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Phone,
    User,
    MessageCircle,
    Plus,
    History
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Videollamadas',
        href: videollamadas().url,
    },
];

// Mock data para videollamadas
const upcomingCalls = [
    {
        id: 1,
        date: '2025-01-15',
        time: '16:00',
        duration: 45,
        psychologist: 'Dra. María González',
        type: 'Seguimiento Mensual',
        status: 'programada',
        notes: 'Revisión de progreso en control de ansiedad pre-competencia',
    },
    {
        id: 2,
        date: '2025-02-15',
        time: '16:00',
        duration: 45,
        psychologist: 'Dra. María González',
        type: 'Seguimiento Mensual',
        status: 'programada',
        notes: 'Evaluación de técnicas de concentración',
    }
];

const pastCalls = [
    {
        id: 3,
        date: '2024-12-15',
        time: '16:00',
        duration: 45,
        psychologist: 'Dra. María González',
        type: 'Seguimiento Mensual',
        status: 'completada',
        notes: 'Excelente progreso en técnicas de relajación. Continuar con ejercicios diarios.',
        rating: 5,
        summary: 'Se revisaron los avances en el manejo de ansiedad. Alex mostró gran mejora en sus técnicas de respiración.'
    },
    {
        id: 4,
        date: '2024-11-15',
        time: '16:00',
        duration: 45,
        psychologist: 'Dra. María González',
        type: 'Seguimiento Mensual',
        status: 'completada',
        notes: 'Primera sesión. Establecimiento de metas y evaluación inicial.',
        rating: 5,
        summary: 'Sesión introductoria exitosa. Se establecieron objetivos claros para el programa.'
    },
    {
        id: 5,
        date: '2024-10-20',
        time: '15:30',
        duration: 30,
        psychologist: 'Dra. María González',
        type: 'Consulta Inicial',
        status: 'completada',
        notes: 'Evaluación inicial y explicación del programa.',
        rating: 5,
        summary: 'Bienvenida al programa. Alex mostró gran motivación y comprensión de los objetivos.'
    }
];

const psychologist = {
    name: 'Dra. María González',
    specialty: 'Psicología Deportiva',
    experience: '8 años',
    credentials: 'Ph.D. en Psicología del Deporte',
    languages: ['Español', 'Inglés'],
    rating: 4.9,
    bio: 'Especialista en psicología deportiva con amplia experiencia trabajando con atletas jóvenes. Se enfoca en el desarrollo de la fortaleza mental y técnicas de manejo de presión.'
};

export default function Videollamadas() {
    const nextCall = upcomingCalls[0];
    const totalCalls = pastCalls.length;
    const averageRating = pastCalls.reduce((sum, call) => sum + (call.rating || 0), 0) / pastCalls.filter(call => call.rating).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Videollamadas - MenteSport" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Video className="w-8 h-8" />
                        Videollamadas con tu Psicólogo
                    </h1>
                    <p className="text-muted-foreground">
                        Programa y gestiona tus sesiones mensuales de seguimiento
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Próxima Cita</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15 Ene</div>
                            <p className="text-xs text-muted-foreground">4:00 PM</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCalls}</div>
                            <p className="text-xs text-muted-foreground">Completadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valoración Promedio</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">⭐ de 5.0</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Mensual</div>
                            <p className="text-xs text-muted-foreground">45 min por sesión</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Upcoming and Past Calls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Next Call */}
                        {nextCall && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            Próxima Videollamada
                                        </CardTitle>
                                        <Badge variant="outline">
                                            En {Math.ceil((new Date(nextCall.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(nextCall.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4" />
                                                <span>{nextCall.time} - {nextCall.duration} minutos</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4" />
                                                <span>{nextCall.psychologist}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">Tipo de Sesión:</div>
                                            <Badge variant="outline">{nextCall.type}</Badge>
                                            <div className="text-sm text-muted-foreground">
                                                {nextCall.notes}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1">
                                            <Video className="w-4 h-4 mr-2" />
                                            Unirse a la Llamada
                                        </Button>
                                        <Button variant="outline">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Mensaje
                                        </Button>
                                        <Button variant="outline">
                                            Reprogramar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Past Calls */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="w-5 h-5" />
                                        Historial de Sesiones
                                    </CardTitle>
                                    <Button variant="outline" size="sm">
                                        Ver Todo
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pastCalls.map((call) => (
                                    <div key={call.id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="font-medium">{call.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {call.rating && (
                                                    <div className="flex items-center gap-1">
                                                        {'⭐'.repeat(call.rating)}
                                                    </div>
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    {new Date(call.date).toLocaleDateString()}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <strong>Notas:</strong> {call.notes}
                                        </div>
                                        {call.summary && (
                                            <div className="text-sm">
                                                <strong>Resumen:</strong> {call.summary}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Psychologist Info & Quick Actions */}
                    <div className="space-y-6">
                        {/* Psychologist Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Tu Psicólogo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-bold">
                                        MG
                                    </div>
                                    <div>
                                        <div className="font-medium">{psychologist.name}</div>
                                        <div className="text-sm text-muted-foreground">{psychologist.specialty}</div>
                                        <div className="flex items-center gap-1 text-sm">
                                            ⭐ {psychologist.rating} ({psychologist.experience})
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                    <div><strong>Credenciales:</strong> {psychologist.credentials}</div>
                                    <div><strong>Idiomas:</strong> {psychologist.languages.join(', ')}</div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                    {psychologist.bio}
                                </p>
                                
                                <Button variant="outline" className="w-full">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Enviar Mensaje
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Acciones Rápidas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full justify-start" disabled>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Programar Cita Extra
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        Premium
                                    </Badge>
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat de Emergencia
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Video className="w-4 h-4 mr-2" />
                                    Test de Conexión
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Tips for Video Calls */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Consejos para Videollamadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-xs space-y-2 text-muted-foreground">
                                    <li>• Busca un lugar tranquilo y con buena iluminación</li>
                                    <li>• Prueba tu micrófono y cámara antes de la sesión</li>
                                    <li>• Ten preparadas tus preguntas o temas a discutir</li>
                                    <li>• Mantén una libreta para tomar notas importantes</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}