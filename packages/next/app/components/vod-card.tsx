import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { getSafeDate, getDateFromSafeDate } from '@/lib/dates';
import { IVtuber } from '@/lib/vtubers';
import Image from 'next/image'
import { LocalizedDate } from '@/components/localized-date'
import { IMuxAsset, IMuxAssetResponse } from "@/lib/types";
import { IB2File } from "@/lib/b2File";

interface IVodCardProps {
    id: number;
    title: string;
    date: string;
    muxAsset: string | undefined;
    thumbnail: string | undefined;
    vtuber: IVtuber;
}


export default function VodCard({id, title, date, muxAsset, thumbnail = 'https://futureporn-b2.b-cdn.net/default-thumbnail.webp', vtuber}: IVodCardProps) {

    if (!vtuber?.attributes?.slug) return <div className="card"><p>VOD {id} is missing VTuber</p></div>

    return (
        <div key={id} className="column is-full-mobile is-one-third-tablet is-one-fourth-desktop is-one-fifth-fullhd">
            <div className="card">
                <Link href={`/vt/${vtuber.attributes.slug}/vod/${getSafeDate(date)}`}>
                    <div className="card-image">
                        <figure className="image is-16by9">
                            <Image
                                src={thumbnail}
                                alt={title}
                                placeholder="blur"
                                blurDataURL={vtuber.attributes.imageBlur}
                                fill={true}
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </figure>
                    </div>
                    <div className="card-content">
                        <h1>{title}</h1>
                        <LocalizedDate date={new Date(date)} />

                        <footer className="mt-3 card-footer">
                            <div className="card-footer-item">
                                <FontAwesomeIcon
                                    icon={faVideo} 
                                    className="fas fa-video" 
                                ></FontAwesomeIcon>
                            </div>
                            {muxAsset && (
                                <div className="card-footer-item">
                                    <FontAwesomeIcon icon={faPatreon} className="fab fa-patreon" />
                                </div>
                            )}
                        </footer>
                    </div>
                </Link>
            </div>
        </div>

    )
  }





