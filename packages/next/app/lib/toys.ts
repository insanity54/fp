
import { ITag, ITagResponse, ITagsResponse } from '@/lib/tags'
import { IMeta } from './types';


export interface IToysResponse {
    data: IToy[];
    meta: IMeta;
}

export interface IToy {
    id: number;
    attributes: {
        tags: ITagsResponse;
        linkTag: ITagResponse;
        make: string;
        model: string;
        aspectRatio: string;
        image2: string;
    }
}


interface IToysListProps {
    toys: IToysResponse;
    page: number;
    pageSize: number;
}


/** This endpoint doesn't exist at the moment, but definitely could in the future */
// export function getUrl(toy: IToy): string {
//     return `${siteUrl}/toy/${toy.name}`
// }

// export function getToysForVtuber(vtuberId: number, page: number = 1, pageSize: number = 25): Promise<IToys> {
//     const tvrs = await getTagVodRelationsForVtuber(vtuberId, page, pageNumber);
//     return {
//         data: tvrs.data.
//         pagination: tvrs.pagination
//     }
// }
