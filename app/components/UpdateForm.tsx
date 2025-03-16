'use client'

import React, {useState, useRef} from 'react';
import Form from "next/form";
import InputComponent from "@/app/components/InputComponent";
import {useGames} from "@/app/components/GamesContext";
import {useRouter, useSearchParams} from "next/navigation";
import {z, ZodFormattedError} from "zod"


const schema = z.object({
    name: z.string().min(3, "Name must be a string with at least 3 characters"),
    description: z.string().min(10, "Description must be a string with at least 10 characters"),
    image: z.string().url("Invalid image url"),
    releaseDate: z.string().min(4, "Release date must be a string with at least 4 characters"),
})

const UpdateForm = ({query} : {query ? : string}) => {
    const searchParams = useSearchParams();

    const {updateGame} = useGames() ?? {};
    const [game, setGame] = useState({
        name: searchParams.get("name") ?? "",
        description: searchParams.get("description") ?? "",
        image: searchParams.get("image") ?? "",
        releaseDate: searchParams.get("releaseDate") ?? "",
    });

    const gameTitle = useRef(game.name)

    const[errors, setErrors] = useState<ZodFormattedError<{name: string, description: string, image: string, releaseDate: string}>>();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGame({...game, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = schema.safeParse(game);

        if(!result.success){
            setErrors(result.error.format());
            return;
        }

        updateGame?.(gameTitle.current, game);
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
                <div className="add-button flex items-center justify-center bg-green-400 rounded-md">
                    <button className="w-full h-full cursor-pointer" type="submit">
                        Update
                    </button>
                </div>
            </div>
        </Form>
    )
}

export default UpdateForm;