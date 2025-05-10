'use client'

import React, {useState} from 'react';
import Form from "next/form";
import InputComponent from "@/app/components/InputComponent";
import {useGames} from "@/app/components/GamesContext";
import {useRouter} from "next/navigation";
import {z, ZodFormattedError} from "zod"

const schema = z.object({
    name: z.string().min(3, "Name must be a string with at least 3 characters"),
    description: z.string().min(10, "Description must be a string with at least 10 characters"),
    image: z.string().url("Invalid image url"),
    releaseDate: z.string().date("Release date must follow YYYY-MM-DD format"),
    price: z.number().nonnegative().max(99.99, "Price must be at most 99.99 ..."),
    tag: z.string().min(3, "Tag must be a string with at least 3 characters"),
})

const AddForm = ({query} : {query ? : string}) => {
    const {addGame, checkGameLocally} = useGames() ?? {};
    const [game, setGame] = useState({
        id: -1,
        name: "Baldur's Gate 3",
        description: "Baldur’s Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg?t=1740386911",
        releaseDate: "2023-08-03",
        price: 60,
        tag: "RPG",
    });

    const[errors, setErrors] = useState<ZodFormattedError<{name: string, description: string, image: string, releaseDate: string, price: number, tag: string}>>();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGame({...game, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!isNaN(Number(game.price))){
            game.price = Number(game.price);
        }

        const result = schema.safeParse(game);

        if(!result.success){
            setErrors(result.error.format());
            return;
        }

        if (checkGameLocally?.(game)) {
            setErrors({
                _errors: errors?._errors ?? [],
                name: {
                    _errors: ["A game with this name already exists."]
                },
                description: errors?.description ?? { _errors: [] },
                image: errors?.image ?? { _errors: [] },
                releaseDate: errors?.releaseDate ?? { _errors: [] },
                price: errors?.price ?? { _errors: [] },
                tag: errors?.tag ?? { _errors: [] },
            });
            return;
        }

        await addGame?.(game);
        router.push("/");
    }

    return (
        <Form onSubmit={handleSubmit} action="/app" scroll={false} className="text-white flex flex-col items-center gap-y-4 bg-blue-950 rounded-md">
            <div className="flex flex-col gap-y-4 py-4 w-2xl">
                <div className="flex items-center gap-x-4 flex-col">
                    <InputComponent name={"name"} value={game.name} onChange={handleChange} placeholder={"Name"} query={query} />
                    {errors?.name && <span className="text-red-500">{errors.name._errors[0]}</span>}
                </div>
                <div className="flex items-center gap-x-4 flex-col">
                    <InputComponent name={"description"} value={game.description} onChange={handleChange} placeholder={"Description"} query={query} />
                    {errors?.description && <span className="text-red-500">{errors.description._errors[0]}</span>}
                </div>
                <div className="flex items-center gap-x-4 flex-col">
                    <InputComponent name={"image"} value={game.image} onChange={handleChange} placeholder={"Image"} query={query} />
                    {errors?.image && <span className="text-red-500">{errors.image._errors[0]}</span>}
                </div>
                <div className="flex items-center gap-x-4 flex-col">
                    <InputComponent name={"releaseDate"} value={game.releaseDate} onChange={handleChange} placeholder={"Release Date"} query={query} />
                    {errors?.releaseDate && <span className="text-red-500">{errors.releaseDate._errors[0]}</span>}
                </div>
                <div className="flex items-center gap-x-4 flex-col">
                    <InputComponent name={"price"} value={game.price} onChange={handleChange} placeholder={"Price"} query={query} />
                    {errors?.price && <span className="text-red-500">{errors.price._errors[0]}</span>}
                </div>
                <div className="flex items-center gap-x-4 flex-col">
                    <InputComponent name={"tag"} value={game.tag} onChange={handleChange} placeholder={"Main Tag"} query={query} />
                    {errors?.tag && <span className="text-red-500">{errors.tag._errors[0]}</span>}
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