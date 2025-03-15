import React from 'react';
import Form from "next/form";
import SearchFormReset from "@/app/components/SearchFormReset";
import Image from "next/image";

const SearchForm = ({query} : {query ? : string}) => {
    return (
        <Form action="/" scroll={false} className="search-form">
            <input
                name="query"
                defaultValue={query}
                placeholder="Search Games"
                className="search-input"
            />
            <div className="search-button">
                {query && <SearchFormReset />}

                <button type="submit">
                    <Image src="/search.png" alt="search" width={40} height={40}></Image>
                </button>
            </div>
        </Form>
    )
}

export default SearchForm;