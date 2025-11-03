import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, List, Clock, MapPin, Video, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
    const [view, setView] = useState<"calendar" | "list">("list");

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
                return <Badge variant="default">Programada</Badge>;
            case "pending_reschedule":
                return <Badge variant="secondary">Pendiente Reprogramación</Badge>;
            case "rescheduled":
                return <Badge variant="outline">Reprogramada</Badge>;
            case "completed":
                return <Badge className="bg-green-500 hover:bg-green-600">Completada</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleComplete = (appointmentId: number) => {
        router.post(route("appointments.complete", appointmentId), {}, {
            preserveScroll: true,
        });
    };

    const handleCancel = (appointmentId: number) => {
        if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
            router.delete(route("appointments.destroy", appointmentId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Citas" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Agenda de Citas</h1>
                        <p className="text-muted-foreground">
                            Gestiona tus citas y reprogramaciones
                        </p>
                    </div>
                    {pendingReschedules > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {pendingReschedules} Reprogramaciones Pendientes
                        </Badge>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <div className="flex-1">
                            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar programa" />
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
                        <div className="flex-1">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
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
                    </CardContent>
                </Card>

                {/* View Toggle */}
                <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
                    <TabsList>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            Lista
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Calendario
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        {filteredAppointments.length === 0 ? (
                            <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                    <p className="text-muted-foreground">
                                        No se encontraron citas con los filtros seleccionados.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredAppointments.map((appointment) => (
                                <Card key={appointment.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {appointment.program.name}
                                                    {getStatusBadge(appointment.status)}
                                                </CardTitle>
                                                <CardDescription>
                                                    {isPsychologist
                                                        ? `Estudiante: ${appointment.student?.name}`
                                                        : `Psicólogo: ${appointment.psychologist?.name}`}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                {appointment.status === "scheduled" && isPsychologist && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleComplete(appointment.id)}
                                                    >
                                                        Completar
                                                    </Button>
                                                )}
                                                {appointment.status !== "completed" &&
                                                    appointment.status !== "cancelled" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCancel(appointment.id)}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {format(new Date(appointment.scheduled_date), "EEEE, d 'de' MMMM 'de' yyyy", {
                                                    locale: es,
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {appointment.scheduled_time} ({appointment.duration_minutes} min)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {appointment.meeting_type === "online" ? (
                                                <Video className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>
                                                {appointment.meeting_type === "online"
                                                    ? "En línea"
                                                    : "Presencial"}
                                            </span>
                                        </div>
                                        {appointment.meeting_link && (
                                            <div className="mt-2">
                                                <a
                                                    href={appointment.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Unirse a la reunión
                                                </a>
                                            </div>
                                        )}
                                        {appointment.notes && (
                                            <div className="mt-2 rounded-md bg-muted p-3">
                                                <p className="text-sm">{appointment.notes}</p>
                                            </div>
                                        )}
                                        {appointment.proposals.length > 0 && (
                                            <div className="mt-4 border-t pt-4">
                                                <p className="text-sm font-medium mb-2">
                                                    Propuestas de Reprogramación ({appointment.proposals.length})
                                                </p>
                                                <div className="space-y-2">
                                                    {appointment.proposals.map((proposal) => (
                                                        <div
                                                            key={proposal.id}
                                                            className="rounded-md border p-3 text-sm"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium">
                                                                    {proposal.proposed_by.name}
                                                                </span>
                                                                {getStatusBadge(proposal.status)}
                                                            </div>
                                                            {proposal.message && (
                                                                <p className="text-muted-foreground mb-2">
                                                                    {proposal.message}
                                                                </p>
                                                            )}
                                                            <div className="space-y-1">
                                                                {proposal.proposed_dates.map((date, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <CalendarIcon className="h-3 w-3" />
                                                                        <span>
                                                                            {format(
                                                                                new Date(date.date),
                                                                                "d 'de' MMMM",
                                                                                { locale: es }
                                                                            )}{" "}
                                                                            - {date.time}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="calendar">
                        <Card>
                            <CardContent className="flex items-center justify-center py-12">
                                <p className="text-muted-foreground">
                                    Vista de calendario próximamente...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
