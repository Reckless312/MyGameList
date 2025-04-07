import {NextResponse} from "next/server";
import {Pool} from "pg";
import {createOriginalPool} from "@/app/api/games/route";

let pool = createOriginalPool();

export const setPool = (newPool: Pool) => {
    pool = newPool;
}

export async function GET(){
    const client = await pool.connect();
    const selectQuery = "SELECT * FROM GAMES ORDER BY name";

    try
    {
        const res = await client.query(selectQuery);

        return NextResponse.json(res.rows);
    }
    catch
    {
        return NextResponse.json({message: "Error happened while retrieving games"}, {status: 500});
    }
    finally
    {
        client.release();
    }
}