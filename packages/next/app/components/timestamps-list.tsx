import React, { useContext, useState, useEffect } from "react";
import { IVod } from "@/lib/vods";
import {
    ITimestamp,
    deleteTimestamp
} from "@/lib/timestamps";
import {
    formatTimestamp,
    formatUrlTimestamp,
} from "@/lib/dates";
import Link from 'next/link';
import { faClock, faLink, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext, IAuthData } from "./auth";
import { isWithinInterval, subHours, Interval } from 'date-fns';
import { useRouter } from 'next/navigation';

export interface ITimestampsProps {
    vod: IVod;
    timestamps: ITimestamp[];
    setTimestamps: Function;
}

function isCreatedByMeRecently(authData: IAuthData, ts: ITimestamp) {
    if (!authData?.user) return false;
    if (authData.user.id !== ts.attributes.creatorId) return false;
    const last24H: Interval = { start: subHours(new Date(), 24), end: new Date() };
    return isWithinInterval(new Date(ts.attributes.createdAt), last24H);
}


export function TimestampsList({ vod, timestamps, setTimestamps }: ITimestampsProps): React.JSX.Element {
    // const throttledTimestampFetch = throttle(getRawTimestampsForVod);
    const authContext = useContext(AuthContext);


    const hasTimestamps = timestamps.length > 0;

    return (
        <div className="timestamps mb-5">


            {hasTimestamps && (
                timestamps.map((ts: ITimestamp) => (
                    <p key={ts.id}>
                        {/* {JSON.stringify(ts, null, 2)}<br/><br/><br/> */}
                        <Link
                            href={`?t=${formatUrlTimestamp(ts.attributes.time)}`}
                        >
                            {formatTimestamp(ts.attributes.time)}
                        </Link>{' '}
                        <span className="mr-2">{ts.attributes.tag.data.attributes.name}</span>
                        {authContext?.authData && isCreatedByMeRecently(authContext.authData, ts) && (
                            <button 
                                onClick={() => {
                                    if (!authContext?.authData) return;
                                    deleteTimestamp(authContext.authData, ts.id);
                                    setTimestamps((prevTimestamps: ITimestamp[]) => prevTimestamps.filter((timestamp) => timestamp.id !== ts.id));
                                }}
                                className={`button icon`}
                            >
                                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                            </button>
                        )}
                    </p>
                ))
            )}

            {!hasTimestamps && <div className="ml-5"><p><i>This VOD has no timestamps</i></p></div>}
        </div>
    );
}
