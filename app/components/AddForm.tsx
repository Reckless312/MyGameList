'use client'

import React, {useState} from 'react';
import Form from "next/form";
import InputComponent from "@/app/components/InputComponent";
import {useGames} from "@/app/components/GamesContext";
import {useRouter} from "next/navigation";

const AddForm = ({query} : {query ? : string}) => {
    const {addGame} = useGames() ?? {};
    const [game, setGame] = useState({
        id: Date.now(),
        name: "Baldur's Gate 3",
        description: "Baldur’s Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg?t=1740386911",
        releaseDate: "3 Aug, 2023",
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGame({...game, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addGame?.(game);
        router.push("/");
    }

    return (
        <Form onSubmit={handleSubmit}  action="/app" scroll={false} className="text-white flex flex-col items-center gap-y-4 bg-blue-950 rounded-md">
            <div className="flex flex-col gap-y-4 py-4">
                <div className="flex items-center gap-x-4">
                    <InputComponent name={"id"} value={game.id} onChange={handleChange} placeholder={"ID"} query={query}/>
                </div>
                <div className="flex items-center gap-x-4">
                    <InputComponent name={"name"} value={game.name} onChange={handleChange} placeholder={"Name"} query={query}/>
                </div>
                <div className="flex items-center gap-x-4">
                    <InputComponent name={"description"} value={game.description} onChange={handleChange} placeholder={"Description"} query={query}/>
                </div>
                <div className="flex items-center gap-x-4">
                    <InputComponent name={"image"} value={game.image} onChange={handleChange} placeholder={"Image"} query={query}/>
                </div>
                <div className="flex items-center gap-x-4">
                    <InputComponent name={"releaseDate"} value={game.releaseDate} onChange={handleChange} placeholder={"Release Date"} query={query}/>
                </div>
                <div className="add-button flex items-center justify-center bg-green-400 rounded-md">
                    <button className="w-full h-full cursor-pointer" type="submit">
                        Add
                    </button>
                </div>
            </div>
        </Form>
    )
}

export default AddForm;