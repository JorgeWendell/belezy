import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return ( 
    <header className="flex justify-between items-center px-2 py-4">
        <Link href="/">
            <Image src="/header.png" alt="Belezy" width={200} height={100} />
        </Link>
    </header> );
}
 
export default Header;