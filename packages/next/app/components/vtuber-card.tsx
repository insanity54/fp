import Link from "next/link";
import type { IVtuber } from '@/lib/vtubers';
import { getVodsForVtuber } from "@/lib/vods";
import Image from 'next/image'
import NotFound from "app/vt/[slug]/not-found";
import ArchiveProgress from "./archive-progress";

export default async function VTuberCard(vtuber: IVtuber) {
    const { id, attributes: { slug, displayName, imageBlur, image }} = vtuber;
    if (!imageBlur) return <p>this is a vtubercard with an invalid imageBlur={imageBlur}</p>
    const vods = await getVodsForVtuber(id)
    if (!vods) return <NotFound></NotFound>
    return (
        <Link 
            href={"/vt/"+slug} 
            className="column is-full-mobile is-half-tablet"
        >
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <Image
                                    className="is-rounded"
                                    src={image}
                                    alt={displayName}
                                    placeholder="blur"
                                    blurDataURL={imageBlur}
                                    width={48}
                                    height={48}
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-4 mb-3">{displayName}</p>
                            <ArchiveProgress vtuber={vtuber}/>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
  }