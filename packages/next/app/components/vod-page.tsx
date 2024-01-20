import { getUrl, getNextVod, getPreviousVod, getLocalizedDate } from '@/lib/vods';
import { IVod } from '@/lib/vods';
import Link from 'next/link';
import { VideoInteractive } from './video-interactive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faGlobe, faLink } from "@fortawesome/free-solid-svg-icons";
import { notFound } from 'next/navigation';
import { IpfsCid } from './ipfs-cid';
import LinkableHeading from './linkable-heading';


export function getVodTitle(vod: IVod): string {
    return vod.attributes.title || vod.attributes.announceTitle || `${vod.attributes.vtuber.data.attributes.displayName} ${vod.attributes.date2}`;
}

export function buildMuxUrl(playbackId: string, token: string) {
    return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`
}

export function buildMuxSignedPlaybackId(playbackId: string, token: string) {
    return `${playbackId}?token=${token}`
}

export function buildMuxThumbnailUrl(playbackId: string, token: string) {
    return `https://image.mux.com/${playbackId}/storyboard.vtt?token=${token}`
}


export default async function VodPage({vod}: { vod: IVod }) {

    if (!vod) notFound();
    const slug = vod.attributes.vtuber.data.attributes.slug;
    const previousVod = await getPreviousVod(vod);
    const nextVod = await getNextVod(vod);


    return (

        <div className="container">
            <div className="block">
                <div className="box">
                    <VideoInteractive vod={vod}></VideoInteractive>

                    {(vod.attributes.videoSrcHash || vod.attributes.video240Hash) && (
                        <>
                            <LinkableHeading text="IPFS Content IDs" slug="ipfs" icon={faGlobe}></LinkableHeading>
                            {vod.attributes.videoSrcHash && (
                                <IpfsCid label="Source" cid={vod.attributes.videoSrcHash}></IpfsCid>
                            )}
                            {vod.attributes.video240Hash && (
                                <IpfsCid label="240p" cid={vod.attributes.video240Hash}></IpfsCid>
                            )}
                        </>
                    )}


                    <nav className="level mt-5">
                        <div className='level-left'>
                            <div className='level-item'>
                                {!!previousVod && (
                                    <Link className='button' href={getUrl(previousVod, slug, previousVod.attributes.date2)}>
                                        <FontAwesomeIcon
                                            icon={faChevronLeft}
                                            className='fas faChevronLeft'
                                        ></FontAwesomeIcon>
                                        <span className="ml-2">Prev VOD {getLocalizedDate(previousVod)}</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className='level-center'>
                            <div className='level-item'>
                                <p className='has-text-grey-darker'>UID {vod.attributes.cuid}</p>
                            </div>
                        </div>
                        <div className='level-right'>
                            <div className='level-item'>
                                {!!nextVod && (
                                    <Link className='button' href={getUrl(nextVod, slug, nextVod.attributes.date2)}>
                                        <span className="mr-2">Next VOD {getLocalizedDate(nextVod)}</span>
                                        <FontAwesomeIcon
                                            icon={faChevronRight}
                                            className='fas faChevronRight'
                                        ></FontAwesomeIcon>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </nav>


                </div>
            </div>
        </div>
    );
}
