'use client'

import React from 'react';
import GameCard from "@/app/components/GameCard";
import {useGames} from "@/app/components/GamesContext";

const GameSections = ({query}: {query: string}) => {
    const {games = [], getOldestGame, getEarliestGame, getAverageGameByDate} = useGames() || {};

    const oldestGame = getOldestGame?.();
    const earliestGame = getEarliestGame?.();
    const averageGameByDate = getAverageGameByDate?.();

    return (
        <>
            <section className="section_container text-white">
                <p className="text-white items-center flex justify-center text-2xl font-bold m-5">
                    {query ? `Search results for "${query}"` : "All games"}
                </p>

                <ul className="mt-7 card_grid">
                    {games.length > 0 ? (
                        games.filter(game => game.name.toLowerCase().includes(query.toLowerCase()))
                        .map((game) =>
                            {
                                let backgroundColor;
                                if (games.length < 3) {
                                    backgroundColor = 'bg-black';
                                }
                                else if (game.name === oldestGame?.name) {
                                    backgroundColor = 'bg-red-500';
                                }
                                else if (game.name === earliestGame?.name) {
                                    backgroundColor = 'bg-green-500';
                                }
                                else if (game.name === averageGameByDate?.name) {
                                    backgroundColor = 'bg-orange-500';
                                }
                                else{
                                    backgroundColor = 'bg-black';
                                }
                                return (<GameCard key={game.name} game={game} background={backgroundColor}/>);
                            }
                        )
                    ) : (
                        <p>No games found</p>
                    )}
                </ul>
            </section>
        </>
    )
}

export default GameSections;