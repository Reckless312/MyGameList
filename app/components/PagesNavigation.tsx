import SearchForm from "@/app/components/SearchForm";

const PagesNavigation = ( {query}: {query?: string}) => {
    return (
        <div>
            <div className="bg-[#2F25B1] p-3 text-white flex justify-between items-center">
                <nav className="space-x-10">
                    <span>Add</span>
                    <span>Delete</span>
                    <span>Update</span>
                </nav>
                <SearchForm query={query}/>
            </div>
        </div>
    )
}

export default PagesNavigation;