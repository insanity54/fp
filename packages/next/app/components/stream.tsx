import { IStream } from "@/lib/streams";
import NotFound from "app/vt/[slug]/not-found";
import { LocalizedDate } from "./localized-date";
import Link from "next/link";
import ChaturbateIcon from "@/components/icons/chaturbate";
import FanslyIcon from "@/components/icons/fansly";
import Image from "next/image";

export interface IStreamProps {
    stream: IStream;
}


export function Stream({ stream }: IStreamProps) {
    if (!stream) return <NotFound></NotFound>
    return (
        <div className="box">
            <pre>
                <code>
                    {JSON.stringify(stream, null, 2)}
                </code>
            </pre>
            {/* <h3 className="title is-3">Stream {stream.attributes.date}</h3> */}
        </div>
    )
}



export function StreamSummary ({ stream }: IStreamProps) {
    if (!stream) return <NotFound></NotFound>

    // return (
    //     <pre>
    //         <code>
    //             {JSON.stringify(stream, null, 2)}
    //         </code>
    //     </pre>
    // )

    const archiveStatus = stream.attributes.archiveStatus;
    const archiveStatusClassName = (() => {
        if (archiveStatus === 'missing') return 'is-danger';
        if (archiveStatus === 'good') return 'is-success';
        if (archiveStatus === 'issue') return 'is-warning';
    })();

    return (
        <Link href={`/streams/${stream.attributes.cuid}`}>
            <div className="columns">
                {/* <pre>
                    <code>
                        {JSON.stringify(stream, null, 2)}
                    </code>
                </pre> */}
                <div className="column is-narrow">
                    <span className="icon image">
                    <Image
                        className='is-rounded'
                        src={stream.attributes.vtuber.data.attributes.image}
                        alt={stream.attributes.vtuber.data.attributes.displayName}
                        width={28}
                        height={18}
                        />
                    </span>
                </div>
                <div className="column">
                    <span>{stream.attributes.vtuber.data.attributes.displayName}</span>
                </div>
                <div className="column">
                    <LocalizedDate date={new Date(stream.attributes.date)}/>
                </div>
                <div className="column">
                    {(stream.attributes.isChaturbateStream) && <ChaturbateIcon width={18} height={18} className='mr-2'></ChaturbateIcon>}
                    {(stream.attributes.isFanslyStream) && <FanslyIcon width={18}></FanslyIcon>}
                </div>
                <div className="column">
                    <div className={`tag ${archiveStatusClassName}`}>{stream.attributes.archiveStatus}</div>
                </div>
                <div className="column">
                    <div className=""></div>
                </div>
            </div>
        </Link>
    )
}