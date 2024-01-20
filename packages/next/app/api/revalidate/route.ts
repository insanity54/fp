import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token')
    const tag = request.nextUrl.searchParams.get('tag')

    
    
    if (!token) {
        return NextResponse.json({ message: 'Missing token param' }, { status: 400})
    }

    if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 })
    }

    if (token !== process.env.REVALIDATION_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
    
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, now: Date.now() })
}