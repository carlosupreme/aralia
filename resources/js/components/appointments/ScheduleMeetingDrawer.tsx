import { useState } from "react";
import { useForm } from "@inertiajs/react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock, Video, MapPin } from "lucide-react";

interface Student {
    id: number;
    name: string;
    email: string;
}

interface ScheduleMeetingDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    programId: number;
    students: Student[];
}

export default function ScheduleMeetingDrawer({
    open,
    onOpenChange,
    programId,
    students,
}: ScheduleMeetingDrawerProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        program_id: programId,
        student_id: "",
        scheduled_date: "",
        scheduled_time: "",
        duration_minutes: 60,
        meeting_type: "online" as "online" | "in-person",
        meeting_link: "",
        notes: "",
        is_recurring: false,
        recurrence_pattern: "",
        recurrence_count: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("appointments.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Programar Nueva Cita</DrawerTitle>
                    <DrawerDescription>
                        Crea una nueva cita con un estudiante del programa
                    </DrawerDescription>
                </DrawerHeader>

                <form onSubmit={handleSubmit} className="px-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Student Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="student_id">Estudiante *</Label>
                        <Select
                            value={data.student_id}
                            onValueChange={(value) => setData("student_id", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estudiante" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((student) => (
                                    <SelectItem key={student.id} value={student.id.toString()}>
                                        {student.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.student_id && (
                            <p className="text-sm text-destructive">{errors.student_id}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="scheduled_date">Fecha *</Label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="scheduled_date"
                                type="date"
                                value={data.scheduled_date}
                                onChange={(e) => setData("scheduled_date", e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                        {errors.scheduled_date && (
                            <p className="text-sm text-destructive">{errors.scheduled_date}</p>
                        )}
                    </div>

                    {/* Time and Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scheduled_time">Hora *</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="scheduled_time"
                                    type="time"
                                    value={data.scheduled_time}
                                    onChange={(e) => setData("scheduled_time", e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            {errors.scheduled_time && (
                                <p className="text-sm text-destructive">{errors.scheduled_time}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration_minutes">Duración (min) *</Label>
                            <Select
                                value={data.duration_minutes.toString()}
                                onValueChange={(value) => setData("duration_minutes", parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 minutos</SelectItem>
                                    <SelectItem value="30">30 minutos</SelectItem>
                                    <SelectItem value="45">45 minutos</SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                    <SelectItem value="90">1.5 horas</SelectItem>
                                    <SelectItem value="120">2 horas</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.duration_minutes && (
                                <p className="text-sm text-destructive">{errors.duration_minutes}</p>
                            )}
                        </div>
                    </div>

                    {/* Meeting Type */}
                    <div className="space-y-2">
                        <Label htmlFor="meeting_type">Tipo de reunión *</Label>
                        <Select
                            value={data.meeting_type}
                            onValueChange={(value: "online" | "in-person") =>
                                setData("meeting_type", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="online">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4" />
                                        En línea
                                    </div>
                                </SelectItem>
                                <SelectItem value="in-person">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Presencial
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.meeting_type && (
                            <p className="text-sm text-destructive">{errors.meeting_type}</p>
                        )}
                    </div>

                    {/* Meeting Link (if online) */}
                    {data.meeting_type === "online" && (
                        <div className="space-y-2">
                            <Label htmlFor="meeting_link">Enlace de reunión</Label>
                            <Input
                                id="meeting_link"
                                type="url"
                                placeholder="https://meet.google.com/..."
                                value={data.meeting_link}
                                onChange={(e) => setData("meeting_link", e.target.value)}
                            />
                            {errors.meeting_link && (
                                <p className="text-sm text-destructive">{errors.meeting_link}</p>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                            id="notes"
                            placeholder="Agenda, temas a tratar, preparación necesaria..."
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                        />
                        {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_recurring">Cita Recurrente</Label>
                            <p className="text-sm text-muted-foreground">
                                Repetir esta cita automáticamente
                            </p>
                        </div>
                        <Switch
                            id="is_recurring"
                            checked={data.is_recurring}
                            onCheckedChange={(checked) => setData("is_recurring", checked)}
                        />
                    </div>

                    {/* Recurrence Options */}
                    {data.is_recurring && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="recurrence_pattern">Patrón</Label>
                                <Select
                                    value={data.recurrence_pattern}
                                    onValueChange={(value) => setData("recurrence_pattern", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Diaria</SelectItem>
                                        <SelectItem value="weekly">Semanal</SelectItem>
                                        <SelectItem value="monthly">Mensual</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.recurrence_pattern && (
                                    <p className="text-sm text-destructive">
                                        {errors.recurrence_pattern}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recurrence_count">Repeticiones</Label>
                                <Input
                                    id="recurrence_count"
                                    type="number"
                                    min="1"
                                    max="52"
                                    value={data.recurrence_count}
                                    onChange={(e) =>
                                        setData("recurrence_count", parseInt(e.target.value))
                                    }
                                />
                                {errors.recurrence_count && (
                                    <p className="text-sm text-destructive">
                                        {errors.recurrence_count}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                <DrawerFooter>
                    <Button type="submit" disabled={processing} onClick={handleSubmit}>
                        {processing ? "Creando..." : "Crear Cita"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
