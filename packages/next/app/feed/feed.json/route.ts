import { generateFeeds } from "@/lib/rss"

export async function GET() {
    const feeds = await generateFeeds()
    const options = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    return new Response(feeds.json1, options)
}