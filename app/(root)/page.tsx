import PagesNavigation from "@/app/components/PagesNavigation";
import React from "react";

export default async function Home({searchParams}: {
    searchParams: Promise<{query? : string}>}) {

    const query = (await searchParams).query

    return (
    <>
        <div className="bg-black h-full">
            <PagesNavigation query={query}/>
        </div>
    </>
  );
}
