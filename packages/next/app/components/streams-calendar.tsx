'use client';

import FullCalendar from "@fullcalendar/react";
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth'

import { IStream } from "@/lib/streams";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";



interface IStreamsCalendarProps {
    missingStreams: IStream[];
    issueStreams: IStream[];
    goodStreams: IStream[];
}

interface IEvent {
    cuid: string;
    start: Date;
    end?: Date;
    title: string;
    vtuber: string;
}

// function buildStreamPageUrlFromDate(date: Date) {
//     // const cuid = 
//     return `/s/${safeDate}`;
// }

function handleEventClick(info: any, router: AppRouterInstance) {
    var eventObj = info.event;
    const { cuid } = eventObj._def.extendedProps;
    router.push(`/streams/${cuid}`);

}

function convertStreamToEvent(stream: IStream): IEvent {
    console.log(stream)
    const displayName = stream.attributes.vtuber.data.attributes.displayName;
    return {
        cuid: stream.attributes.cuid,
        start: new Date(stream.attributes.date),
        title: `${displayName}`,
        vtuber: displayName
    }
}

export default function StreamsCalendar({ missingStreams, issueStreams, goodStreams }: IStreamsCalendarProps) {
    const router = useRouter();
    const eventSources = [
        {
            events: missingStreams.map(convertStreamToEvent),
            color: 'red'
        },
        {
            events: issueStreams.map(convertStreamToEvent),
            color: 'yellow',
        },
        {
            events: goodStreams.map(convertStreamToEvent),
            color: 'green'
        }
    ]

    return (
        <>
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    interactionPlugin
                ]}
                editable={false}
                eventSources={eventSources}
                eventClick={(args) => {
                    handleEventClick(args, router);
                }}
            />
        </>
    )
}