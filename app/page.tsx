
import Header from "./components/header";
import SearchInput from "./components/search-input";
import Image from "next/image";
import hero from "@/public/hero.png";
import BookingItem from "./components/booking-item";
import { prisma } from "@/lib/prisma";
import BabershopItem from "./components/babershop-item";

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
      <div className="p-5 space-y-4">    
          <SearchInput />     
          <Image src={hero} alt="Belezy" sizes="100vw" className="w-full h-auto rounded-lg" /> 
          <h2 className="text-xs text-foreground font-semibold uppercase">Agendamentos</h2> 
          <BookingItem 
           serviceName="Corte de cabelo"
           babershopName="Barbearia do João"
           babershopImageUrl="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
           date={new Date()}
           />
           <h2 className="text-xs text-foreground font-semibold uppercase">Recomendados</h2> 
           <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {recommendedBarbershops.map((barbershop) => (
           <BabershopItem key={barbershop.id} babershop={barbershop} />
           ))}
           </div>
           <h2 className="text-xs text-foreground font-semibold uppercase">Populares</h2> 
           <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {popularBarbershops.map((barbershop) => (
           <BabershopItem key={barbershop.id} babershop={barbershop} />
           ))}
           </div>
      </div>
      
    </main>
  );
}
export default Home;