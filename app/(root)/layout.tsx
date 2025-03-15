import Header from "@/app/components/Header";
import '@/app/globals.css'
import { inter } from '@/app/ui/fonts';
import Footer from "@/app/components/Footer";
import React from "react";
import {auth} from "@/auth";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    return (
        <html lang="en">
            <body>
                <main className={`${inter.className} antialiased min-h-screen bg-black`}>
                    <Header session={session ? { user: { name: session.user?.name ?? undefined, image: session.user?.image ?? undefined } } : null}/>
                    {children}
                    <Footer />
                </main>
            </body>
        </html>
    )
}