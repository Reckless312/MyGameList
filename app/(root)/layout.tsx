import Header from "@/app/components/Header";
import '@/app/globals.css'
import { inter } from '@/app/ui/fonts';
import Footer from "@/app/components/Footer";
import React from "react";
import {auth} from "@/auth";
import {GamesProvider} from "@/app/components/GamesContext";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-black">
                <main className={`${inter.className} antialiased flex-1 flex flex-col`}>
                    <GamesProvider>
                        <Header session={session ? { user: { name: session.user?.name ?? undefined, image: session.user?.image ?? undefined } } : null}/>
                        <div className="flex-1 bg-black">{children}</div>
                        <Footer />
                    </GamesProvider>
                </main>
            </body>
        </html>
    )
}