import SearchForm from "@/app/components/SearchForm";
import Link from "next/link";
import React from "react";
import SortButton from "@/app/components/SortButton";

let isAdmin = true;

const PagesNavigation = ( {query}: {query?: string}) => {
    return (
        <div>
            <div className="bg-[#2F25B1] p-3 text-white flex justify-between items-center">
                <div className="flex items-center justify-between space-x-10">
                    <nav>
                        <Link href="/add">
                            <span>Add</span>
                        </Link>
                    </nav>
                    <nav>
                        {isAdmin && (<Link href="/admin">
                            <span>Dashboard</span>
                        </Link>)}
                    </nav>
                </div>
                <div className="flex gap-x-4">
                    <SortButton/>
                    <SearchForm query={query}/>
                </div>
            </div>
        </div>
    )
}

export default PagesNavigation;