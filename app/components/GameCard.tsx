import React from 'react';
import Image from "next/image";
import {useGames} from "@/app/components/GamesContext";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button"

const GameCard = ({game, background}: {game: { image: string; name: string; description: string; releaseDate: string }, background: string}) => {
    const {removeGame} = useGames() ?? {};
    const router = useRouter();

    return (
        <li>
            <div className={`flex ${background} justify-between`}>
                <div className="flex">
                    <Image src={game.image} alt={"Image not available"} width={400} height={400}></Image>
                    <div className="ml-5 flex flex-col justify-between">
                        <h3>{game.name}</h3>
                        <p>{game.description}</p>
                        <p>{game.releaseDate}</p>
                    </div>
                </div>
                <div className="ml-5 mr-5 flex flex-col gap-y-4 items-center justify-center">
                    <Button className="bg-red-600 w-40 on hover:bg-red-950" variant="default" onClick={() => {
                        removeGame?.(game);
                    }}>Delete</Button>
                    <Button className="bg-blue-950 w-40" variant="default" onClick={() => {
                        router.push(`/update?name=${encodeURIComponent(game.name)}&description=${encodeURIComponent(game.description)}&releaseDate=${encodeURIComponent(game.releaseDate)}&image=${encodeURIComponent(game.image)}`);
                    }}>Update</Button>
                </div>
            </div>
        </li>
    )
}

export default GameCard;