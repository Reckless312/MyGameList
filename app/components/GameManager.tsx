'use client'

import {useEffect, useState} from "react";
import {Game, useGames} from "@/app/components/GamesContext";
import { useStatus } from "@/app/components/ApplicationStatusContext";

export default function GameManager() {
    const { games, addMultipleGames } = useGames() || {};
    const { isNetworkUp, isServerUp } = useStatus() || {};
    const [areGamesFetched, setGamesFetched] = useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/games");
                const games = await response.json();
                addMultipleGames?.(games);
            } catch (e) {
                console.error(e);
            }
        };

        fetchGames().then(() => {setGamesFetched(true);});
    }, []);

    useEffect(() => {
        const updateDatabase = async () => {
            if (isServerUp && isNetworkUp && areGamesFetched) {
                const response = await fetch("http://localhost:8080/api/games");
                const serverGames = await response.json();

                for (const game of games || []) {
                    const isGameOnServer = serverGames.some((serverGame: Game) => serverGame.id == game.id);

                    if (!isGameOnServer) {
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
                        });
                    }
                    else{
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({id: game.id, name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
                        });
                    }
                }

                for (const serverGame of serverGames || []) {
                    const isServerGameLocally = games?.some((localGame: Game) => localGame.id == serverGame.id);

                    if (!isServerGameLocally) {
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
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