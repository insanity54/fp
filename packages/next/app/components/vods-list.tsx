import React from 'react'
import Link from 'next/link';
import VodCard from './vod-card';
import { IVtuber, IVtuberResponse } from '@/lib/vtubers';
import { IVodsResponse, IVod } from '@/lib/vods';
import { getVodTitle } from './vod-page';
import { notFound } from 'next/navigation';

interface IVodsListProps {
    vtuber?: IVtuber;
    vods: IVod[];
    page: number;
    pageSize: number;
}


interface IVodsListHeadingProps {
    slug: string;
    displayName: string;
}

export function VodsListHeading({ slug, displayName }: IVodsListHeadingProps): React.JSX.Element {
    return (
        <div className='box'>
            <h3 className='title'>
                <Link href={`/vt/${slug}`}>{displayName}</Link> Vods
            </h3>
        </div>
    )
}


export default function VodsList({ vods, page = 1, pageSize = 24 }: IVodsListProps): React.JSX.Element {
    // if (!vtuber) return <div>vtuber is not defined. vtuber:{JSON.stringify(vtuber, null, 2)}</div>
    // if (!vods) return <div>failed to load vods</div>;
    if (!vods) return notFound()

    // @todo [x] pagination
    // @todo [x] sortability
    return (
        <>
            {/* <p>VodsList on page {page}, pageSize {pageSize}, with {vods.data.length} vods</p> */}

            {/* <pre>
                <code>
                    {JSON.stringify(vods.data, null, 2)}
                </code>
            </pre> */}


            <div className="columns is-multiline is-mobile">
                {vods.map((vod: IVod) => (
                    <VodCard
                        key={vod.id}
                        id={vod.id}
                        title={getVodTitle(vod)}
                        date={vod.attributes.date2}
                        muxAsset={vod.attributes.muxAsset?.data?.attributes.playbackId}
                        vtuber={vod.attributes.vtuber.data}
                        thumbnail={vod.attributes.thumbnail?.data?.attributes?.cdnUrl}
                    />
                ))}
            </div>
        </>
    );
}
