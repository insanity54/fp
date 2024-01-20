

import qs from 'qs';
import { strapiUrl } from './constants'
import { IAuthData } from '@/components/auth';
import { ITagsResponse, ITag, ITagResponse } from './tags';
import { IMeta } from './types';

export interface ITimestamp {
    id: number;
    attributes: {
        time: number;
        tagName: string;
        tnShort: string;
        tagId: number;
        vodId: number;
        tag: ITagResponse;
        createdAt: string;
        creatorId: number;
    }
}



export interface ITimestampResponse {
    data: ITimestamp;
    meta: IMeta;
}

export interface ITimestampsResponse {
    data: ITimestamp[];
    meta: IMeta;
}

function truncateString(str: string, maxLength: number) {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - 1) + '…';
}

export function deleteTimestamp(authData: IAuthData, tsId: number) {
    return fetch(`${strapiUrl}/api/timestamps/deleteMine/${tsId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            else return res.json();
        })
        .catch((e) => {
            console.error(e);
            // setError('root.serverError', { message: e.message })
        })
}

export async function createTimestamp(
    authData: IAuthData, 
    tagId: number, 
    vodId: number, 
    time: number
): Promise<ITimestamp | null> {
    if (!authData?.user?.id || !authData?.accessToken) throw new Error('User must be logged in to create timestamps');
    const query = qs.stringify({
        populate: '*'
    });
    const response = await fetch(`${strapiUrl}/api/timestamps?${query}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: {
                time: Math.floor(time),
                tag: tagId,
                vod: vodId,
                creatorId: authData.user.id
            }
        })
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json?.error?.message || response.statusText);
    }

    return json.data;
}



export async function getTimestampsForVod(vodId: number, page: number = 1, pageSize: number = 25): Promise<ITimestamp[]> {
    const query = qs.stringify({
        filters: {
            vod: {
                id: {
                    $eq: vodId,
                },
            },
        },
        populate: '*',
        sort: 'time:asc',
        pagination: {
            page: page,
            pageSize: pageSize,
        },
    });

    const response = await fetch(`${strapiUrl}/api/timestamps?${query}`);
    const data = await response.json() as ITimestampsResponse;

    const timestamps: ITimestamp[] = data.data || [];

    // If there are more pages, recursively fetch them and concatenate the results
    if (data.meta.pagination && (data.meta.pagination.page < data.meta.pagination.pageCount)) {
        const nextPage = (data.meta.pagination.page + 1);
        const nextPageTimestamps = await getTimestampsForVod(vodId, nextPage, pageSize);
        timestamps.push(...nextPageTimestamps);
    }

    return timestamps;
}