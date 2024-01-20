import Pager from "@/components/pager";
import StreamsCalendar from "@/components/streams-calendar";
import StreamsList from "@/components/streams-list";
import { getAllStreams } from "@/lib/streams";
import { getAllVtubers } from "@/lib/vtubers";
import { MissingStaticPage } from "next/dist/shared/lib/utils";
import { notFound } from "next/navigation";
// import { useState } from "react";


export default async function Page() {
    const vtubers = await getAllVtubers();
    const pageSize = 100;
    const page = 1;
    if (!vtubers) notFound();
    const missingStreams = await getAllStreams(['missing']);
    const issueStreams = await getAllStreams(['issue']);
    const goodStreams = await getAllStreams(['good']);

    return (
        <div className="section">
            {/* <pre>
                <code>
                    {JSON.stringify(vtubers, null, 2)}
                </code>
            </pre> */}


            {/* <StreamsCalendar missingStreams={missingStreams} issueStreams={issueStreams} goodStreams={goodStreams} /> */}
            <StreamsList vtubers={vtubers} page={page} pageSize={pageSize} />
            <Pager baseUrl="/streams" page={page} pageCount={vtubers.length/pageSize}/>
        </div>
    )
}