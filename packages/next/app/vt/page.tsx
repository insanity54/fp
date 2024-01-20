import { notFound } from 'next/navigation'
import VTuberCard from '../components/vtuber-card'
import { getVtubers, IVtuber } from '../lib/vtubers'


export default async function Page() {
    const vtubers = await getVtubers()
    if (!vtubers) notFound()
    // return (
    //     <pre>
    //         <code>
    //             {JSON.stringify(vtubers, null, 2)}
    //         </code>
    //     </pre>
    // )
    return (
        <>
            <div className="content">
                <div className="section">
                    <h1 className="title">VTubers</h1>
                    <nav className="columns is-multiline">
                        {vtubers.data.map((vtuber: IVtuber) =>
                            <VTuberCard key={vtuber.id} {...vtuber} />
                        )}
                    </nav>
                </div>
            </div>
        </>
    )
}