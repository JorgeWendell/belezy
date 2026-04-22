"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CopyIcon, SmartphoneIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface BookingListItemProps {
    booking: {
        id: string;
        date: string | Date;
        cancelled: boolean | null;
        service: {
            name: string;
            priceInCents: number;
        };
        barbershop: {
            name: string;
            address: string;
            imageUrl: string;
            phones: string[];
        };
    };
}

const BookingListItem = ({ booking }: BookingListItemProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const at = booking.date instanceof Date ? booking.date : new Date(booking.date);
    const price = useMemo(
        () =>
            new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(booking.service.priceInCents / 100),
        [booking.service.priceInCents]
    );

    const longDate = at.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
    });

    const handleCopyPhone = async (phone: string) => {
        try {
            await navigator.clipboard.writeText(phone);
            toast.success("Telefone copiado.");
        } catch {
            toast.error("Nao foi possivel copiar o telefone.");
        }
    };

    const handleCancelBooking = async () => {
        try {
            setIsCancelling(true);
            const response = await fetch("/api/bookings", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingId: booking.id,
                }),
            });

            if (!response.ok) {
                throw new Error("Falha ao cancelar reserva.");
            }

            toast.success("Reserva cancelada com sucesso.");
            setIsOpen(false);
            router.refresh();
        } catch {
            toast.error("Nao foi possivel cancelar a reserva.");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <button type="button" className="w-full text-left" onClick={() => setIsOpen(true)}>
                <Card className="flex w-full min-w-full flex-row items-center justify-between p-0">
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <Badge className="w-fit bg-primary/15 text-primary hover:bg-primary/15">
                            {booking.cancelled ? "Cancelado" : "Confirmado"}
                        </Badge>
                        <div className="flex flex-col gap-2">
                            <p className="font-bold">{booking.service.name}</p>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={booking.barbershop.imageUrl} />
                                </Avatar>
                                <p className="text-sm text-muted-foreground">{booking.barbershop.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-full flex-col items-center justify-center border-l p-6 py-3">
                        <p className="text-xs capitalize">
                            {at.toLocaleDateString("pt-BR", { month: "long" })}
                        </p>
                        <p>{at.toLocaleDateString("pt-BR", { day: "2-digit" })}</p>
                        <p>{at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                </Card>
            </button>

            <SheetContent
                side="bottom"
                showCloseButton={false}
                className="mx-auto h-[92vh] max-w-md rounded-t-4xl border-x border-t bg-[#f5f5f5] p-0"
            >
                <SheetHeader className="flex-row items-center justify-between border-b px-6 py-5">
                    <SheetTitle className="text-2xl font-bold text-[#1f1f1f]">
                        Informacoes da Reserva
                    </SheetTitle>
                    <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={() => setIsOpen(false)}>
                        <XIcon className="size-4" />
                    </Button>
                </SheetHeader>

                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <section className="rounded-2xl border bg-[#d9d9d9] p-4">
                        <div className="rounded-2xl border bg-white p-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-12">
                                    <AvatarImage src={booking.barbershop.imageUrl} />
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate text-xl font-semibold">{booking.barbershop.name}</p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {booking.barbershop.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Badge className="w-fit bg-primary/15 text-primary hover:bg-primary/15">CONFIRMADO</Badge>

                    <section className="rounded-2xl border bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="text-lg font-semibold text-[#222]">{booking.service.name}</p>
                            <p className="text-lg font-semibold text-[#222]">{price}</p>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between gap-2">
                                <span>Data</span>
                                <span className="capitalize">{longDate}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span>Horario</span>
                                <span>{at.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span>Barbearia</span>
                                <span>{booking.barbershop.name}</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        {booking.barbershop.phones.map((phone) => (
                            <div key={phone} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-[#2a2a2a]">
                                    <SmartphoneIcon className="size-5" />
                                    <span>{phone}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-full"
                                    onClick={() => handleCopyPhone(phone)}
                                >
                                    <CopyIcon className="mr-1 size-4" />
                                    Copiar
                                </Button>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 border-t bg-[#f5f5f5] p-6">
                    <Button variant="outline" className="h-12 rounded-full" onClick={() => setIsOpen(false)}>
                        Voltar
                    </Button>
                    <Button
                        variant="destructive"
                        className="h-12 rounded-full"
                        onClick={handleCancelBooking}
                        disabled={isCancelling}
                    >
                        {isCancelling ? "Cancelando..." : "Cancelar Reserva"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default BookingListItem;
