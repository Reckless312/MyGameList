import {NextResponse} from "next/server";
import {Pool} from "pg";
import {createOriginalPool} from "@/app/api/games/route";

let pool = createOriginalPool();

export const setPool = (newPool: Pool) => {
    pool = newPool;
}

export async function POST(request: Request){
    const {name} : Partial<Game> = await request.json();

    if (!name)
    {
        return NextResponse.json({message: "Missing required fields"}, {status: 404});
    }

    const client = await pool.connect();
    try
    {
        const selectCheckQuery = `SELECT * FROM GAMES WHERE LOWER(name) LIKE '%' || LOWER($1) ||'%'`;
        const res = await client.query(selectCheckQuery, [name]);

        return NextResponse.json({rows: res.rows});
    }
    catch
    {
        return NextResponse.json({message: "Error happened while filtering games"}, {status: 500});
    }
    finally
    {
        client.release();
    }
}