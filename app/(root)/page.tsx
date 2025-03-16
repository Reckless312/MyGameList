import PagesNavigation from "@/app/components/PagesNavigation";
import React from "react";
import GameSections from "@/app/components/GameSections";

export default async function Home({searchParams}: {
    searchParams: Promise<{query? : string}>}) {

    const query = (await searchParams).query ?? "";

    return (
    <>
        <PagesNavigation query={query ?? ""}/>
        <GameSections query={query ?? ""}/>
    </>
  );
}
