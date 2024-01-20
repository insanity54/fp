import VodsList, { VodsListHeading } from '@/components/vods-list';
import { getVtuberBySlug, getUrl } from '@/lib/vtubers';
import { IVodsResponse, getVodsForVtuber } from '@/lib/vods';
import Pager from '@/components/pager';
import { notFound } from 'next/navigation';


interface IPageParams {
  params: {
    slug: string;
    page: string; 
  };
}

export default async function Page({ params }: IPageParams) {
  let vtuber, vods;
  const pageNumber = parseInt(params.page);
  
  try {
    vtuber = await getVtuberBySlug(params.slug);
    if (!vtuber) notFound();
    vods = await getVodsForVtuber(vtuber.id, pageNumber, 24, true);
  } catch (error) {
    // Handle the error here (e.g., display an error message)
    console.error("An error occurred:", error);
    // You might also want to return an error page or message
    return <div>Error: {JSON.stringify(error)}</div>;
  }


  if (!vods) return <p>error</p>
  return (
    <>
      <VodsListHeading slug={vtuber.attributes.slug} displayName={vtuber.attributes.displayName} />
      <VodsList vtuber={vtuber} vods={vods.data} page={pageNumber} pageSize={24} />
      <Pager
        baseUrl={`/vt/${params.slug}/vods`}
        page={parseInt(params.page)}
        pageCount={vods.meta.pagination.pageCount}
      />
    </>
  );
}
