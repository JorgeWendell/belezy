import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, MapPinIcon } from "lucide-react";
import { notFound } from "next/navigation";
import BookServiceSheet from "./_components/book-service-sheet";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const BarbershopPage = async (props: PageProps<"/barbershops/[id]">) => {
    const { id } = (await props.params) as { id: string };
    const barbershop = await prisma.babershop.findUnique({
        where: {
            id,
        },
        include: {
            services: true,
        },
    });

    if (!barbershop) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#f1f1f1] pb-8">
            <section className="relative h-[240px] w-full">
                <Image
                    src={barbershop.imageUrl}
                    alt={barbershop.name}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 left-4 z-10 rounded-full bg-white/95 text-black hover:bg-white"
                >
                    <Link href="/">
                        <ChevronLeftIcon />
                    </Link>
                </Button>
            </section>

            <section className="relative z-10 -mt-8 rounded-t-3xl bg-[#f1f1f1] px-5 pt-5">
                <div className="flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-full border bg-black">
                        <Image
                            src={barbershop.imageUrl}
                            alt={`Logo ${barbershop.name}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1f1f1f]">{barbershop.name}</h1>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPinIcon className="size-3.5" />
                            {barbershop.address}
                        </p>
                    </div>
                </div>

                <div className="mt-6 border-t pt-6">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-[#2a2a2a]">
                        Sobre nos
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-[#3d3d3d]">{barbershop.description}</p>
                </div>

                <div className="mt-8 border-t pt-6">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-[#2a2a2a]">
                        Servicos
                    </h2>

                    <div className="mt-4 space-y-3">
                        {barbershop.services.map((service) => (
                            <article
                                key={service.id}
                                className="flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-xs"
                            >
                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                                    <Image
                                        src={service.imageUrl}
                                        alt={service.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <h3 className="truncate text-lg font-semibold text-[#2b2b2b]">
                                        {service.name}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {service.description}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between gap-3">
                                        <p className="text-2xl font-bold text-[#1f1f1f]">
                                            {priceFormatter.format(service.priceInCents / 100)}
                                        </p>
                                        <BookServiceSheet
                                            service={service}
                                            barbershopId={barbershop.id}
                                            barbershopName={barbershop.name}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BarbershopPage;