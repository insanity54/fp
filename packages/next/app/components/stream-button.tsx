import { IStream } from "@/lib/streams";
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

export function StreamButton({ stream }: { stream: IStream }) {
    if (!stream) return <></>
    // return <p>{JSON.stringify(stream, null, 2)}</p>
    // return <span className="button is-small">{new Date(stream.attributes.date).toLocaleDateString()}</span>

    return (
        <Link 
            href={`/streams/${stream.attributes.cuid}`}
            className="button is-medium"
        >
            <span className="mr-2"><FontAwesomeIcon icon={faCalendar} className="fas fa-calendar" /></span><span>{new Date(stream.attributes.date).toLocaleDateString()}</span>
        </Link>
    )
}