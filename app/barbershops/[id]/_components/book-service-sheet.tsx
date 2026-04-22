"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getServiceDurationInMinutes } from "@/lib/service-duration";
import { toast } from "sonner";

interface BookServiceSheetProps {
    service: {
        id: string;
        name: string;
        description: string;
        priceInCents: number;
    };
    barbershopId: string;
    barbershopName: string;
}

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 19;

const getAvailableTimes = (durationInMinutes: number) => {
    const times: string[] = [];
    const firstMinute = WORK_START_HOUR * 60;
    const lastStartMinute = WORK_END_HOUR * 60 - durationInMinutes;

    for (let minutes = firstMinute; minutes <= lastStartMinute; minutes += durationInMinutes) {
        const hours = Math.floor(minutes / 60);
        const minute = minutes % 60;
        times.push(`${String(hours).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }

    return times;
};

const getMonthGrid = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
    });
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const BookServiceSheet = ({ service, barbershopId, barbershopName }: BookServiceSheetProps) => {
    const { data: session, isPending } = authClient.useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const serviceDurationInMinutes = useMemo(
        () => getServiceDurationInMinutes(service.description),
        [service.description]
    );
    const availableTimes = useMemo(
        () => getAvailableTimes(serviceDurationInMinutes),
        [serviceDurationInMinutes]
    );
    const [selectedTime, setSelectedTime] = useState(() => availableTimes[0] ?? "09:00");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!availableTimes.includes(selectedTime)) {
            setSelectedTime(availableTimes[0] ?? "09:00");
        }
    }, [availableTimes, selectedTime]);

    const days = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

    const monthLabel = useMemo(() => {
        const month = currentMonth.toLocaleDateString("pt-BR", { month: "long" });
        return month.charAt(0).toUpperCase() + month.slice(1);
    }, [currentMonth]);

    const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
    });

    const buildBookingDate = () => {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const date = new Date(selectedDate);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const handleReserveClick = async () => {
        if (isPending) {
            return;
        }

        if (!session?.user) {
            const callbackURL = window.location.pathname + window.location.search;
            const { data } = await authClient.signIn.social({
                provider: "google",
                callbackURL,
                disableRedirect: true,
            });

            if (data?.url) {
                window.location.href = data.url;
            }
            return;
        }

        setIsOpen(true);
    };

    const handleConfirmBooking = async () => {
        if (!session?.user) {
            toast.error("Voce precisa estar logado para reservar.");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    barbershopId,
                    date: buildBookingDate().toISOString(),
                }),
            });

            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                throw new Error(data?.error ?? "Falha ao confirmar reserva.");
            }

            toast.success("Reserva criada com sucesso.");
            setIsOpen(false);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Nao foi possivel criar a reserva.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button className="rounded-full px-5" onClick={handleReserveClick} disabled={isPending}>
                {isPending ? "Carregando..." : "Reservar"}
            </Button>

            <SheetContent
                side="bottom"
                showCloseButton={false}
                className="mx-auto h-[92vh] max-w-md rounded-t-4xl border-x border-t bg-[#f5f5f5] p-0"
            >
                <SheetHeader className="flex-row items-center justify-between border-b px-6 py-5">
                    <SheetTitle className="text-2xl font-bold text-[#1f1f1f]">Fazer Reserva</SheetTitle>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full"
                        onClick={() => setIsOpen(false)}
                    >
                        <XIcon className="size-4" />
                    </Button>
                </SheetHeader>

                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <section className="rounded-2xl bg-[#f5f5f5]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-3xl font-semibold text-[#2b2b2b]">{monthLabel}</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    className="rounded-xl"
                                    onClick={() =>
                                        setCurrentMonth(
                                            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                                        )
                                    }
                                >
                                    <ChevronLeftIcon className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    className="rounded-xl"
                                    onClick={() =>
                                        setCurrentMonth(
                                            (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                                        )
                                    }
                                >
                                    <ChevronRightIcon className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-3">
                            {weekDays.map((day) => (
                                <span key={day} className="text-center text-sm text-muted-foreground">
                                    {day}
                                </span>
                            ))}

                            {days.map((day) => {
                                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                                const isSelected =
                                    day.getDate() === selectedDate.getDate() &&
                                    day.getMonth() === selectedDate.getMonth() &&
                                    day.getFullYear() === selectedDate.getFullYear();

                                return (
                                    <button
                                        key={day.toISOString()}
                                        type="button"
                                        className={[
                                            "mx-auto flex size-10 items-center justify-center rounded-full text-base transition",
                                            isSelected
                                                ? "bg-primary text-primary-foreground"
                                                : "text-[#2d2d2d] hover:bg-black/5",
                                            !isCurrentMonth && "text-muted-foreground/60",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        onClick={() => setSelectedDate(day)}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="border-y py-4">
                        <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                            {availableTimes.map((time) => (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    className="rounded-full px-6"
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="text-lg font-semibold text-[#222]">{service.name}</p>
                            <p className="text-lg font-semibold text-[#222]">
                                {currencyFormatter.format(service.priceInCents / 100)}
                            </p>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between gap-2">
                                <span>Duracao</span>
                                <span>{serviceDurationInMinutes} min</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span>Data</span>
                                <span className="capitalize">{formattedDate}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span>Horario</span>
                                <span>{selectedTime}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span>Barbearia</span>
                                <span>{barbershopName}</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-auto border-t bg-[#f5f5f5] p-6">
                    <Button
                        className="h-12 w-full rounded-full text-base font-semibold"
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Confirmando..." : "Confirmar"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default BookServiceSheet;
