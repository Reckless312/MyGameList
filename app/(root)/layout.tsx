import Header from "@/app/components/Header";
import '@/app/globals.css'
import { inter } from '@/app/ui/fonts';
import Footer from "@/app/components/Footer";
import React from "react";
import {auth} from "@/auth";
import {GamesProvider} from "@/app/components/GamesContext";
import {ApplicationStatusProvider} from "@/app/components/ApplicationStatusContext";
import ServerAndNetworkStatus from "@/app/components/ServerAndNetworkStatus";
import GameManager from "@/app/components/GameManager";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-black">
                <main className={`${inter.className} antialiased flex-1 flex flex-col`}>
                    <ApplicationStatusProvider>
                        <GamesProvider>
                            <Header session={session ? { user: { name: session.user?.name ?? undefined, image: session.user?.image ?? undefined } } : null}/>
                            <div className="flex-1 bg-black">{children}</div>
                            <Footer />
                            <GameManager session={session ? { user: { name: session.user?.name ?? undefined, image: session.user?.image ?? undefined, email: session.user?.email ?? undefined } } : null}/>
                            <ServerAndNetworkStatus/>
                        </GamesProvider>
                    </ApplicationStatusProvider>
                </main>
            </body>
        </html>
    )
}