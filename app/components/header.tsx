import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
    return ( 
    <header className="flex justify-between items-center px-5 py-0 bg-white ">
       
            <Image src="/header.png" alt="Belezy" width={200} height={100} />
            <Button variant="outline" size="icon"><MenuIcon /></Button>
        
    </header> );
}
 
export default Header;