'use client';

import { faVideo, faExternalLinkAlt, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import Link from 'next/link';
import { IVod } from '@/lib/vods';
import { buildIpfsUrl } from '@/lib/ipfs';
import { getSafeDate } from "@/lib/dates";
import { StreamButton } from '@/components/stream-button';
import VtuberButton from "./vtuber-button";

export function getDownloadLink(cid: string, safeDate: string, slug: string, quality: string) {
    return buildIpfsUrl(`${cid}?filename=${slug}-${safeDate}-${quality}.mp4`)
}


export interface IVodNavProps {
    vod: IVod;
}

export default function VodNav ({ vod }: IVodNavProps) {
    const safeDate = getSafeDate(vod.attributes.date2);
    return (
        <nav className='level'>
            <div className='level-left'>
                <div className="level-item">
                    <Link href={`/vt/${vod.attributes.vtuber.data.attributes.slug}`}>
                        <VtuberButton
                            size="medium"
                            image={vod.attributes.vtuber.data.attributes.image} 
                            displayName={vod.attributes.vtuber.data.attributes.displayName}
                        ></VtuberButton>
                    </Link>
                </div>
                <div className="level-item">
                    <StreamButton stream={vod.attributes.stream.data} />
                </div>
            </div>
            <div className='level-right'>
                {vod.attributes.videoSrcHash && (
                    <>
                        <div className='level-item'>
                            <Link
                                download={getDownloadLink(vod.attributes.videoSrcHash, safeDate, vod.attributes.vtuber.data.attributes.slug, 'source')}
                                className='button is-info is-small'
                                target="_blank"
                                prefetch={false}
                                href={getDownloadLink(vod.attributes.videoSrcHash, safeDate, vod.attributes.vtuber.data.attributes.slug, 'source')}
                            >
                                <FontAwesomeIcon icon={faVideo} className="fas fa-download mr-1" />
                                <span className='mr-1'>Source</span>
                                <FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" />
                            </Link>
                        </div>
                    </>
                )}
                {vod.attributes.video240Hash && (
                    <div className='level-item'>
                        <span>
                            <Link
                                download={getDownloadLink(vod.attributes.video240Hash, safeDate, vod.attributes.vtuber.data.attributes.slug, '240p')}
                                className='button is-info is-small'
                                target="_blank"
                                prefetch={false}
                                href={getDownloadLink(vod.attributes.video240Hash, safeDate, vod.attributes.vtuber.data.attributes.slug, '240p')}
                            >
                                <FontAwesomeIcon icon={faVideo} className="fas fa-download mr-1" />
                                <span className='mr-1'>240p</span>
                                <FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" />
                            </Link>
                        </span>
                    </div>
                )}
                {vod.attributes.announceUrl && (
                    <div className='level-item'>
                        <Link 
                            target="_blank" 
                            href={vod.attributes.announceUrl} 
                            className="button is-small"
                        >
                            <span className="mr-2"><FontAwesomeIcon icon={faXTwitter} className="fab fa-x-twitter" /></span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}