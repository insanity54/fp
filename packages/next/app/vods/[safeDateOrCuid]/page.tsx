
import VodPage from '@/components/vod-page';
import { IVodPageProps, getVodFromSafeDateOrCuid } from '@/lib/vods';
import { notFound } from 'next/navigation';


/**
 * This route exists as backwards compatibility for Futureporn 0.0.0 which was on neocities
 * @see https://www.w3.org/Provider/Style/URI
 */
export default async function Page({ params: { safeDateOrCuid, slug } }: IVodPageProps) {
    const vod = await getVodFromSafeDateOrCuid(safeDateOrCuid);
    if (!vod) notFound();
    return <VodPage vod={vod} />
}

