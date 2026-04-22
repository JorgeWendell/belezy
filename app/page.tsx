
import Header from "./components/header";
import SearchInput from "./components/search-input";
import Image from "next/image";
import hero from "@/public/hero.png";
import BookingItem from "./components/booking-item";
import { prisma } from "@/lib/prisma";
import BabershopItem from "./components/babershop-item";
import Footer from "./components/footer";
import { PageContainer, PageSection, PageSessionScrolled, PageSessionTitle } from "./components/page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Home = async (props: PageProps<"/">) => {
  const searchParams = await props.searchParams;
  const search = (searchParams.search ?? "").toString().trim();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const recommendedBarbershops = await prisma.babershop.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      name: "asc",
    },
   
  });
  const popularBarbershops = await prisma.babershop.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      name: "desc",
    },
   
  });

  const confirmedBookings = session?.user?.id
    ? await prisma.booking.findMany({
        where: {
          userId: session.user.id,
          cancelled: false,
        },
        include: {
          service: true,
          barbershop: true,
        },
        orderBy: {
          date: "asc",
        },
      })
    : [];

  return (
    <main>
      <Header />
      <PageContainer>    
          <SearchInput defaultValue={search} />     
          <Image src={hero} alt="Belezy" sizes="100vw" className="w-full h-auto rounded-lg" /> 
          {session?.user?.id && confirmedBookings.length > 0 && (
            <PageSection>
              <PageSessionTitle>Agendamentos</PageSessionTitle>
              <div className="space-y-3">
                {confirmedBookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    serviceName={booking.service.name}
                    babershopName={booking.barbershop.name}
                    babershopImageUrl={booking.barbershop.imageUrl}
                    date={booking.date}
                  />
                ))}
              </div>
            </PageSection>
          )}
          {search ? (
            <PageSection>
              <PageSessionTitle>Resultados</PageSessionTitle>
              {recommendedBarbershops.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma barbearia encontrada para {search}.
                </p>
              ) : (
                <PageSessionScrolled>
                  {recommendedBarbershops.map((barbershop) => (
                    <BabershopItem key={barbershop.id} babershop={barbershop} />
                  ))}
                </PageSessionScrolled>
              )}
            </PageSection>
          ) : (
            <>
              <PageSection>
                <PageSessionTitle>Recomendados</PageSessionTitle> 
                <PageSessionScrolled>
                  {recommendedBarbershops.map((barbershop) => (
                    <BabershopItem key={barbershop.id} babershop={barbershop} />
                  ))}
                </PageSessionScrolled>
              </PageSection>
            
              <PageSection>
                <PageSessionTitle>Populares</PageSessionTitle> 
                <PageSessionScrolled>
                  {popularBarbershops.map((barbershop) => (
                    <BabershopItem key={barbershop.id} babershop={barbershop} />
                  ))}
                </PageSessionScrolled>
              </PageSection>
            </>
          )}
      </PageContainer>
      <Footer />
    </main>
  );
}
export default Home;