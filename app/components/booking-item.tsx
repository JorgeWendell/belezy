import { Avatar,  AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";



interface BookingItemProps {
    serviceName: string;
    babershopName: string;
    babershopImageUrl: string;
    date: string | Date;
}

const BookingItem = ({ serviceName, babershopName, babershopImageUrl, date }: BookingItemProps) => {
    const at = date instanceof Date ? date : new Date(date);
    return ( 
   <Card className="flex flex-row items-center justify-between w-ful min-w-full p-0">
    {/*Esquerda*/}
    <div className="flex flex-col gap-4 flex-1 p-4">
        <Badge>Confirmado</Badge>
        <div className="flex flex-col gap-2">
            <p className="font-bold">{serviceName}</p>
            <div className="flex items-center gap-2 5">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={babershopImageUrl} />                    
                </Avatar>
                <p className="text-sm text-muted-foreground">{babershopName}</p>
            </div>
        </div>
    </div>
    {/*Direita*/}
    <div className="flex flex-col items-center justify-center p-6 h-full border-l py-3">
        <p className="text-xs capitalize">{at.toLocaleDateString('pt-BR', { month: 'long' })}</p>
        <p>{at.toLocaleDateString('pt-BR', { day: '2-digit' })}</p>
        <p>{at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>

    </div>
   </Card>

);
}
 
export default BookingItem; 