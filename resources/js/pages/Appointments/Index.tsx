import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, List, Clock, MapPin, Video, AlertCircle, RefreshCw, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import WeeklyCalendar from "@/components/appointments/WeeklyCalendar";
import AppointmentDetailsModal from "@/components/appointments/AppointmentDetailsModal";
import RescheduleDrawer from "@/components/appointments/RescheduleDrawer";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Program {
    id: number;
    name: string;
    students?: User[];
}

interface AppointmentProposal {
    id: number;
    appointment_id: number;
    user_id: number;
    proposed_dates: Array<{ date: string; time: string }>;
    message: string | null;
    status: "pending" | "accepted" | "rejected";
    accepted_date_index: number | null;
    created_at: string;
    proposed_by: User;
}

interface Appointment {
    id: number;
    program_id: number;
    psychologist_id: number;
    student_id: number;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    meeting_type: "online" | "in-person";
    meeting_link: string | null;
    notes: string | null;
    status: "scheduled" | "pending_reschedule" | "rescheduled" | "completed" | "cancelled";
    is_recurring: boolean;
    recurrence_pattern: string | null;
    recurrence_count: number | null;
    created_at: string;
    program: Program;
    psychologist?: User;
    student?: User;
    proposals: AppointmentProposal[];
}

interface PageProps {
    appointments: Appointment[];
    programs: Program[];
    pendingReschedules: number;
}

export default function Index() {
    const { appointments, programs, pendingReschedules } = usePage<PageProps>().props;
    const { auth } = usePage().props as any;
    const isPsychologist = auth.user.roles?.some((role: any) => role.name === "psychologist");

    const [selectedProgram, setSelectedProgram] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [view, setView] = useState<"calendar" | "list">("calendar");
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRescheduleDrawerOpen, setIsRescheduleDrawerOpen] = useState(false);

    // Filter appointments
    const filteredAppointments = appointments.filter((appointment) => {
        if (selectedProgram !== "all" && appointment.program_id !== parseInt(selectedProgram)) {
            return false;
        }
        if (selectedStatus !== "all" && appointment.status !== selectedStatus) {
            return false;
        }
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "scheduled":
                return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Programada</Badge>;
            case "pending_reschedule":
                return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">Pendiente</Badge>;
            case "rescheduled":
                return <Badge variant="outline" className="border-purple-500 text-purple-700">Reprogramada</Badge>;
            case "completed":
                return <Badge className="bg-green-500 hover:bg-green-600">Completada</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailsModalOpen(true);
    };

    const handleRescheduleClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsRescheduleDrawerOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Citas" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Agenda de Citas</h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona tus citas y reprogramaciones de manera eficiente
                        </p>
                    </div>
                    {pendingReschedules > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white">
                            <AlertCircle className="h-4 w-4" />
                            {pendingReschedules} Reprogramación{pendingReschedules > 1 ? 'es' : ''} Pendiente{pendingReschedules > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por programa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los programas</SelectItem>
                                        {programs.map((program) => (
                                            <SelectItem key={program.id} value={program.id.toString()}>
                                                {program.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrar por estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="scheduled">Programada</SelectItem>
                                        <SelectItem value="pending_reschedule">Pendiente Reprogramación</SelectItem>
                                        <SelectItem value="rescheduled">Reprogramada</SelectItem>
                                        <SelectItem value="completed">Completada</SelectItem>
                                        <SelectItem value="cancelled">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* View Toggle */}
                <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")} className="space-y-4">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Calendario
                        </TabsTrigger>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            Lista
                        </TabsTrigger>
                    </TabsList>

                    {/* Calendar View */}
                    <TabsContent value="calendar" className="mt-6">
                        <Card className="min-h-[600px]">
                            <CardContent className="p-6">
                                <WeeklyCalendar
                                    appointments={filteredAppointments}
                                    onAppointmentClick={handleAppointmentClick}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* List View */}
                    <TabsContent value="list" className="space-y-4 mt-6">
                        {filteredAppointments.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No hay citas</h3>
                                    <p className="text-muted-foreground text-center max-w-md">
                                        No se encontraron citas con los filtros seleccionados.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {filteredAppointments.map((appointment) => (
                                    <Card
                                        key={appointment.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleAppointmentClick(appointment)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <CardTitle className="text-xl">
                                                            {appointment.program.name}
                                                        </CardTitle>
                                                        {getStatusBadge(appointment.status)}
                                                    </div>
                                                    <CardDescription className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        {isPsychologist
                                                            ? appointment.student?.name
                                                            : appointment.psychologist?.name}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Date and Time Row */}
                                            <div className="flex flex-wrap gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg">
                                                        <CalendarIcon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Fecha</p>
                                                        <p className="font-medium">
                                                            {format(new Date(appointment.scheduled_date), "d 'de' MMMM", {
                                                                locale: es,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg">
                                                        <Clock className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Hora</p>
                                                        <p className="font-medium">
                                                            {appointment.scheduled_time.substring(0, 5)} ({appointment.duration_minutes} min)
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg">
                                                        {appointment.meeting_type === "online" ? (
                                                            <Video className="h-5 w-5 text-primary" />
                                                        ) : (
                                                            <MapPin className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Modalidad</p>
                                                        <p className="font-medium">
                                                            {appointment.meeting_type === "online" ? "En línea" : "Presencial"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {appointment.status !== "completed" &&
                                             appointment.status !== "cancelled" && (
                                                <div className="pt-3 border-t">
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRescheduleClick(appointment);
                                                        }}
                                                        className="gap-2"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                        Reprogramar
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Details Modal */}
            <AppointmentDetailsModal
                appointment={selectedAppointment}
                open={isDetailsModalOpen}
                onOpenChange={setIsDetailsModalOpen}
                isPsychologist={isPsychologist}
            />

            {/* Reschedule Drawer */}
            {selectedAppointment && (
                <RescheduleDrawer
                    open={isRescheduleDrawerOpen}
                    onOpenChange={setIsRescheduleDrawerOpen}
                    appointment={selectedAppointment}
                />
            )}
        </AppLayout>
    );
}
