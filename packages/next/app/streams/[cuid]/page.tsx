
import StreamPage from '@/components/stream-page';
import { getStreamByCuid } from '@/lib/streams';


interface IPageParams {
    params: {
        cuid: string;
    }
}


export default async function Page ({ params: { cuid } }: IPageParams) {
    const stream = await getStreamByCuid(cuid);
    return (
        <>
            <StreamPage stream={stream} />
        </>
    )
}