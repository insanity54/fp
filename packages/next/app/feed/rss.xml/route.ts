import { generateFeeds } from "@/lib/rss"

export async function GET() {
    const { rss2 } = await generateFeeds()
    const options = {
        headers: {
            "Content-Type": "application/rss+xml"
        }
    }
    return new Response(rss2, options)
}