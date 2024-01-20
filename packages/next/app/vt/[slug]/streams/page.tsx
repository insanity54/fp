
import { getVtuberBySlug } from '@/lib/vtubers';
import { getStreamsForVtuber } from '@/lib/streams';
import Pager from '@/components/pager';
import { notFound } from 'next/navigation';

interface IPageParams {
    params: {
        slug: string;
    }
}

export default async function Page({ params }: IPageParams) {
    const vtuber = await getVtuberBySlug(params.slug);
    if (!vtuber) return <p>vtuber {params.slug} not found</p>
    const streams = await getStreamsForVtuber(vtuber.id, 1, 24);
    if (!streams) return <p>streams not found</p>;
    return (
        <>
            <Pager baseUrl={`/vt/${params.slug}/stream`} page={1} pageCount={streams.meta.pagination.pageCount} />
        </>
    )
}