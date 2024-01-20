
import { Stream } from '@/components/stream';
import { IStream, getStreamForVtuber } from '@/lib/streams';
import { getVtuberBySlug } from '@/lib/vtubers';
import NotFound from '../../not-found';

interface IPageProps {
    params: {
        safeDate: string;
        slug: string;
    };
}

export default async function Page({ params: { safeDate, slug } }: IPageProps) {
    const vtuber = await getVtuberBySlug(slug);
    if (!vtuber) return <NotFound></NotFound>
    const stream = await getStreamForVtuber(vtuber.id, safeDate);
    if (!stream) return <NotFound></NotFound>

    return (
        <div className="content">
            <div className="section">
                <h1 className="title">Stream Page!</h1>
                <p className="subtitle">slug={slug} safeDate={safeDate}</p>

                <Stream stream={stream} />
            </div>
        </div>
    )
}

