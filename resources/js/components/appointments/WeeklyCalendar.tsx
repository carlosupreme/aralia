import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Program {
    id: number;
    name: string;
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
    program: Program;
    psychologist?: User;
    student?: User;
}

interface WeeklyCalendarProps {
    appointments: Appointment[];
    onAppointmentClick: (appointment: Appointment) => void;
}

const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export default function WeeklyCalendar({ appointments, onAppointmentClick }: WeeklyCalendarProps) {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const weekStart = startOfWeek(currentWeek, { locale: es });

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const goToPreviousWeek = () => {
        setCurrentWeek(addDays(currentWeek, -7));
    };

    const goToNextWeek = () => {
        setCurrentWeek(addDays(currentWeek, 7));
    };

    const goToToday = () => {
        setCurrentWeek(new Date());
    };

    const getAppointmentsForDay = (day: Date) => {
        return appointments.filter((apt) =>
            isSameDay(parseISO(apt.scheduled_date), day)
        );
    };

    const getAppointmentPosition = (timeString: string, duration: number) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const startMinutes = 8 * 60; // 8 AM start

        const top = ((totalMinutes - startMinutes) / 60) * 80; // 80px per hour
        const height = (duration / 60) * 80;

        return { top, height };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-500 border-blue-600 hover:bg-blue-600";
            case "pending_reschedule":
                return "bg-amber-500 border-amber-600 hover:bg-amber-600";
            case "rescheduled":
                return "bg-purple-500 border-purple-600 hover:bg-purple-600";
            case "completed":
                return "bg-green-500 border-green-600 hover:bg-green-600";
            case "cancelled":
                return "bg-gray-400 border-gray-500 hover:bg-gray-500";
            default:
                return "bg-blue-500 border-blue-600 hover:bg-blue-600";
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                    <Button onClick={goToToday} variant="outline" size="sm">
                        Hoy
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={goToPreviousWeek}
                            variant="ghost"
                            size="icon"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button onClick={goToNextWeek} variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold">
                        {format(weekStart, "MMMM yyyy", { locale: es })}
                    </h2>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto border rounded-lg">
                <div className="min-w-[800px]">
                    {/* Day Headers */}
                    <div className="grid grid-cols-8 border-b bg-muted/50 sticky top-0 z-10">
                        <div className="p-3 border-r"></div>
                        {weekDays.map((day) => {
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "p-3 text-center border-r last:border-r-0",
                                        isToday && "bg-primary/10"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "text-sm font-medium",
                                            isToday && "text-primary"
                                        )}
                                    >
                                        {format(day, "EEE", { locale: es })}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-2xl font-bold mt-1",
                                            isToday &&
                                                "bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mx-auto"
                                        )}
                                    >
                                        {format(day, "d")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Time Slots Grid */}
                    <div className="relative">
                        {timeSlots.map((time, index) => (
                            <div key={time} className="grid grid-cols-8 border-b">
                                {/* Time Label */}
                                <div className="p-2 border-r text-sm text-muted-foreground text-right pr-4">
                                    {time}
                                </div>
                                {/* Day Columns */}
                                {weekDays.map((day) => (
                                    <div
                                        key={`${day}-${time}`}
                                        className="relative border-r last:border-r-0 min-h-[80px]"
                                    >
                                        {/* Appointments for this time slot */}
                                        {index === 0 &&
                                            getAppointmentsForDay(day).map((apt) => {
                                                const { top, height } = getAppointmentPosition(
                                                    apt.scheduled_time,
                                                    apt.duration_minutes
                                                );
                                                return (
                                                    <div
                                                        key={apt.id}
                                                        className={cn(
                                                            "absolute left-1 right-1 rounded-md border-2 p-2 cursor-pointer transition-all z-10",
                                                            "text-white text-xs overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02]",
                                                            getStatusColor(apt.status)
                                                        )}
                                                        style={{
                                                            top: `${top}px`,
                                                            height: `${Math.max(height, 40)}px`,
                                                        }}
                                                        onClick={() => onAppointmentClick(apt)}
                                                    >
                                                        <div className="font-semibold truncate">
                                                            {apt.scheduled_time.substring(0, 5)}
                                                        </div>
                                                        <div className="truncate text-white/90">
                                                            {apt.program.name}
                                                        </div>
                                                        {apt.student && (
                                                            <div className="truncate text-white/80 text-xs">
                                                                {apt.student.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
