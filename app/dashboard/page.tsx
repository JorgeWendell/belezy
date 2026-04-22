import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBarbershop, createService, updateBarbershop, updateService } from "./actions";
import OwnerBookingsSheet from "./_components/owner-bookings-sheet";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const barbershop = await prisma.babershop.findUnique({
    where: {
      ownerId: session.user.id,
    },
    include: {
      services: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const ownerBookings = barbershop
    ? await prisma.booking.findMany({
        where: {
          barbershopId: barbershop.id,
          cancelled: false,
          date: {
            gte: new Date(),
          },
        },
        include: {
          service: {
            select: {
              name: true,
              priceInCents: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      })
    : [];

  return (
    <main className="flex min-h-screen flex-col bg-[#f1f1f1]">
      <Header />
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#1f1f1f]">Painel do dono</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre sua barbearia e mantenha sua lista de servicos atualizada.
          </p>
          {barbershop && <OwnerBookingsSheet bookings={ownerBookings} />}
        </div>

        {!barbershop ? (
          <Card>
            <CardHeader>
              <CardTitle>Criar barbearia</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createBarbershop} className="grid gap-3">
                <Input name="name" placeholder="Nome da barbearia" required />
                <Input name="address" placeholder="Endereco completo" required />
                <Input name="phone" placeholder="Telefone/WhatsApp" required />
                <Input
                  name="description"
                  placeholder="Descricao da barbearia"
                  required
                />
                <Input name="imageUrl" placeholder="URL da imagem (opcional)" />
                <Button type="submit">Salvar barbearia</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{barbershop.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{barbershop.address}</p>
                <p>{barbershop.description}</p>
                <p>{barbershop.phones.join(" / ")}</p>

                <details className="rounded-lg border bg-white p-3">
                  <summary className="inline-flex cursor-pointer list-none items-center rounded-md border px-3 py-2 text-sm font-medium text-foreground">
                    Editar Salao
                  </summary>
                  <form action={updateBarbershop} className="mt-3 grid gap-3">
                    <Input name="name" defaultValue={barbershop.name} placeholder="Nome da barbearia" required />
                    <Input name="address" defaultValue={barbershop.address} placeholder="Endereco completo" required />
                    <Input
                      name="phone"
                      defaultValue={barbershop.phones[0] ?? ""}
                      placeholder="Telefone/WhatsApp"
                      required
                    />
                    <Input
                      name="description"
                      defaultValue={barbershop.description}
                      placeholder="Descricao da barbearia"
                      required
                    />
                    <Input name="imageUrl" defaultValue={barbershop.imageUrl} placeholder="URL da imagem (opcional)" />
                    <Button type="submit">Salvar alteracoes da barbearia</Button>
                  </form>
                </details>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar servico</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={createService} className="grid gap-3">
                  <Input name="name" placeholder="Nome do servico" required />
                  <Input name="description" placeholder="Descricao do servico" required />
                  <Input
                    name="durationInMinutes"
                    type="number"
                    min={5}
                    step={5}
                    placeholder="Duracao em minutos (ex: 30)"
                    required
                  />
                  <Input
                    name="price"
                    inputMode="decimal"
                    placeholder="Preco (ex: 35,00)"
                    required
                  />
                  <Input name="imageUrl" placeholder="URL da imagem (opcional)" />
                  <Button type="submit">Salvar servico</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicos cadastrados ({barbershop.services.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {barbershop.services.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum servico cadastrado ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {barbershop.services.map((service) => (
                      <div key={service.id} className="rounded-lg border bg-white p-3">
                        <p className="font-medium text-[#1f1f1f]">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <p className="mt-1 text-sm font-semibold text-[#1f1f1f]">
                          {currencyFormatter.format(service.priceInCents / 100)}
                        </p>
                        <details className="mt-3">
                          <summary className="inline-flex cursor-pointer list-none items-center rounded-md border px-3 py-2 text-sm font-medium text-foreground">
                            Editar servico
                          </summary>
                          <form action={updateService} className="mt-3 grid gap-2">
                            <input type="hidden" name="serviceId" value={service.id} />
                            <Input name="name" defaultValue={service.name} required />
                            <Input name="description" defaultValue={service.description} required />
                            <Input
                              name="price"
                              inputMode="decimal"
                              defaultValue={(service.priceInCents / 100).toFixed(2).replace(".", ",")}
                              required
                            />
                            <Input name="imageUrl" defaultValue={service.imageUrl} placeholder="URL da imagem (opcional)" />
                            <Button type="submit" variant="outline">Salvar alteracoes do servico</Button>
                          </form>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
};

export default DashboardPage;
