import {NextResponse} from "next/server";
import {getPool} from "@/lib/data"

export async function POST(request: Request){
    const {name} : Partial<Game> = await request.json();

    if (!name)
    {
        return NextResponse.json({message: "Missing required fields"}, {status: 404});
    }

    const client = await getPool().connect();
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