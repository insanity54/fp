
// import VodsList, { VodsListHeading } from '@/components/vods-list'
// import { getVtuberBySlug } from '@/lib/vtubers'
// // import { IToys, getToysForVtuber } from '@/lib/toys'
// import { ToysList } from '@/components/toys'
// import Pager from '@/components/pager'

interface IPageParams {
    params: {
        name: string;
    }
}

export default async function Page({ params }: IPageParams) {
    // const vtuber = await getVtuberBySlug(params.slug)
    return <p>toys pages coming soon</p>
    // const toys: IToys = await getToysForVtuber(vtuber.id, 1, 24)
    // return (
    //     <div className='box'>
    //         <div className="">
    //             {/* <VodsListHeading slug={vtuber.slug} displayName={vtuber.displayName} /> */}
    //             {/* <VodsList vtuber={vtuber} vods={vods} page={params.page} pageSize={24} /> */}
    //             <ToysList toys={toys} pageSize={12}></ToysList>
    //             <Pager 
    //                 collection='toys'
    //                 slug={vtuber.slug} 
    //                 page={parseInt(params.page, 10)} 
    //                 pageCount={toys.pagination.pageCount}
    //             />
    //         </div>
    //     </div>
    // )
}