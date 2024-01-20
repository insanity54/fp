import React from 'react'
import Link from 'next/link';
import VodCard from './vod-card';
import { IVtuber } from '@/lib/vtubers';
import { IVod } from '@/lib/vods';
import { getVodTitle } from './vod-page';
import { notFound } from 'next/navigation';
import { IStream, getStreamsForVtuber, getAllStreams } from '@/lib/streams';
import { StreamSummary } from '@/components/stream';

interface IStreamsListProps {
    vtubers: IVtuber[];
    page: number;
    pageSize: number;
}


interface IStreamsListHeadingProps {
    slug: string;
    displayName: string;
}

export function StreamsListHeading({ slug, displayName }: IStreamsListHeadingProps): React.JSX.Element {
    return (
        <div className='box'>
            <h3 className='title'>
                <Link href={`/vt/${slug}`}>{displayName}</Link> Streams
            </h3>
        </div>
    )
}


export default async function StreamsList({ vtubers, page = 1, pageSize = 24 }: IStreamsListProps): Promise<React.JSX.Element> {
    if (!vtubers) return <div>vtubers is not defined. vtubers:{JSON.stringify(vtubers, null, 2)}</div>

    // const streams = await getStreamsForVtuber(vtubers[0].id);
    const streams = await getAllStreams(['missing', 'issue', 'good']);

    if (!streams) return notFound();


    // @todo [ ] pagination
    // @todo [ ] sortability
    return (
        <>

            <h2 className='title is-2'>Stream Archive</h2>
            <aside className="menu">
                <ul className="menu-list">
                    {streams.length < 1 && <p className='section'><i>There are no streams</i></p>}
                    {streams.map((stream: IStream) => (
                        <li>
                            <StreamSummary stream={stream}/>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
}
