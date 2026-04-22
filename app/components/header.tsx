 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, HomeIcon, LogInIcon, MenuIcon } from "lucide-react";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

const Header = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { data: session, isPending } = authClient.useSession();

    const userName = session?.user?.name ?? "Usuario";
    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const handleLogin = async () => {
        const { data, error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            disableRedirect: true,
        });

        if (error) {
            console.error("Erro no login Google:", error);
            toast.error("Nao foi possivel iniciar login com Google.", {
                description: error.message ?? "Tente novamente em instantes.",
            });
            return;
        }

        if (data?.url) {
            window.location.href = data.url;
        }
    };

    const handleLogout = async () => {
        const { error } = await authClient.signOut();

        if (error) {
            toast.error("Nao foi possivel sair da conta.");
            return;
        }

        toast.success("Logout realizado com sucesso.");
    };

    return ( 
    <header className="flex justify-between items-center px-5 py-0 bg-white ">
            <Image src="/header.png" alt="Belezy" width={200} height={100} />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MenuIcon />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                       
                    </SheetHeader>
                    <div className="mt-4">
                        {isPending ? (
                            <span className="text-sm text-muted-foreground">Carregando...</span>
                        ) : session?.user ? (
                            <div className="flex items-start gap-3 p-4">
                                <Avatar>
                                    <AvatarImage src={session.user.image ?? undefined} alt={userName} />
                                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="truncate text-sm font-medium">{userName}</span>
                                        <Button variant="outline" size="sm" onClick={handleLogout}>
                                            Sair
                                        </Button>
                                    </div>
                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border p-4">
                                <div className="mt-1 flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-foreground">
                                        Ola, faca seu login
                                    </p>
                                    <Button className="gap-2" onClick={handleLogin}>
                                        <LogInIcon className="size-4" />
                                        Fazer login
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="my-4 h-px bg-border" />
                    <div className="mt-4 grid gap-2">
                        <Button asChild variant="ghost" className="justify-start gap-2">
                            <Link href="/" onClick={() => setIsSheetOpen(false)}>
                                <HomeIcon className="size-4" />
                                Inicio
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start gap-2">
                            <Link href="/bookings" onClick={() => setIsSheetOpen(false)}>
                                <CalendarDaysIcon className="size-4" />
                                Agendamentos
                            </Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        
    </header> );
}
 
export default Header;