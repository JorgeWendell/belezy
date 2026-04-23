import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
    defaultValue?: string;
}

const SearchInput = ({ defaultValue = "" }: SearchInputProps) => {
    return ( 
    <form action="/" method="get" className="flex items-center gap-2">
        <Input
            name="search"
            type="text"
            defaultValue={defaultValue}
            placeholder="Pesquise pelo nome do Salão"
            className="border-border"
        />
        <Button type="submit" variant="default" size="icon">
            <SearchIcon />
        </Button>
    </form> );
}
 
export default SearchInput;