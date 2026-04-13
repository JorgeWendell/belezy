import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const SearchInput = () => {
    return ( 
    <div className="flex items-center gap-2">
        <Input type="text" placeholder="Pesquise por serviços ou salões" className="border-border" />
        <Button variant="default" size="icon"><SearchIcon /></Button>
    </div> );
}
 
export default SearchInput;