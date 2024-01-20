
import { getVtuberBySlug } from '@/lib/vtubers';
import { getAllStreamsForVtuber } from '@/lib/streams';
import NotFound from '../not-found';
import { DataRecord } from 'cal-heatmap/src/options/Options';
import { Cal } from '@/components/cal';

interface IPageProps {
    params: {
        slug: string;
    };
}

function getArchiveStatusValue(archiveStatus: string): number {
    if (archiveStatus === 'good') return 2;
    if (archiveStatus === 'issue') return 1;
    else return 0 // missing
}

function sortDataRecordsByDate(records: DataRecord[]) {
    return records.sort((a, b) => {
        if (typeof a.date === 'string' && typeof b.date === 'string') {
            return a.date.localeCompare(b.date);
        } else {
            // Handle comparison when date is not a string (e.g., when it's a number)
            // For instance, you might want to convert numbers to strings or use a different comparison logic.
            // Example assuming number to string conversion:
            return String(a.date).localeCompare(String(b.date));
        }
    });
}


export default async function Page({ params: { slug } }: IPageProps) {
    const vtuber = await getVtuberBySlug(slug);
    if (!vtuber) return <NotFound></NotFound>
    const streams = await getAllStreamsForVtuber(vtuber.id);
    const streamsByYear: { [year: string]: DataRecord[] } = {};
    streams.forEach((stream) => {
        const date = new Date(stream.attributes.date);
        const year = date.getFullYear();
        if (!streamsByYear[year]) {
            streamsByYear[year] = [];
        }
        streamsByYear[year].push({
            date: new Date(stream.attributes.date).toISOString(),
            value: stream.attributes.archiveStatus,
        });
    });
    // Sort the data records within each year's array
    for (const year in streamsByYear) {
        streamsByYear[year] = sortDataRecordsByDate(streamsByYear[year]);
    }


    return (
        <div>
            {Object.keys(streamsByYear).map((year) => {
                return (
                    <div key={year} className='section'>
                        <h2 className='title'>{year}</h2>
                        {/* <pre><code>{JSON.stringify(streamsByYear[year], null, 2)}</code></pre> */}
                        <Cal slug={slug} data={streamsByYear[year]} />
                    </div>
                )
            })}
                
        </div>
    )
}
