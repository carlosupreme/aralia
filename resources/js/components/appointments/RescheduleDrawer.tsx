import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { accept as acceptProposal, reject as rejectProposal } from "@/routes/proposals";
import { propose } from "@/routes/appointments";

interface User {
    id: number;
    name: string;
    email: string;
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
    proposals: AppointmentProposal[];
}

interface RescheduleDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: Appointment;
}

export default function RescheduleDrawer({
    open,
    onOpenChange,
    appointment,
}: RescheduleDrawerProps) {
    const { auth } = usePage().props as any;
    const currentUserId = auth.user.id;
    const [acceptingDate, setAcceptingDate] = useState<string | null>(null); // Format: "proposalId-dateIndex"
    const [rejectingProposal, setRejectingProposal] = useState<number | null>(null);

    // Form for creating new proposal
    const { data, setData, post, processing, errors, reset } = useForm({
        proposed_dates: [
            { date: "", time: appointment.scheduled_time }, // Default time from original appointment
        ],
        message: "",
    });

    const addDateSlot = () => {
        setData("proposed_dates", [
            ...data.proposed_dates,
            { date: "", time: appointment.scheduled_time },
        ]);
    };

    const removeDateSlot = (index: number) => {
        const newDates = data.proposed_dates.filter((_, i) => i !== index);
        setData("proposed_dates", newDates);
    };

    const updateDateSlot = (index: number, field: "date" | "time", value: string) => {
        const newDates = [...data.proposed_dates];
        newDates[index][field] = value;
        setData("proposed_dates", newDates);
    };

    const handleSubmitProposal = (e: React.FormEvent) => {
        e.preventDefault();
        post(propose(appointment.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setData("proposed_dates", [{ date: "", time: appointment.scheduled_time }]);
            },
        });
    };

    const handleAcceptProposal = (proposalId: number, dateIndex: number) => {
        const key = `${proposalId}-${dateIndex}`;
        setAcceptingDate(key);
        router.post(
            acceptProposal(proposalId).url,
            { date_index: dateIndex },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAcceptingDate(null);
                    onOpenChange(false);
                },
                onError: () => {
                    setAcceptingDate(null);
                },
            }
        );
    };

    const handleRejectProposal = (proposalId: number) => {
        if (!confirm("¿Estás seguro de que deseas rechazar esta propuesta?")) {
            return;
        }
        setRejectingProposal(proposalId);
        router.post(
            rejectProposal(proposalId).url,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setRejectingProposal(null);
                },
            }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="secondary">Pendiente</Badge>;
            case "accepted":
                return <Badge className="bg-green-500 hover:bg-green-600">Aceptada</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rechazada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    // Sort proposals by creation date (most recent first)
    const sortedProposals = [...appointment.proposals].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Reprogramar Cita</DrawerTitle>
                    <DrawerDescription>
                        Propone nuevas fechas y horarios o acepta una propuesta existente
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Original Appointment Info */}
                    <Card className="p-4 bg-muted/50">
                        <h3 className="font-semibold mb-2">Cita Original</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {format(new Date(appointment.scheduled_date), "EEEE, d 'de' MMMM 'de' yyyy", {
                                        locale: es,
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {appointment.scheduled_time} ({appointment.duration_minutes} min)
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Chat History / Proposals */}
                    {sortedProposals.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold">Historial de Propuestas</h3>
                            {sortedProposals.map((proposal) => {
                                const isOwnProposal = proposal.user_id === currentUserId;
                                const canAcceptReject =
                                    !isOwnProposal && proposal.status === "pending";

                                return (
                                    <Card
                                        key={proposal.id}
                                        className={`p-4 ${isOwnProposal ? "bg-primary/5" : ""}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {proposal.proposed_by.name}
                                                </span>
                                                {isOwnProposal && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Tú
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(proposal.created_at),
                                                        "d MMM, HH:mm",
                                                        { locale: es }
                                                    )}
                                                </span>
                                                {getStatusBadge(proposal.status)}
                                            </div>
                                        </div>

                                        {proposal.message && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {proposal.message}
                                            </p>
                                        )}

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Fechas propuestas:</p>
                                            {proposal.proposed_dates.map((dateSlot, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-md border p-2"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {format(
                                                                new Date(dateSlot.date),
                                                                "d 'de' MMMM",
                                                                { locale: es }
                                                            )}
                                                        </span>
                                                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                                                        <span className="text-sm">
                                                            {dateSlot.time}
                                                        </span>
                                                    </div>
                                                    {canAcceptReject && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() =>
                                                                    handleAcceptProposal(
                                                                        proposal.id,
                                                                        idx
                                                                    )
                                                                }
                                                                disabled={
                                                                    acceptingDate === `${proposal.id}-${idx}`
                                                                }
                                                            >
                                                                <Check className="h-4 w-4 mr-1" />
                                                                {acceptingDate === `${proposal.id}-${idx}`
                                                                    ? "Aceptando..."
                                                                    : "Aceptar"}
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {proposal.status === "accepted" &&
                                                        proposal.accepted_date_index === idx && (
                                                            <Badge className="bg-green-500">
                                                                Aceptada
                                                            </Badge>
                                                        )}
                                                </div>
                                            ))}
                                        </div>

                                        {canAcceptReject && (
                                            <div className="mt-3 pt-3 border-t">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleRejectProposal(proposal.id)
                                                    }
                                                    disabled={rejectingProposal === proposal.id}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    {rejectingProposal === proposal.id
                                                        ? "Rechazando..."
                                                        : "Rechazar todas"}
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* New Proposal Form */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="font-semibold">Nueva Propuesta</h3>

                        <form onSubmit={handleSubmitProposal} className="space-y-4">
                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message">Mensaje (opcional)</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Explica el motivo de la reprogramación..."
                                    value={data.message}
                                    onChange={(e) => setData("message", e.target.value)}
                                    rows={2}
                                />
                                {errors.message && (
                                    <p className="text-sm text-destructive">{errors.message}</p>
                                )}
                            </div>

                            {/* Date-Time Repeater */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Propuestas de Fecha y Hora</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={addDateSlot}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Agregar propuesta
                                    </Button>
                                </div>

                                {data.proposed_dates.map((dateSlot, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex-1 flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    value={dateSlot.date}
                                                    onChange={(e) =>
                                                        updateDateSlot(index, "date", e.target.value)
                                                    }
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                            <span className="text-muted-foreground">-</span>
                                            <div className="relative flex-1">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="time"
                                                    value={dateSlot.time}
                                                    onChange={(e) =>
                                                        updateDateSlot(index, "time", e.target.value)
                                                    }
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {data.proposed_dates.length > 1 && (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => removeDateSlot(index)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {errors.proposed_dates && (
                                    <p className="text-sm text-destructive">
                                        {errors.proposed_dates}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <DrawerFooter>
                    <Button type="submit" disabled={processing} onClick={handleSubmitProposal}>
                        {processing ? "Enviando..." : "Enviar Propuesta"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
