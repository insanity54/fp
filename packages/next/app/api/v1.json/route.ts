
import { getVodTitle } from '@/components/vod-page';
import { getUrl, getAllVods } from "@/lib/vods"
import { IVod } from "@/lib/vods"


/*
 * this is a legacy format
 *
 * for API version 1.
 * 
 * @deprecated
 */
interface IVod1 {
    title: string;
    videoSrcHash: string;
    video720Hash: string;
    video480Hash: string;
    video360Hash: string;
    video240Hash: string;
    thinHash: string;
    thiccHash: string;
    announceTitle: string;
    announceUrl: string;
    date: string;
    note: string;
    url: string;
}

interface IAPI1 {
    vods: IVod1[]
}


export async function GET(): Promise<Response> {
    try {
        const vodsRaw = await getAllVods();
        if (!vodsRaw) {
            const options = {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 500,
            };
            return new Response('{}', options);
        }

        const vods: IVod1[] = vodsRaw.map((v: IVod): IVod1 => ({
            title: getVodTitle(v),
            videoSrcHash: v.attributes.videoSrcHash,
            video720Hash: '',
            video480Hash: '',
            video360Hash: '',
            video240Hash: v.attributes.video240Hash,
            thinHash: '',
            thiccHash: '',
            announceTitle: v.attributes.announceTitle,
            announceUrl: v.attributes.announceUrl,
            date: v.attributes.date2,
            note: v.attributes.note || '',
            url: getUrl(v, v.attributes.vtuber.data.attributes.slug, v.attributes.date2),
        }));

        const response = {
            vods: vods,
        };

        const options = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        return new Response(JSON.stringify(response), options);
    } catch (error) {
        console.error("Error fetching VODs:", error);

        const errorResponse = {
            error: "An error occurred while fetching VODs",
        };

        const options = {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        };

        return new Response(JSON.stringify(errorResponse), options);
    }
}