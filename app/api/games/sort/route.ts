import {NextResponse} from "next/server";
import {getPool} from "@/lib/data"

export async function GET(){
    const client = await getPool().connect();
    const selectQuery = "SELECT * FROM GAMES ORDER BY name";

    try
    {
        const res = await client.query(selectQuery);
        client.release();

        return NextResponse.json(res.rows);
    }
    catch
    {
        client.release();
        return NextResponse.json({message: "Error happened while retrieving games"}, {status: 500});
    }
}