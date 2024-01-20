
// import VodsList, { VodsListHeading } from '@/components/vods-list'
// import { getVtuberBySlug } from '@/lib/vtubers'
// // import { IToys, getToysForVtuber } from '@/lib/toys'
// import { ToysList, ToysListHeading } from '@/components/toys'
// import Pager from '@/components/pager'

// interface IPageParams {
//     params: {
//         name: string;
//         page: number;
//     }
// }

export default async function Page() {
    // const vtuber = await getVtuberBySlug(params.slug)
    return <p>Toys pages coming soon</p>
    // const toys: IToys = await getToysForVtuber(vtuber.id, params.page, 24)
    // return (
    //     <div className='box'>
    //         <div className="">
    //             <ToysListHeading slug={vtuber.slug} displayName={vtuber.displayName} />
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