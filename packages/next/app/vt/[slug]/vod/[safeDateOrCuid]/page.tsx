
import VodPage from '@/components/vod-page'
import { IVodPageProps, getVodFromSafeDateOrCuid } from '@/lib/vods'
import { notFound } from 'next/navigation';


export default async function Page({ params: { safeDateOrCuid } }: IVodPageProps) {
    const vod = await getVodFromSafeDateOrCuid(safeDateOrCuid);
    if (!vod) return notFound();
    return <VodPage vod={vod} />
}

