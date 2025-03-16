'use client'

import React, {createContext, useState, useContext, ReactNode} from "react";

type Game = {
    name: string;
    description: string;
    image: string;
    releaseDate: string;
}

type GamesContextType = {
    games: Game[];
    addGame: (newGame: Game) => void;
    removeGame: (removableGame: Game) => void;
    checkGame: (game: Game) => number;
    updateGame: (gameTitle: string | null, updatedGame: Game) => void;
}

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesProvider({children}: {children: ReactNode}) {
    const [games, setGames] = useState<Game[]>([{
        name: "Persona 3",
        description: "Dive into the Dark Hour and awaken the depths of your heart. Persona 3 Reload is a captivating reimagining of the genre-defining RPG, reborn for the modern era with cutting-edge graphics and gameplay. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2161700/header.jpg?t=1741697885",
        releaseDate: "2 Feb, 2024",
    }]);

    const addGame = (newGame: Game) => {
        setGames([...games, newGame]);
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

    return (
        <GamesContext.Provider value={{games, addGame, removeGame, checkGame, updateGame}}>
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