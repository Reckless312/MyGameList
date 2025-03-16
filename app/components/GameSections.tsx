'use client'

import React from 'react';
import GameCard from "@/app/components/GameCard";
import {useGames} from "@/app/components/GamesContext";

const GameSections = ({query}: {query: string}) => {
    const {games = []} = useGames() || {};

    return (
        <>
            <section className="section_container text-white">
                <p className="text-white items-center flex justify-center text-2xl font-bold m-5">
                    {query ? `Search results for "${query}"` : "All games"}
                </p>

                <ul className="mt-7 card_grid">
                    {games.length > 0 ? (
                        games.filter(game => game.name.toLowerCase().includes(query.toLowerCase()))
                        .map((game, index: number) => (
                            <GameCard key={index} game={game}/>
                        ))
                    ) : (
                        <p>No games found</p>
                    )}
                </ul>
            </section>
        </>
    )
}

export default GameSections;