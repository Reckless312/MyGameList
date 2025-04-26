'use client'

import { useEffect } from "react";
import {Game, useGames} from "@/app/components/GamesContext";
import { useStatus } from "@/app/components/ApplicationStatusContext";

export default function GameManager() {
    const { games, addMultipleGames } = useGames() || {};
    const { isNetworkUp, isServerUp } = useStatus() || {};

    let initialGameFetch = false;

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/games");
                const games = await response.json();
                addMultipleGames?.(games);
                initialGameFetch = true;
            } catch (e) {
                console.error(e);
            }
        };

        fetchGames().then(() => {});
    }, []);

    useEffect(() => {
        const updateDatabase = async () => {
            if (isServerUp && isNetworkUp && initialGameFetch) {
                const response = await fetch("http://localhost:8080/api/games");
                const serverGames = await response.json();

                for (const game of games || []) {
                    console.log(game);

                    const isGameOnServer = serverGames.find((serverGame: Game) => serverGame.id == game.id);

                    if (!isGameOnServer) {
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'POST',
                            body: JSON.stringify({name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
                        });
                    }
                    else{
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'PATCH',
                            body: JSON.stringify({id: game.id, name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
                        });
                    }
                }

                for (const serverGame of serverGames || []) {
                    const isServerGameLocally = games?.find((localGame: Game) => localGame.id == serverGame.id);

                    if (isServerGameLocally === undefined) {
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'DELETE',
                            body: JSON.stringify({id: serverGame.id}),
                        });
                    }
                }
            }
        }

        updateDatabase().then(() => {});
    }, [isServerUp, isNetworkUp]);
    return null;
}