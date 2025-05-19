'use client'

import {useEffect, useState} from "react";
import {useGames} from "@/app/components/GamesContext";
import { useStatus } from "@/app/components/ApplicationStatusContext";
import {useRouter} from "next/navigation";

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

export default function GameManager(props: {session: { user?: { name?: string; image?: string; email?: string } } | null }) {
    const { games, addMultipleGames, checkGame, setNewGames, fetchGameByName, getRemovableGames, setNewRemovableGames} = useGames() || {};
    const { isNetworkUp, isServerUp } = useStatus() || {};
    const [areGamesFetched, setGamesFetched] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`);
                const games = await response.json();
                addMultipleGames?.(rezolveDescriptionsAndImages(games));

                const userResponse = await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/actions/name`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({name: props.session?.user?.name}),
                });

                const user = await userResponse.json();

                if (user === null){
                    fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/actions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({name: props.session?.user?.name, email: props.session?.user?.email, image: props.session?.user?.image}),
                    }).then(() => {});
                }
                else{

                }
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

                    if (!isGameOnServer) {
                        await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`, {
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
                        await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`, {
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
                    await fetch(`https://nodejs-serverless-function-express-gamma-one.vercel.app/api/games`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({id: game.id}),
                    });
                }
                setNewRemovableGames?.([]);
                setNewGames?.(newGames);
                router.push("/");
            }
        }

        updateDatabase().then(() => {});
    }, [isServerUp, isNetworkUp]);
    return null;
}