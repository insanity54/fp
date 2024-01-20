/**
 * Tag Vod Relations are an old name for what I'm now calling, "VodTag"
 * 
 * VodTags are Tags related to Vods
 * 
 */


import qs from 'qs';
import { strapiUrl } from './constants'
import { ITagResponse, IToyTagResponse } from './tags';
import { IVod, IVodResponse } from './vods';
import { IAuthData } from '@/components/auth';
import { IMeta } from './types';

export interface ITagVodRelation {
    id: number;
    attributes: {
        tag: ITagResponse | IToyTagResponse;
        vod: IVodResponse;
        creatorId: number;
        createdAt: string;
    }
}


export interface ITagVodRelationsResponse {
    data: ITagVodRelation[];
    meta: IMeta;
}




export async function deleteTvr(authData: IAuthData, tagId: number) {
    return fetch(`${strapiUrl}/api/tag-vod-relations/deleteMine/${tagId}`, {
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

export async function readTagVodRelation(accessToken: string, tagId: number, vodId: number): Promise<ITagVodRelation> {
    if (!tagId) throw new Error('readTagVodRelation requires tagId as second param');
    if (!vodId) throw new Error('readTagVodRelation requires vodId as second param');
    const findQuery = qs.stringify({
        filters: {
            $and: [
                {
                    tag: tagId
                }, {
                    vod: vodId
                }
            ]
        }
    });
    const res = await fetch(`${strapiUrl}/api/tag-vod-relations?${findQuery}`);
    const json = await res.json();
    return json.data[0];
}

export async function createTagVodRelation(accessToken: string, tagId: number, vodId: number): Promise<ITagVodRelation> {
    if (!accessToken) throw new Error('Must be logged in');
    if (!tagId) throw new Error('tagId is required.');
    if (!vodId) throw new Error('vodId is required.');
    const payload = {
        tag: tagId,
        vod: vodId
    }
    const res = await fetch(`${strapiUrl}/api/tag-vod-relations`, {
        method: 'POST',
        body: JSON.stringify({ data: payload }),
        headers: {
            authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json'
        }
    })
    const json = await res.json();
    console.log(json)
    return json.data;
}

export async function readOrCreateTagVodRelation (accessToken: string, tagId: number, vodId: number): Promise<ITagVodRelation> {
    console.log(`Checking if the tagVodRelation with tagId=${tagId}, vodId=${vodId} already exists`);
    const existingTagVodRelation = await readTagVodRelation(accessToken, tagId, vodId);
    if (!!existingTagVodRelation) {
        console.log(`there is an existing TVR so we return it`);
        console.log(existingTagVodRelation);
        return existingTagVodRelation
    }
    const newTagVodRelation = await createTagVodRelation(accessToken, tagId, vodId);
    return newTagVodRelation;
}

// export async function createTagAndTvr(setError: Function, authData: IAuthData, tagName: string, vodId: number) {
//     if (!authData) throw new Error('Must be logged in');
//     if (!tagName || tagName === '') throw new Error('tagName cannot be empty');
//     const data = {
//         tagName: tagName,
//         vodId: vodId
//     };
//     try {
//         const res = await fetch(`${strapiUrl}/api/tag-vod-relations/tag`, {
//             method: 'POST',
//             body: JSON.stringify({ data }),
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${authData.accessToken}`
//             },
//         });
//         const json = await res.json();
//         return json.data;
//     } catch (e) {
//         setError('global', { type: 'idk', message: e })
//     }
// }


export async function getTagVodRelationsForVtuber(vtuberId: number, page: number = 1, pageSize: number = 25): Promise<ITagVodRelationsResponse|null> {
    // get the tag-vod-relations where the vtuber is the vtuber we are interested in.
    const query = qs.stringify(
        {
            populate: {
                tag: {
                    fields: ['id', 'name'],
                    populate: {
                        toy: {
                            fields: ['linkTag', 'make', 'model', 'image2'],
                            populate: {
                                linkTag: {
                                    fields: ['name']
                                }
                            }
                        }
                    }
                },
                vod: {
                    populate: {
                        vtuber: {
                            fields: ['slug']
                        }
                    }
                }
            },
            filters: {
                vod: {
                    vtuber: {
                        id: {
                            $eq: vtuberId
                        }
                    }
                },
                tag: {
                    toy: {
                        linkTag: {
                            name: {
                                $notNull: true
                            }
                        }
                    }
                }
            },
            pagination: {
                page: page,
                pageSize: pageSize
            },
            sort: {
                id: 'desc'
            }
        }
    )
    // we need to return an IToys object
    // to get an IToys object, we have to get a list of toys from tvrs.


    const res = await fetch(`${strapiUrl}/api/tag-vod-relations?${query}`);
    if (!res.ok) return null;
    const tvrs = await res.json()
    return tvrs;
}

