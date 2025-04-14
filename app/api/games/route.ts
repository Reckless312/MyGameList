import {NextResponse} from "next/server";
import {getPool} from "@/lib/data"
import {gameSchema} from "@/lib/zodSchema"
import {Game} from "@/app/components/GamesContext";

export async function GET(request: Request){
    const origin = request.headers.get("origin");

    const client = await getPool().connect();
    const selectQuery = "SELECT * FROM GAMES";

    try
    {
        const res = await client.query(selectQuery);
        client.release();

        return new NextResponse(JSON.stringify(res.rows), {
            headers: {
                'Access-Control-Allow-Origin': origin || "*",
                'Content-Type': 'application/json',
            }
        });
    }
    catch
    {
        client.release();
        return NextResponse.json({message: "Error happened while retrieving games"}, {status: 500});
    }
}

export async function DELETE(request: Request){
    const {id} : Partial<Game> = await request.json();

    if (id == undefined)
    {
        return NextResponse.json({message: "Game id required"}, {status: 400});
    }

    const client = await getPool().connect();
    try
    {
        const selectCheckQuery = `SELECT * FROM GAMES WHERE id = $1`;
        const res = await client.query(selectCheckQuery, [id]);

        if (res.rowCount == 0)
        {
            return NextResponse.json({message: "Game id not found!"}, {status: 401})
        }

        const deleteQuery = `DELETE FROM GAMES WHERE id = $1`;
        await client.query(deleteQuery, [id]);
        client.release();

        return NextResponse.json({message: "Game deleted successfully"});
    }
    catch
    {
        client.release();
        return NextResponse.json({message: "Error happened while deleting game"}, {status: 500});
    }
}

export async function POST(request: Request){
    const jsonBody = await request.json();
    const validation = gameSchema.safeParse(jsonBody);

    const {name, description, image, releaseDate, price, tag} : Partial<Game> = jsonBody;

    if (name == undefined || description == undefined || image == undefined || releaseDate == undefined || price == undefined || tag == undefined)
    {
        return NextResponse.json({message: "Missing required fields"}, {status: 404});
    }

    if (!validation.success){
        return NextResponse.json({message: "Validation for input failed!"}, {status: 400});
    }

    const client = await getPool().connect();
    try
    {
        const selectCheckQuery = `SELECT id FROM GAMES WHERE name = $1`;
        const res = await client.query(selectCheckQuery, [name]);

        if (res.rowCount && res.rowCount > 0)
        {
            return NextResponse.json({message: "Game already found with same critical information"} , {status: 401})
        }

        const insertQuery = `INSERT INTO GAMES(name, description, image, "releaseDate", price, tag) VALUES ($1, $2, $3, $4, $5, $6)`;
        await client.query(insertQuery, [name, description, image, releaseDate, price, tag]);

        client.release();
        return NextResponse.json({message: "Game created successfully"});
    }
    catch(error)
    {
        console.log(error);
        client.release();
        return NextResponse.json({message: "Error happened while creating game"} , {status: 500});
    }
}


export async function PATCH(request: Request){
    const jsonBody = await request.json();
    const validation = gameSchema.safeParse(jsonBody);

    const {id, name, description, image, releaseDate, price, tag} : Game = jsonBody;

    if (id == undefined || name == undefined || description == undefined || image == undefined || releaseDate == undefined || price == undefined || tag == undefined)
    {
        console.log(id, name, description, image, releaseDate, price, tag);
        return NextResponse.json({message: "Missing required fields"}, {status: 401});
    }

    if (!validation.success)
    {
        return NextResponse.json({message: "Validation for input failed!"}, {status: 400});
    }

    const client = await getPool().connect();
    try
    {
        const selectCheckQuery = `SELECT * FROM GAMES WHERE id = $1`;
        const res = await client.query(selectCheckQuery, [id]);

        if (res.rowCount == 0)
        {
            return NextResponse.json({message: "Game id not found!"} , {status: 402})
        }

        const selectCheckQuery2 = `SELECT * FROM GAMES WHERE name = $1`;
        const res2 = await client.query(selectCheckQuery2, [name]);

        if (res2.rowCount && res2.rowCount > 0 && res.rows && res.rows[0].id != id)
        {
            return NextResponse.json({message: "Game already found with same critical information"} , {status: 403})
        }

        const updateQuery = `UPDATE GAMES SET name = $1, description = $2, image = $3, "releaseDate" = $4, price = $5, tag = $6 WHERE id = $7`;
        await client.query(updateQuery, [name, description, image, releaseDate, price, tag, id]);
        client.release();

        return NextResponse.json({message: "Game updated successfully"});
    }
    catch
    {
        client.release();
        return NextResponse.json({message: "Error happened while updating the game"} , {status: 500});
    }
}
