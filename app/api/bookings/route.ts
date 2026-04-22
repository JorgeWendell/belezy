import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
