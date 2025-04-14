'use client'

import React, {createContext, useState, useContext, ReactNode} from "react";

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
    addGame: (newGame: Game) => void;
    addMultipleGames: (games: Game[]) => void;
    removeGame: (removableGame: Game) => void;
    checkGame: (game: Game) => number;
    updateGame: (gameTitle: string | null, updatedGame: Game) => void;
    sortGames: () => void;
    getOldestGame: () => Game | undefined;
    getEarliestGame: () => Game | undefined;
    getAverageGameByDate: () => Game | undefined;
}

let sortAscending = true;

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesProvider({children}: {children: ReactNode}) {
    const [games, setGames] = useState<Game[]>([]);

    const addGame = (newGame: Game) => {
        setGames([...games, newGame]);
    }

    const addMultipleGames = (newGames: Game[]) => {
        setGames([...games, ...newGames]);
    }

    const removeGame = (game: Game) => {
        setGames([...games.filter((inListGame) => inListGame.name !== game.name)]);
    }

    const checkGame = (game: Game) => {
        return games.filter((inListGame) => inListGame.name === game.name).length;
    }

    const updateGame = (gameTitle: string | null, updatedGame: Game) => {
        setGames(games.map((inListGame) => inListGame.name === gameTitle ? updatedGame : inListGame));
    }

    const sortGames = () => {
        const sortedGames = [...games];

        if(sortAscending){
            sortedGames.sort((a, b) => a.name.localeCompare(b.name))
        }
        else{
            sortedGames.sort((a, b) => b.name.localeCompare(a.name));
        }

        sortAscending = !sortAscending;
        setGames(sortedGames);
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

    return (
        <GamesContext.Provider value={{games, addGame, addMultipleGames, removeGame, checkGame, updateGame, sortGames, getOldestGame, getEarliestGame, getAverageGameByDate}}>
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