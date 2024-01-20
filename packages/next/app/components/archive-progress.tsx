import { getAllStreamsForVtuber } from "@/lib/streams";
import { IVtuber } from "@/lib/vtubers";

export interface IArchiveProgressProps {
    vtuber: IVtuber;
}

export default async function ArchiveProgress ({ vtuber }: IArchiveProgressProps) {
    const streams = await getAllStreamsForVtuber(vtuber.id);
    const goodStreams = await getAllStreamsForVtuber(vtuber.id, ['good']);
    const issueStreams = await getAllStreamsForVtuber(vtuber.id, ['issue']);
    const totalStreams = streams.length;
    const eligibleStreams = issueStreams.length+goodStreams.length;

    // Check if totalStreams is not zero before calculating completedPercentage
    const completedPercentage = (totalStreams !== 0) ? Math.round(eligibleStreams / totalStreams * 100) : 0;
    return (
        <div>
            <p className="heading">{eligibleStreams}/{totalStreams} Streams Archived ({completedPercentage}%)</p>
            <progress className="progress is-success" value={eligibleStreams} max={totalStreams}>{completedPercentage}%</progress>
        </div>
    )
}