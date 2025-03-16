import React from 'react';
import Image from "next/image";

const GameCard = ({game}: {game: { image: string; name: string; description: string; releaseDate: string }}) => {
    return (
        <li>
            <div className="flex">
                <Image src={game.image} alt={game.name} width={500} height={400}></Image>
                <div className="ml-5 flex flex-col justify-between">
                    <h3>{game.name}</h3>
                    <p>{game.description}</p>
                    <p>{game.releaseDate}</p>
                </div>
            </div>
        </li>
    )
}

export default GameCard;