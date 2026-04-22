import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServiceDurationInMinutes } from "@/lib/service-duration";

export const POST = async (request: Request) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
    }

    const body = (await request.json()) as {
        serviceId?: string;
        barbershopId?: string;
        date?: string;
    };

    if (!body.serviceId || !body.barbershopId || !body.date) {
        return NextResponse.json({ error: "Dados obrigatorios ausentes." }, { status: 400 });
    }

    const bookingDate = new Date(body.date);
    if (Number.isNaN(bookingDate.getTime())) {
        return NextResponse.json({ error: "Data invalida." }, { status: 400 });
    }

    const selectedService = await prisma.babershopService.findUnique({
        where: {
            id: body.serviceId,
        },
        select: {
            id: true,
            babershopId: true,
            description: true,
        },
    });

    if (!selectedService || selectedService.babershopId !== body.barbershopId) {
        return NextResponse.json({ error: "Servico invalido para esta barbearia." }, { status: 400 });
    }

    const newBookingDurationInMinutes = getServiceDurationInMinutes(selectedService.description);
    const newBookingEnd = new Date(bookingDate.getTime() + newBookingDurationInMinutes * 60_000);

    const existingBookings = await prisma.booking.findMany({
        where: {
            barbershopId: body.barbershopId,
            cancelled: false,
            date: {
                gte: new Date(bookingDate.getTime() - 12 * 60 * 60 * 1000),
                lt: new Date(newBookingEnd.getTime() + 12 * 60 * 60 * 1000),
            },
        },
        select: {
            id: true,
            date: true,
            service: {
                select: {
                    description: true,
                },
            },
        },
    });

    const hasConflict = existingBookings.some((existingBooking) => {
        const existingStart = existingBooking.date;
        const existingDurationInMinutes = getServiceDurationInMinutes(
            existingBooking.service.description
        );
        const existingEnd = new Date(existingStart.getTime() + existingDurationInMinutes * 60_000);
        return bookingDate < existingEnd && newBookingEnd > existingStart;
    });

    if (hasConflict) {
        return NextResponse.json(
            { error: "Ja existe um agendamento neste horario ou intervalo." },
            { status: 409 }
        );
    }

    const booking = await prisma.booking.create({
        data: {
            serviceId: body.serviceId,
            barbershopId: body.barbershopId,
            userId: session.user.id,
            date: bookingDate,
        },
    });

    return NextResponse.json({ booking }, { status: 201 });
};

export const DELETE = async (request: Request) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
    }

    const body = (await request.json()) as {
        bookingId?: string;
    };

    if (!body.bookingId) {
        return NextResponse.json({ error: "bookingId e obrigatorio." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
        where: {
            id: body.bookingId,
        },
        select: {
            id: true,
            userId: true,
        },
    });

    if (!booking) {
        return NextResponse.json({ error: "Reserva nao encontrada." }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
        return NextResponse.json({ error: "Sem permissao para excluir esta reserva." }, { status: 403 });
    }

    await prisma.booking.delete({
        where: {
            id: body.bookingId,
        },
    });

    return NextResponse.json({ success: true }, { status: 200 });
};
