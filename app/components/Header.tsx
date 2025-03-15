import React from 'react'
import Image from "next/image";
import {signIn, signOut} from "@/auth";
import MenuComponent from "@/app/components/MenuComponent";
import Link from "next/link";

const Header = async (props: {session: { user?: { name?: string; image?: string } } | null }) => {
    return (
        <header>
            <nav className="flex justify-between">
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={144} height={30} />
                </Link>
                <div className="flex items-center text-white">
                    {props.session && props.session.user ? (
                        <>
                            <div className="flex items-center px-2">
                                <MenuComponent image={<Image src="/menu.png" alt="menu drop down" width={30} height={30}></Image>}
                                               label="Others"
                                               option="My list"/>
                                <span>{props.session?.user?.name}</span>
                                <MenuComponent image={<Image src="/arrow_drop_down.png" alt="menu drop down" width={30} height={30}></Image>}
                                               label="My account"
                                               option={
                                                    <form action={async () => {
                                                        "use server";
                                                        await signOut({redirectTo: "/"});
                                                        }}>
                                                        <button type="submit">
                                                        Logout
                                                        </button>
                                                    </form>}/>
                                <Image src={props.session?.user?.image || "/logo.png"} alt="profile picture" width={30} height={30}></Image>
                            </div>
                        </>
                    ) : (
                        <form action={async () => {
                            "use server";
                            await signIn('github');
                        }}>
                            <button className="text-white m-1 bg-green-400 px-8 py-0.5 rounded-2xl cursor-pointer" type="submit">
                                Login
                            </button>
                        </form>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Header;