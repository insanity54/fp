
import VodsList from '@/components/vods-list';
import { IVodsResponse } from '@/lib/vods';
import Pager from '@/components/pager';
import { getVods } from '@/lib/vods';

interface IPageParams {
    params: {
        slug: string;
    }
}

export default async function Page({ params }: IPageParams) {
    const vods: IVodsResponse = await getVods(1, 24);
    
    return (
        <>
            <h2 className='title is-2'>Latest VODs</h2>
            <p className='subtitle'>page 1</p>
            <VodsList vods={vods.data} page={1} pageSize={24} />
            <Pager baseUrl='/latest-vods' page={1} pageCount={vods.meta.pagination.pageCount} />
        </>
    )
}