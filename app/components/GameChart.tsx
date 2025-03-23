"use client"

import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import {type ChartConfig, ChartContainer} from '@/components/ui/chart'
import {useGames} from '@/app/components/GamesContext'
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


const chartConfig: ChartConfig = {
    numberOfGames:{
        label: "Number of Games",
        color: "#2F25B1",
    }
} satisfies ChartConfig

export function GameChart() {
    const {games = []} = useGames() || {};

    let gamesIn1990, gamesIn2000, gamesIn2010, gamesAfter2020;

    gamesIn1990 = games.filter((game) => game.releaseDate < "2000" && game.releaseDate >= "1990").length;
    gamesIn2000 = games.filter((game) => game.releaseDate < "2010" && game.releaseDate >= "2000").length;
    gamesIn2010 = games.filter((game) => game.releaseDate < "2020" && game.releaseDate >= "2010").length;
    gamesAfter2020 = games.filter((game) => game.releaseDate >= "2020").length;

    const chartData = [
        { time: "1990-1999", numberOfGames: gamesIn1990 },
        { time: "2000-2009", numberOfGames: gamesIn2000 },
        { time: "2010-2019", numberOfGames: gamesIn2010 },
        { time: "2020+", numberOfGames: gamesAfter2020 },
    ]

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-1/4">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="time"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="numberOfGames" fill={chartConfig.numberOfGames.color} radius={4} />
            </BarChart>
        </ChartContainer>
    )
}