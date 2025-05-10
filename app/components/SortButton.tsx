'use client'

import {Button} from "@/components/ui/button";
import React from "react";
import {useGames} from "@/app/components/GamesContext";

const SortButton = () => {
    const {sortGamesByName, sortGamesByPrice} = useGames() ?? {};

    return (
        <div className="space-x-10">
            <Button className="bg-cyan-500 w-40 on hover:bg-cyan-900" variant="default" onClick={() => {
                sortGamesByName?.();
            }}>Sort By Name</Button>
            <Button className="bg-cyan-500 w-40 on hover:bg-cyan-900" variant="default" onClick={() => {
                sortGamesByPrice?.();
            }}>Sort By Price</Button>
        </div>
    )
}

export default SortButton;