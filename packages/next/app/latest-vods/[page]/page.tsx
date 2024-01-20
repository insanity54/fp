import VodsList from '@/components/vods-list';
import { getVods } from '@/lib/vods';
import Pager from '@/components/pager';

interface IPageParams {
  params: {
    page: number; 
  };
}

export default async function Page({ params: { page } }: IPageParams) {
  let vods;
  try {
    vods = await getVods(page, 24, true);
  } catch (error) {
    console.error("An error occurred:", error);
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <>
      <h2 className='title is-2'>Latest VODs</h2>
      <p className='subtitle'>page {page}</p>
      <VodsList vods={vods.data} page={page} pageSize={24} />
      <Pager
        baseUrl='/latest-vods'
        page={page}
        pageCount={vods.meta.pagination.pageCount}
      />
    </>
  );
}
