'use client';

import { IStream } from "@/lib/streams";
import NotFound from "app/streams/[cuid]/not-found";
import { IVod } from "@/lib/vods";
import Link from "next/link";
import Image from "next/image";
import { LocalizedDate } from "./localized-date";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCircleInfo, faThumbsUp, IconDefinition, faO, faX, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Hemisphere, Moon } from "lunarphase-js";
import { useEffect, useState } from "react";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

export interface IStreamProps {
    stream: IStream;
}
type Status = 'missing' | 'issue' | 'good';
interface StyleDef {
    heading: string;
    icon: IconDefinition;
    desc1: string;
    desc2: string;
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function hasNote(vod: IVod) {
    if (!!vod?.attributes?.note) return true;
    else return false;
}

function determineStatus(stream: IStream): Status {
    if (stream.attributes.vods.data.length < 1) {
        return 'missing'
    } else {
        if (stream.attributes.vods.data.some(vod => !hasNote(vod))) {
            return 'good';
        } else {
            return 'issue';
        }
    }
}

export default function StreamPage({ stream }: IStreamProps) {
    const displayName = stream.attributes.vtuber.data.attributes.displayName;
    const date = new Date(stream.attributes.date);
    const [hemisphere, setHemisphere] = useState(Hemisphere.NORTHERN);
    const [selectedStatus, setSelectedStatus] = useState<Status>(determineStatus(stream));

    const styleMap: Record<Status, StyleDef> = {
        'missing': {
            heading: 'is-danger',
            icon: faTriangleExclamation,
            desc1: "We don't have a VOD for this stream.",
            desc2: 'Know someone who does?'
        },
        'issue': {
            heading: 'is-warning',
            icon: faCircleInfo,
            desc1: "We have a VOD for this stream, but it's not full quality.",
            desc2: 'Have a better copy?'
        },
        'good': {
            heading: 'is-success',
            icon: faThumbsUp,
            desc1: "We have a VOD for this stream, and we think it's the best quality possible.",
            desc2: "Have one that's even better?"
        }
    };
    const { heading, icon, desc1, desc2 } = styleMap[selectedStatus] || {};

    useEffect(() => {
        const randomHemisphere = (Math.random() < 0.5 ? 0 : 1) ? Hemisphere.NORTHERN : Hemisphere.SOUTHERN;
        setHemisphere(randomHemisphere);
    }, []);

    if (!stream) return <NotFound></NotFound>

    // return <p>
    //     <pre>
    //         <code>
    //             {JSON.stringify(stream, null, 2)}

    //         </code>
    //     </pre>

    // </p>
    // const platformsList = '???';
    const { isChaturbateInvite, isFanslyInvite } = stream.attributes.tweet.data.attributes;
    const platformsArray = [
        isChaturbateInvite ? 'Chaturbate' : null,
        isFanslyInvite ? 'Fansly' : null
    ].filter(Boolean);
    const platformsList = platformsArray.length > 0 ? platformsArray.join(', ') : 'None';
    

    return (
        <>


            <div className="content">
                <div className="section">
                    <h1 className="title"><LocalizedDate date={date} /> {displayName} Stream Archive</h1>
                </div>

                <div className="section columns is-multiline">
                    <div className="column is-half">
                        <div className="box">
                            <h2 className="title is-3">Details</h2>
                            <div className="columns is-multiline">
                                <div className="column is-full">
                                    <span><b>Announcement</b>&nbsp;<span><Link target="_blank" href={stream.attributes.tweet.data.attributes.url}><FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon><FontAwesomeIcon icon={faExternalLinkAlt}></FontAwesomeIcon></Link></span></span><br></br>
                                    <span><b>Platform</b>&nbsp;</span><span>{platformsList}</span><br></br>
                                    <span><b>UTC Datetime</b>&nbsp;</span><time dateTime={date.toISOString()}>{date.toISOString()}</time><br></br>
                                    <span><b>Local Datetime</b>&nbsp;</span><span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span><br></br>
                                    <span><b>Lunar Phase</b>&nbsp;</span><span>{Moon.lunarPhase(date)} {Moon.lunarPhaseEmoji(date, { hemisphere })}</span><br></br>
                                    <br></br>
                                    {/* <select className="mt-5"
                                        value={selectedStatus}
                                        onChange={e => setSelectedStatus(e.target.value as Status)}
                                    >
                                        <option>good</option>
                                        <option>issue</option>
                                        <option>missing</option>
                                    </select> */}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="column is-half">
                        <article className={`message ${heading}`}>
                            <div className="message-header">
                                <span>VOD {capitalizeFirstLetter(selectedStatus)}</span>
                            </div>
                            <div className="message-body has-text-centered">
                                <span className="title is-1"><FontAwesomeIcon icon={icon}></FontAwesomeIcon></span>
                                <p className="mt-3">{desc1}</p>
                                <p className="mt-5">{desc2}<br />
                                <Link href={`/upload?cuid=${stream.attributes.cuid}`}>Upload it here.</Link></p>
                            </div>
                        </article>
                    </div>

                </div>


                <div className="section">
                    <h1 className="title">VODs</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Upload Date</th>
                                {/* <th>Thumbnail</th>
                                <th>Duration</th> */}
                                <th>Tags</th>
                                <th>Timestamps</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stream.attributes.vods.data.map((vod: IVod) => (
                                <tr key={vod.id}>
                                    {/* <p>{JSON.stringify(vod, null, 2)}</p> */}
                                    <td><Link href={`/vt/${stream.attributes.vtuber.data.attributes.slug}/vod/${vod.attributes.cuid}`}>{vod.attributes.cuid}</Link></td>
                                    <td>{vod.attributes.publishedAt}</td>
                                    {/* <td>{(!!vod?.attributes?.thumbnail?.data?.attributes?.cdnUrl) ? <Image alt="" src={vod.attributes.thumbnail.data.attributes.cdnUrl}></Image> : <FontAwesomeIcon icon={faX} />}</td>
                                    <td>{(!!vod?.attributes?.duration) ? vod.attributes.duration : <FontAwesomeIcon icon={faX} />}</td> */}
                                    <td>{vod.attributes.tagVodRelations.data.length}</td>
                                    <td>{vod.attributes.timestamps.data.length}</td>
                                    <td>{(!!vod.attributes.note) ? <FontAwesomeIcon icon={faO} /> : <FontAwesomeIcon icon={faX} />}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </>
    )
}
