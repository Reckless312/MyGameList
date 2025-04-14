import {NextResponse} from "next/server";

const allowedOrigins = process.env.NODE_ENV === "production"
    ? ['https://my-game-list-sand.vercel.app']
    : ['http://localhost:3000', 'https://www.google.com']

export function middleware(request: Request)
{
    const origin = request.headers.get("origin");
    console.log(origin);
    console.log(allowedOrigins);

    if (origin && !allowedOrigins.includes(origin))
    {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request",
            headers: {
                'Access-Control-Allow-Origin': `${allowedOrigins}`,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })
    }

    console.log(request.method);
    console.log(request.url);

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
}