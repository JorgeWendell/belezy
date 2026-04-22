import Link from "next/link";
import { Babershop } from "../generated/prisma/client";
import Image from "next/image";

interface BabershopItemProps {
    babershop: Babershop;
}

const BabershopItem = ({ babershop }: BabershopItemProps) => {
    const imageSrc =
        babershop.imageUrl && babershop.imageUrl.trim().length > 0
            ? babershop.imageUrl
            : "/hero.png";

    return ( 
        <Link href={`/barbershops/${babershop.id}`} className="relative rounded-xl min-h-[200px] min-w-[290px]">
            <div className="bg-linear-to-t absolute top-0 left-0 h-full w-full from-black to-transparent z-10 rounded-lg" />
            <Image src={imageSrc} alt={babershop.name} fill className="rounded-xl object-cover"/>
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-background text-lg font-bold">{babershop.name}</h3>
                <p className="text-background text-xs">{babershop.address}</p>            
            </div>
        </Link>
     );
}
 
export default BabershopItem;