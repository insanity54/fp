

import { IVod } from './vods'
import { strapiUrl, siteUrl } from './constants';
import { getSafeDate } from './dates';
import qs from 'qs';
import { resourceLimits } from 'worker_threads';
import { IMeta } from './types';


const fetchVtubersOptions = {
    next: {
        tags: ['vtubers']
    }
}


export interface IVtuber {
    id: number;
    attributes: {
        slug: string;
        displayName: string;
        chaturbate?: string;
        twitter?: string;
        patreon?: string;
        twitch?: string;
        tiktok?: string;
        onlyfans?: string;
        youtube?: string;
        linktree?: string;
        carrd?: string;
        fansly?: string;
        pornhub?: string;
        discord?: string;
        reddit?: string;
        throne?: string;
        instagram?: string;
        facebook?: string;
        merch?: string;
        vods: IVod[];
        description1: string;
        description2?: string;
        image: string;
        imageBlur?: string;
        themeColor: string;
    }
}

export interface IVtuberResponse {
    data: IVtuber;
    meta: IMeta;
}

export interface IVtubersResponse {
    data: IVtuber[];
    meta: IMeta;
}


export function getUrl(slug: string): string {
    return `${siteUrl}/vt/${slug}`
}




export async function getVtuberBySlug(slug: string): Promise<IVtuber|null> {
    const query = qs.stringify(
        {
            filters: {
                slug: {
                    $eq: slug
                }
            }
        }
    )

    const res = await fetch(`${strapiUrl}/api/vtubers?${query}`);
    if (!res.ok) {
        console.error(`error inside getVtuberBySlug-- ${res.statusText}`);
        return null;
    }
    const vtuber = await res.json();
    return vtuber.data[0];
}

export async function getVtuberById(id: number): Promise<IVtuber|null> {
    const res = await fetch(`${strapiUrl}/api/vtubers?filters[id][$eq]=${id}`);
    if (!res.ok) {
        console.error(`error inside getVtuberById-- ${res.statusText}`);
        return null;
    }
    const vtuber = await res.json();
    return vtuber
}

export async function getVtubers(): Promise<IVtubersResponse|null> {
    const res = await fetch(`${strapiUrl}/api/vtubers`);
    if (!res.ok) {
        console.error(`error inside getVtubers-- ${res.statusText}`);
        return null;
    }
    const vtubers = await res.json();
    return vtubers;
        
}

export async function getAllVtubers(): Promise<IVtuber[] | null> {
    const pageSize = 100;

    const allVtubers: IVtuber[] = [];
    let currentPage = 1;

    while (true) {
        const query = qs.stringify({
            // populate: {
            //     vtuber: {
            //         fields: ['slug', 'displayName', 'image', 'imageBlur'],
            //     },
            //     muxAsset: {
            //         fields: ['playbackId', 'assetId'],
            //     },
            //     thumbnail: {
            //         fields: ['cdnUrl', 'url'],
            //     },
            //     tagVodRelations: {
            //         fields: ['tag'],
            //         populate: ['tag'],
            //     },
            //     videoSrcB2: {
            //         fields: ['url', 'key', 'uploadId', 'cdnUrl'],
            //     },
            // },
            // sort: {
            //     date: sortDesc ? 'desc' : 'asc',
            // },
            pagination: {
                pageSize,
                page: currentPage,
            },
        });

        try {
            console.log(`getting /api/vtubers page=${currentPage}`);
            const response = await fetch(`${strapiUrl}/api/vtubers?${query}`, fetchVtubersOptions);

            if (!response.ok) {
                // Handle non-successful response (e.g., HTTP error)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData.data || responseData.data.length === 0) {
                // No more data to fetch
                break;
            }

            allVtubers.push(...responseData.data);
            currentPage++;
        } catch (error) {
            // Handle fetch error
            if (error instanceof Error) {
                console.error('Error fetching data:', error.message);
            }
            return null;
        }
    }

    return allVtubers;
}