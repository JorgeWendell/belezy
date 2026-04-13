
import Header from "./components/header";
import SearchInput from "./components/search-input";
import Image from "next/image";
import hero from "@/public/hero.png";
import BookingItem from "./components/booking-item";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="px-5 space-y-4">    
          <SearchInput />     
          <Image src={hero} alt="Belezy" sizes="100vw" className="w-full h-auto rounded-lg" /> 
          <h2 className="text-xs text-foreground font-semibold uppercase">Agendamentos</h2> 
          <BookingItem 
           serviceName="Corte de cabelo"
           babershopName="Barbearia do João"
           babershopImageUrl="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
           date={new Date()}
           />
      </div>
      
    </main>
  );
}
