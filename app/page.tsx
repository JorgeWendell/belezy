
import Header from "./components/header";
import SearchInput from "./components/search-input";
import Image from "next/image";
import hero from "@/public/hero.png";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="px-5 space-y-4">    
          <SearchInput />     
          <Image src={hero} alt="Belezy" sizes="100vw" className="w-full h-auto rounded-lg" />  
      </div>
      
    </div>
  );
}
