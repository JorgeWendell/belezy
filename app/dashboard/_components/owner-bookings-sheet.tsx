"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface OwnerBookingItem {
  id: string;
  date: string | Date;
  service: {
    name: string;
    priceInCents: number;
  };
  user: {
    name: string;
  };
}

interface OwnerBookingsSheetProps {
  bookings: OwnerBookingItem[];
}

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const OwnerBookingsSheet = ({ bookings }: OwnerBookingsSheetProps) => {
  const now = new Date();
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return bookingDate >= now && bookingDate <= sevenDaysFromNow;
  });

  const futureBookings = bookings.filter((booking) => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return bookingDate > sevenDaysFromNow;
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-fit">
          Ver agendamentos
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto h-[90vh] max-w-3xl rounded-t-3xl p-0">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Agendamentos da barbearia</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto p-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Proximos (ate 7 dias)</h3>
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum agendamento proximo.</p>
            ) : (
              <div className="space-y-2">
                {upcomingBookings.map((booking) => {
                  const bookingDate =
                    booking.date instanceof Date ? booking.date : new Date(booking.date);
                  return (
                    <div key={booking.id} className="rounded-lg border bg-white p-3">
                      <p className="font-medium">{booking.service.name}</p>
                      <p className="text-sm text-muted-foreground">Cliente: {booking.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingDate.toLocaleDateString("pt-BR")} as{" "}
                        {bookingDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-sm font-semibold">
                        {priceFormatter.format(booking.service.priceInCents / 100)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Futuros</h3>
            {futureBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum agendamento futuro.</p>
            ) : (
              <div className="space-y-2">
                {futureBookings.map((booking) => {
                  const bookingDate =
                    booking.date instanceof Date ? booking.date : new Date(booking.date);
                  return (
                    <div key={booking.id} className="rounded-lg border bg-white p-3">
                      <p className="font-medium">{booking.service.name}</p>
                      <p className="text-sm text-muted-foreground">Cliente: {booking.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bookingDate.toLocaleDateString("pt-BR")} as{" "}
                        {bookingDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-sm font-semibold">
                        {priceFormatter.format(booking.service.priceInCents / 100)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OwnerBookingsSheet;
