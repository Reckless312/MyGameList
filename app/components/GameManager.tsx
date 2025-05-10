'use client'

import {useEffect, useState} from "react";
import {useGames} from "@/app/components/GamesContext";
import { useStatus } from "@/app/components/ApplicationStatusContext";

function rezolveDescriptionsAndImages (games: any){
    const mergedGames = []
    for(const game of games) {
        // Bug: Usually they should have at least one game description / image, but some don't ?
        if (game.GAME_DESCRIPTIONs[0] && game.GAME_IMAGEs[0]){
            const description = game.GAME_DESCRIPTIONs[0].description;
            const image = game.GAME_IMAGEs[0].image;
            mergedGames.push({"id": game.id, "name": game.name, "description": description, "image": image, "price": game.price, "tag": game.tag, "releaseDate": game.releaseDate});
        }
    }
    return mergedGames;
}

export {rezolveDescriptionsAndImages};

export default function GameManager() {
    const { games, addMultipleGames, checkGame, setNewGames, fetchGameByName, getRemovableGames, setNewRemovableGames} = useGames() || {};
    const { isNetworkUp, isServerUp } = useStatus() || {};
    const [areGamesFetched, setGamesFetched] = useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/games`);
                const games = await response.json();
                addMultipleGames?.(rezolveDescriptionsAndImages(games));
            } catch (e) {
                console.error(e);
            }
        };

        fetchGames().then(() => {setGamesFetched(true);});
    }, []);

    useEffect(() => {
        const updateDatabase = async () => {
            if (isServerUp && isNetworkUp && areGamesFetched) {
                const newGames = [];
                for (const game of games || []) {

                    const isGameOnServer = await checkGame?.(game);

                    if (!isGameOnServer && game) {
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
                        });

                        // Need the new id
                        const newGame = await fetchGameByName?.(game.name);
                        if (newGame !== undefined) {
                            newGames.push(newGame);
                        }
                    }
                    else{
                        await fetch(`http://localhost:8080/api/games`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({id: game.id, name: game.name, description: game.description, image: game.image, releaseDate: game.releaseDate, price: game.price, tag: game.tag}),
                        });

                        // Hopefully no games with id = -1 pass through here
                        newGames.push(game);
                    }
                }

                const removableGames = getRemovableGames?.();
                for (const game of removableGames || []) {
                    await fetch(`http://localhost:8080/api/games`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({id: game.id}),
                    });
                }
                setNewRemovableGames?.([]);
                setNewGames?.(newGames);
            }
        }

        updateDatabase().then(() => {});
    }, [isServerUp, isNetworkUp]);
    return null;
}