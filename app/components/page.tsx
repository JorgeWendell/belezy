export const PageContainer = ({children}: {children: React.ReactNode}) => {
    return ( <div className="p-5 space-y-4">{children}</div> );
}
 
export const PageSessionTitle = ({children}: {children: React.ReactNode}) => {
    return ( <h2 className="text-xs text-foreground font-semibold uppercase">{children}</h2> );
}

export const PageSection = ({children}: {children: React.ReactNode}) => {
    return ( <div className="space-y-4">{children}</div> );
}

export const PageSessionScrolled = ({children}: {children: React.ReactNode}) => {
    return ( <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">{children}</div> );
}

// Mantém este arquivo compatível com o App Router, já que está em app/**/page.tsx.
export default function ComponentsPage() {
    return null;
}