'use client'

import React, {createContext, useState, useContext, ReactNode} from "react";
import {useStatus} from "@/app/components/ApplicationStatusContext";

export type Game = {
    id: number;
    name: string;
    description: string;
    image: string;
    releaseDate: string;
    price: number;
    tag: string;
}

type GamesContextType = {
    games: Game[];
    addGame: (newGame: Game) => Promise<void>;
    addMultipleGames: (games: Game[]) => void;
    removeGame: (removableGame: Game) => Promise<void>;
    checkGame: (game: Game) => Promise<boolean>;
    checkGameLocally: (game: Game) => boolean;
    updateGame: (gameTitle: string | null, updatedGame: Game) => Promise<void>;
    sortGamesByName: () => void;
    sortGamesByPrice: () => void;
    getOldestGame: () => Game | undefined;
    getEarliestGame: () => Game | undefined;
    getAverageGameByDate: () => Game | undefined;
    setNewGames: (games: Game[]) => void;
    fetchGameByName: (name: string) => Promise<Game>;
    setNewRemovableGames: (games: Game[]) => void;
    getRemovableGames: () => Game[];
}

let sortByNameAscending = true;
let sortByPriceAscending = true;

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesProvider({children, session}: {children: ReactNode; session: { user?: { name?: string; image?: string; email?: string } } | null}) {
    const [games, setGames] = useState<Game[]>([]);
    const [removableGames, setRemovableGames] = useState<Game[]>([]);
    const { isNetworkUp, isServerUp } = useStatus() || {};

    const addGame = async (game: Game) => {
        if (isServerUp && isNetworkUp) {
            const similarGames = await fetchGameByName(game.name);
            console.log(similarGames);

            for (const foundGame of similarGames) {
                if (foundGame.name === game.name) {
                    return;
                }
            }

            await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
            });
            const foundGame = await fetchGameByName(game.name);
            game.id = foundGame.id;
            console.log(foundGame);

            fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/actions/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: session?.user?.name, time: new Date().toLocaleTimeString()}),
            }).then(() => {});
            console.log("done");
        }

        setGames([...games, game]);
    }

    const addMultipleGames = (newGames: Game[]) => {
        setGames([...games, ...newGames]);
    }

    const removeGame = async (game: Game) => {
        if (isServerUp && isNetworkUp) {
            await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: game.id}),
            });

            fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/actions/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: session?.user?.name, time: new Date().toLocaleTimeString()}),
            }).then(() => {});
        }
        else{
            setRemovableGames([...removableGames, game]);
        }

        setGames([...games.filter((inListGame) => inListGame.name !== game.name)]);
    }

    const checkGame = async (game: Game) => {
        if(isServerUp && isNetworkUp) {
            const foundGame = await fetchGameById(game.id);
            return foundGame !== null;
        }
        return checkGameLocally(game);
    }

    const checkGameLocally = (game: Game) => {
        return games.filter((inListGame) => inListGame.name === game.name).length > 0;
    }

    const updateGame = async (gameTitle: string | null, updatedGame: Game) => {
        if (isServerUp && isNetworkUp) {
            const similarGames = await fetchGameByName(updatedGame.name);

            for (const foundGame of similarGames) {
                if (foundGame.name === gameTitle) {
                    return;
                }
            }

            await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedGame),
            });

            fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/actions/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: session?.user?.name, time: new Date().toLocaleTimeString()}),
            }).then(() => {});
        }
        setGames(games.map((inListGame) => inListGame.name === gameTitle ? updatedGame : inListGame));
    }

    const sortGamesByName = () => {
        const sortedGames = [...games];

        switch(sortByNameAscending){
            case true:
                sortedGames.sort((a, b) => a.name.localeCompare(b.name))
                break;
            case false:
                sortedGames.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        setGames(sortedGames);

        sortByNameAscending = !sortByNameAscending;
    }

    const sortGamesByPrice = () => {
        const sortedGames = [...games];

        switch(sortByPriceAscending){
            case true:
                sortedGames.sort((a, b) => a.price - b.price);
                break;
            case false:
                sortedGames.sort((a, b) => b.price - a.price);
                break;
        }
        setGames(sortedGames);
        sortByPriceAscending = !sortByPriceAscending;
    }

    const getOldestGame = () => {
        const localGames = [...games];
        if(localGames.length == 0) {
            return undefined;
        }

        return localGames.reduce((maxGame, currentGame) => maxGame.releaseDate > currentGame.releaseDate ? currentGame : maxGame, games[0])
    }

    const getEarliestGame = () => {
        const localGames = [...games];
        if(localGames.length == 0) {
            return undefined;
        }
        return localGames.reduce((minGame, currentGame) => minGame.releaseDate < currentGame.releaseDate ? currentGame : minGame, games[0])
    }

    const getAverageGameByDate = () => {
        const localGames = [...games];
        if(localGames.length == 0) {
            return undefined;
        }

        return localGames.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)).at(Math.floor(localGames.length / 2));
    }

    const fetchGameById = async (id: number) => {
        const response = await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games/filter/id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id}),
        });
        return await response.json();
    }

    const fetchGameByName = async (name: string) => {
        const response = await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name}),
        });
        return await response.json();
    }

    const setNewGames = (newGames: Game[]) => {
        setGames(newGames);
    }

    const getRemovableGames = () => {
        return removableGames;
    }

    const setNewRemovableGames = (games: Game[])=> {
        setRemovableGames(games);
    }

    return (
        <GamesContext.Provider value={{games, addGame, addMultipleGames, removeGame, checkGame, updateGame, sortGamesByName, sortGamesByPrice, getOldestGame, getEarliestGame, getAverageGameByDate, setNewGames, fetchGameByName, getRemovableGames, setNewRemovableGames, checkGameLocally}}>
            {children}
        </GamesContext.Provider>
    );
}

export function useGames() {
    const context = useContext(GamesContext);
    if (!context) {
        console.error("useGames must be used within a GamesProvider");
    }
    return context;
}