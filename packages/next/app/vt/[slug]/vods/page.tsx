
import VodsList, { VodsListHeading } from '@/components/vods-list'
import { getVtuberBySlug, getUrl } from '@/lib/vtubers'
import { IVodsResponse, getVodsForVtuber, getPaginatedUrl } from '@/lib/vods'
import Pager from '@/components/pager'
import { notFound } from 'next/navigation'

interface IPageParams {
    params: {
        slug: string;
    }
}

export default async function Page({ params }: IPageParams) {
    const vtuber = await getVtuberBySlug(params.slug)
    if (!vtuber) notFound();
    const vods = await getVodsForVtuber(vtuber.id, 1, 24)
    if (!vods) notFound();
    return (
        <>
            <VodsListHeading slug={vtuber.attributes.slug} displayName={vtuber.attributes.displayName}></VodsListHeading>
            <VodsList vtuber={vtuber} vods={vods.data} page={1} pageSize={24} />
            <Pager baseUrl={`/vt/${params.slug}/vods`} page={1} pageCount={vods.meta.pagination.pageCount} />
        </>
    )
}