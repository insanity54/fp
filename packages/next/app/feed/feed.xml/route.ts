import { generateFeeds } from "@/lib/rss"

export async function GET() {
    const { atom1 } = await generateFeeds()
    const options = {
        headers: {
            "Content-Type": "application/atom+xml"
        }
    }
    return new Response(atom1, options)
}