'use client';

import { IVod } from "@/lib/vods";
import { useRef, useState, useEffect, useCallback } from "react";
import { VideoPlayer } from "./video-player";
import { Tagger } from './tagger';
import { ITimestamp, getTimestampsForVod } from "@/lib/timestamps";
import { TimestampsList } from "./timestamps-list";
import { ITagVodRelation } from "@/lib/tag-vod-relations";
import { VideoContext } from "./video-context";
import { getVodTitle } from "./vod-page";
import { useSearchParams } from 'next/navigation';
import VideoApiElement from "@mux/mux-player/dist/types/video-api";
import { parseUrlTimestamp } from "@/lib/dates";
import { faTags, faNoteSticky, faClock } from "@fortawesome/free-solid-svg-icons";
import { Tag } from './tag';
import VodNav from './vod-nav';
import LinkableHeading from "./linkable-heading";


export interface IVideoInteractiveProps {
    vod: IVod;
}


function secondsToHumanReadable(timestampInSeconds: number): string {
    const hours = Math.floor(timestampInSeconds / 3600);
    const minutes = Math.floor((timestampInSeconds % 3600) / 60);
    const seconds = timestampInSeconds % 60;

    return `${hours}h${minutes}m${seconds}s`;
}


function humanReadableTimestampToSeconds(timestamp: string): number | null {
    const parts = timestamp.split(':');

    if (parts.length !== 3) {
        // Invalid format, return null or throw an error as appropriate
        return null;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        // Invalid numeric values, return null or throw an error as appropriate
        return null;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalSeconds;
}




export function VideoInteractive({ vod }: IVideoInteractiveProps): React.JSX.Element {

    const [timeStamp, setTimeStamp] = useState(0);
    const [tvrs, setTvrs] = useState([]);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [timestamps, setTimestamps] = useState<ITimestamp[]>([]);
    const [currentTsPage, setCurrentTsPage] = useState(1);

    const getTimestampPage = useCallback(async (page: number) => {
        const timestamps = await getTimestampsForVod(vod.id, page);
        setTimestamps(timestamps);
    }, [vod.id, setTimestamps]); // IGNORE TS LINTER! DO NOT PUT timestamps HERE! IT CAUSES SELF-DDOS!
    
    const ref = useRef(null);
    const searchParams = useSearchParams();
    const t = searchParams.get('t');
    


    useEffect(() => {
        getTimestampPage(currentTsPage);
    }, [vod.id, getTimestampPage, currentTsPage]);

    useEffect(() => {
        if (!t) return;
        if (!ref?.current) return;
        const videoRef = ref.current as VideoApiElement;
        const seconds = parseUrlTimestamp(t)
        if (seconds === null) return;
        videoRef.currentTime = seconds;
    }, [t, isPlayerReady, ref])


    return (
        <VideoContext.Provider value={{
            timeStamp,
            setTimeStamp,
            tvrs,
            setTvrs
        }}>
            <VideoPlayer
                vod={vod}
                ref={ref}
                setIsPlayerReady={setIsPlayerReady}
            ></VideoPlayer>

            <h3 className="subtitle is-3">
                {getVodTitle(vod)}
            </h3>
            <VodNav vod={vod}></VodNav>

            <div className='mb-3 fp-vod-data'>
                {vod.attributes.note && (
                    <>
                        <LinkableHeading text="Notes" slug="notes" icon={faNoteSticky}></LinkableHeading>
                        <div className='notification'>{vod.attributes.note}</div>
                    </>
                )}
                
                <LinkableHeading text="Tags" slug="tags" icon={faTags}></LinkableHeading>
                
                <div className="tags has-addons mb-5">
                    {vod.attributes.tagVodRelations.data.length === 0 && <div className="ml-5"><p><i>This vod has no tags</i></p></div>}
                    {vod.attributes.tagVodRelations.data.map((tvr: ITagVodRelation) => (
                        <Tag key={tvr.id} tvr={tvr}></Tag>
                    ))}
                    <Tagger vod={vod} setTimestamps={setTimestamps}></Tagger>
                </div>
                <LinkableHeading text="Timestamps" slug="timestamps" icon={faClock}></LinkableHeading>
                <TimestampsList timestamps={timestamps} setTimestamps={setTimestamps} vod={vod}></TimestampsList>
            </div>

        </VideoContext.Provider>
    )
}