import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import { PageContainer, PageSection, PageSessionTitle } from "@/app/components/page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookingListItem from "./_components/booking-list-item";

export const dynamic = "force-dynamic";

const BookingsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        redirect("/");
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            service: true,
            barbershop: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    imageUrl: true,
                    phones: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });

    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
                <PageContainer>
                    <PageSection>
                        <PageSessionTitle>Agendamentos</PageSessionTitle>

                        {bookings.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Voce ainda nao possui reservas.</p>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map((booking) => (
                                    <BookingListItem key={booking.id} booking={booking} />
                                ))}
                            </div>
                        )}
                    </PageSection>
                </PageContainer>
            </div>
            <Footer />
        </main>
    );
};

export default BookingsPage;
