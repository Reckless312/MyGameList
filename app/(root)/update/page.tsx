import PagesNavigation from "@/app/components/PagesNavigation";
import React from "react";
import UpdateForm from "@/app/components/UpdateForm";

export default async function Home({searchParams}: {
    searchParams: Promise<{query? : string}>}) {

    const query = (await searchParams).query

    return (
        <>
            <PagesNavigation query={query}/>
            <UpdateForm/>
        </>
    );
}
