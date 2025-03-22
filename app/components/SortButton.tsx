'use client'

import {Button} from "@/components/ui/button";
import React from "react";
import {useGames} from "@/app/components/GamesContext";

const SortButton = () => {
    const {sortGames} = useGames() ?? {};

    return (
        <Button className="bg-cyan-500 w-40 on hover:bg-cyan-900" variant="default" onClick={() => {
            sortGames?.();
        }}>Sort</Button>
    )
}

export default SortButton;