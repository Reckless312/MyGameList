"use client"

import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import {type ChartConfig, ChartContainer} from '@/components/ui/chart'
import {useGames} from '@/app/components/GamesContext'
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartConfig: ChartConfig = {
    numberOfGames:{
        label: "Number of Games",
        color: "#2F25B1",
    }
} satisfies ChartConfig

export function GameChart() {
    const {games = []} = useGames() || {};

    const gamesReleaseDates = [0, 0, 0, 0];
    const gamesPrices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const gameTagsMap = new Map();

    games.forEach(game => {
        gamesReleaseDates[Math.floor((new Date(game.releaseDate).getFullYear() - 1990) / 10)]++;
        gamesPrices[Math.floor(game.price / 10)]++;
        if (gameTagsMap.has(game.tag)) {
            gameTagsMap.set(game.tag, gameTagsMap.get(game.tag) + 1);
        }
        else {
            gameTagsMap.set(game.tag, 1);
        }
    })

    const timeChartData = [
        { time: "1990-1999", numberOfGames: gamesReleaseDates[0]},
        { time: "2000-2009", numberOfGames: gamesReleaseDates[1]},
        { time: "2010-2019", numberOfGames: gamesReleaseDates[2]},
        { time: "2020+", numberOfGames: gamesReleaseDates[3]},
    ]

    const priceChartData = [
        { price: "0-9", numberOfGames: gamesPrices[0]},
        { price: "10-19", numberOfGames: gamesPrices[1]},
        { price: "20-29", numberOfGames: gamesPrices[2]},
        { price: "30-39", numberOfGames: gamesPrices[3]},
        { price: "40-49", numberOfGames: gamesPrices[4]},
        { price: "50-59", numberOfGames: gamesPrices[5]},
        { price: "60-69", numberOfGames: gamesPrices[6]},
        { price: "70-79", numberOfGames: gamesPrices[7]},
        { price: "80-89", numberOfGames: gamesPrices[8]},
        { price: "90-99", numberOfGames: gamesPrices[9]},
    ]

    const tagChartData = [
        { tag: "JRPG", numberOfGames: gameTagsMap.get("JRPG")},
        { tag: "RPG", numberOfGames: gameTagsMap.get("RPG")},
        { tag: "Action", numberOfGames: gameTagsMap.get("Action")},
        { tag: "FPS", numberOfGames: gameTagsMap.get("FPS")},
        { tag: "Horror", numberOfGames: gameTagsMap.get("Horror")},
        { tag: "Open World", numberOfGames: gameTagsMap.get("Open World")},
        { tag: "Multiplayer", numberOfGames: gameTagsMap.get("Multiplayer")},
        { tag: "Souls-like", numberOfGames: gameTagsMap.get("Souls-like")},
        { tag: "Farming", numberOfGames: gameTagsMap.get("Farming")},
        { tag: "Puzzle", numberOfGames: gameTagsMap.get("Puzzle")},
        { tag: "Stealth", numberOfGames: gameTagsMap.get("Stealth")},
        { tag: "Indie", numberOfGames: gameTagsMap.get("Indie")},
        { tag: "Adventure", numberOfGames: gameTagsMap.get("Adventure")},
    ]


    return (
        games.length > 0 ? (
            <div className="flex justify-between">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-1/4 border">
                    <BarChart accessibilityLayer data={timeChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="time" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="numberOfGames" fill={chartConfig.numberOfGames.color} radius={4} />
                    </BarChart>
                </ChartContainer>

                <ChartContainer config={chartConfig} className="min-h-[200px] w-1/4 border">
                    <BarChart accessibilityLayer data={priceChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="price" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="numberOfGames" fill={chartConfig.numberOfGames.color} radius={4} />
                    </BarChart>
                </ChartContainer>

                <ChartContainer config={chartConfig} className="min-h-[200px] w-2/4 border">
                    <BarChart accessibilityLayer data={tagChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="tag" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="numberOfGames" fill={chartConfig.numberOfGames.color} radius={4} />
                    </BarChart>
                </ChartContainer>
            </div>
        ) : null
    );
}