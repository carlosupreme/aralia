import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Calendar as CalendarIcon,
    Clock,
    Video,
    MapPin,
    User,
    FileText,
    CheckCircle,
    XCircle,
    RefreshCw,
    ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import RescheduleDrawer from "./RescheduleDrawer";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Program {
    id: number;
    name: string;
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

interface AppointmentDetailsModalProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isPsychologist: boolean;
}

export default function AppointmentDetailsModal({
    appointment,
    open,
    onOpenChange,
    isPsychologist,
}: AppointmentDetailsModalProps) {
    const [isRescheduleDrawerOpen, setIsRescheduleDrawerOpen] = useState(false);

    if (!appointment) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "scheduled":
                return (
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                        Programada
                    </Badge>
                );
            case "pending_reschedule":
                return (
                    <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">
                        Pendiente Reprogramación
                    </Badge>
                );
            case "rescheduled":
                return (
                    <Badge variant="outline" className="border-purple-500 text-purple-700">
                        Reprogramada
                    </Badge>
                );
            case "completed":
                return (
                    <Badge className="bg-green-500 hover:bg-green-600">
                        Completada
                    </Badge>
                );
            case "cancelled":
                return <Badge variant="destructive">Cancelada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleComplete = () => {
        router.post(
            route("appointments.complete", appointment.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
            }
        );
    };

    const handleCancel = () => {
        if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
            router.delete(route("appointments.destroy", appointment.id), {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const handleReschedule = () => {
        setIsRescheduleDrawerOpen(true);
        onOpenChange(false);
    };

    const canComplete = appointment.status === "scheduled" && isPsychologist;
    const canReschedule =
        appointment.status !== "completed" && appointment.status !== "cancelled";
    const canCancel =
        appointment.status !== "completed" && appointment.status !== "cancelled";

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="px-4 pt-4 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <DialogTitle className="text-2xl">
                                    {appointment.program.name}
                                </DialogTitle>
                                <DialogDescription className="mt-2">
                                    Detalles de la cita
                                </DialogDescription>
                            </div>
                            {getStatusBadge(appointment.status)}
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Primary Action - Reschedule */}
                        {canReschedule && (
                            <Card className="border-2 border-primary bg-primary/5">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">
                                                ¿Necesitas cambiar la fecha?
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Propone nuevas fechas y horarios de manera fácil
                                            </p>
                                        </div>
                                        <Button
                                            size="lg"
                                            onClick={handleReschedule}
                                            className="gap-2"
                                        >
                                            <RefreshCw className="h-5 w-5" />
                                            Reprogramar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Date & Time Details */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <CalendarIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Fecha y Hora
                                        </p>
                                        <p className="font-semibold text-lg">
                                            {format(
                                                new Date(appointment.scheduled_date),
                                                "EEEE, d 'de' MMMM 'de' yyyy",
                                                { locale: es }
                                            )}
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                            {appointment.scheduled_time.substring(0, 5)} (
                                            {appointment.duration_minutes} min)
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        {appointment.meeting_type === "online" ? (
                                            <Video className="h-6 w-6 text-primary" />
                                        ) : (
                                            <MapPin className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Tipo de Reunión
                                        </p>
                                        <p className="font-semibold">
                                            {appointment.meeting_type === "online"
                                                ? "En línea"
                                                : "Presencial"}
                                        </p>
                                        {appointment.meeting_link && (
                                            <a
                                                href={appointment.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                                            >
                                                Unirse a la reunión
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {isPsychologist ? "Estudiante" : "Psicólogo"}
                                        </p>
                                        <p className="font-semibold">
                                            {isPsychologist
                                                ? appointment.student?.name
                                                : appointment.psychologist?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {isPsychologist
                                                ? appointment.student?.email
                                                : appointment.psychologist?.email}
                                        </p>
                                    </div>
                                </div>

                                {appointment.is_recurring && (
                                    <>
                                        <Separator />
                                        <div className="flex items-start gap-4">
                                            <div className="bg-primary/10 p-3 rounded-lg">
                                                <RefreshCw className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    Recurrencia
                                                </p>
                                                <p className="font-semibold">
                                                    {appointment.recurrence_pattern === "daily" &&
                                                        "Diaria"}
                                                    {appointment.recurrence_pattern === "weekly" &&
                                                        "Semanal"}
                                                    {appointment.recurrence_pattern === "monthly" &&
                                                        "Mensual"}
                                                    {" - "}
                                                    {appointment.recurrence_count} repeticiones
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {appointment.notes && (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-lg">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Notas
                                            </p>
                                            <p className="text-sm leading-relaxed">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            {canComplete && (
                                <Button
                                    variant="default"
                                    onClick={handleComplete}
                                    className="flex-1 gap-2"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Marcar como Completada
                                </Button>
                            )}
                            {canCancel && (
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Cancelar Cita
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reschedule Drawer */}
            <RescheduleDrawer
                open={isRescheduleDrawerOpen}
                onOpenChange={setIsRescheduleDrawerOpen}
                appointment={appointment}
            />
        </>
    );
}
