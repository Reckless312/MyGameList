import SearchForm from "@/app/components/SearchForm";
import Link from "next/link";

const PagesNavigation = ( {query}: {query?: string}) => {
    return (
        <div>
            <div className="bg-[#2F25B1] p-3 text-white flex justify-between items-center">
                <nav className="space-x-10">
                    <Link href="/add">
                        <span>Add</span>
                    </Link>
                </nav>
                <SearchForm query={query}/>
            </div>
        </div>
    )
}

export default PagesNavigation;