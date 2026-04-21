
import Header from "./components/header";
import SearchInput from "./components/search-input";
import Image from "next/image";
import hero from "@/public/hero.png";
import BookingItem from "./components/booking-item";
import { prisma } from "@/lib/prisma";
import BabershopItem from "./components/babershop-item";
import Footer from "./components/footer";
import { PageContainer, PageSection, PageSessionScrolled, PageSessionTitle } from "./components/page";

const Home = async () => {
  const recommendedBarbershops = await prisma.babershop.findMany({
    orderBy: {
      name: "asc",
    },
   
  });
  const popularBarbershops = await prisma.babershop.findMany({
    orderBy: {
      name: "desc",
    },
   
  });
  return (
    <main>
      <Header />
      <PageContainer>    
          <SearchInput />     
          <Image src={hero} alt="Belezy" sizes="100vw" className="w-full h-auto rounded-lg" /> 
          <PageSection>
              <PageSessionTitle>Agendamentos</PageSessionTitle> 
                <BookingItem 
                serviceName="Corte de cabelo"
                babershopName="Barbearia do João"
                babershopImageUrl="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                date={new Date()}
              />
          </PageSection>
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
      </PageContainer>
      <Footer />
    </main>
  );
}
export default Home;