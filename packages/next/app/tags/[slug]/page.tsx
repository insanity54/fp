import { getVodsForTag, IVod } from '@/lib/vods'
import VodCard from '@/components/vod-card'
import Link from 'next/link'
import { getVodTitle } from '@/components/vod-page'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { slug: string }}) {
    const vods = await getVodsForTag(params.slug)
    if (!vods) return notFound()
    return (
        <div>
            <div className="content box">
                <h1>Tagged “{params.slug}”</h1>
            </div>

            <div className="columns is-multiline">
                {vods.data.map((vod: IVod) => (
                    <VodCard 
                        key={vod.id}
                        id={vod.id} 
                        title={getVodTitle(vod)} 
                        date={vod.attributes.date2} 
                        muxAsset={vod.attributes.muxAsset?.data?.attributes?.assetId} 
                        thumbnail={vod.attributes.thumbnail?.data?.attributes?.cdnUrl} 
                        vtuber={vod.attributes.vtuber.data}
                    />
                ))}
            </div>

            <div className="content box">
                <p className="subtitle is-3">See <Link href="/tags">all tags</Link>.</p>
            </div>
        </div>
    )
}