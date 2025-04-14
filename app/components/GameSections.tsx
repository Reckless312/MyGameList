'use client'

import React, {useEffect, useState, useRef} from 'react';
import GameCard from "@/app/components/GameCard";
import {useGames} from "@/app/components/GamesContext";
import {GameChart} from "@/app/components/GameChart";
import {useSearchParams} from "next/navigation";

const GameSections = ({query}: {query: string}) => {
    const {games = [], getOldestGame, getEarliestGame, getAverageGameByDate} = useGames() || {};

    const oldestGame = getOldestGame?.();
    const earliestGame = getEarliestGame?.();
    const averageGameByDate = getAverageGameByDate?.();

    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;
    const itemsOnPage = 10;

    const [visibleItems, setVisibleItems] = useState(currentPage * 10);
    const loaderRef = useRef(null);

    const foundGames = games.filter(game => game.name.toLowerCase().includes(query.toLowerCase()))
    const gamesOnPage = foundGames.slice(0, visibleItems);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const target = entries[0];
                if (target.isIntersecting && gamesOnPage.length < foundGames.length) {
                    setVisibleItems(prev => prev + itemsOnPage);
                }
            }, {threshold: 1}
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current)
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        }
    }, [gamesOnPage.length, foundGames.length])

    return (
        <>
            <GameChart/>
            <section className="section_container text-white">
                <p className="text-white items-center flex justify-center text-2xl font-bold m-5">
                    {query ? `Search results for "${query}"` : "All games"}
                </p>
                <ul className="mt-7 card_grid">
                    {gamesOnPage.length > 0 ? (gamesOnPage.map((game) =>
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

                {gamesOnPage.length < foundGames.length && (
                    <div ref={loaderRef} className="flex justify-center items-center py-4 mt-4">
                        <span className="text-gray-400">Scroll for more</span>
                    </div>
                )}

                {gamesOnPage.length > 0 && gamesOnPage.length === foundGames.length && (
                    <p className="text-center text-gray-400 mt-4 mb-8">
                        {foundGames.length} {foundGames.length === 1 ? 'game' : 'games'} found
                    </p>
                )}
            </section>
        </>
    )
}

export default GameSections;