
import { strapiUrl, siteUrl } from './constants';
import { getDateFromSafeDate, getSafeDate } from './dates';
import { IVtuber, IVtuberResponse } from './vtubers';
import { IStream, IStreamResponse } from './streams';
import qs from 'qs';
import { ITagVodRelationsResponse } from './tag-vod-relations';
import { ITimestampsResponse } from './timestamps';
import { IMeta, IMuxAsset, IMuxAssetResponse } from './types';
import { IB2File, IB2FileResponse } from '@/lib/b2File';
import fetchAPI from './fetch-api';
import { IUserResponse } from './users';

/**
 * Dec 2023 CUIDs were introduced.
 * Going forward, use CUIDs where possible.
 * safeDates are retained for backwards compatibility.
 * 
 * @see https://www.w3.org/Provider/Style/URI
 */
export interface IVodPageProps {
    params: {
        safeDateOrCuid: string;
        slug: string;
    };
}

export interface IVodsResponse {
    data: IVod[];
    meta: IMeta;
}

export interface IVodResponse {
    data: IVod;
    meta: IMeta;
}

export interface IVod {
    id: number;
    attributes: {
        stream: IStreamResponse;
        publishedAt?: string;
        cuid: string;
        title?: string;
        duration?: number;
        date: string;
        date2: string;
        muxAsset: IMuxAssetResponse;
        thumbnail?: IB2FileResponse;
        vtuber: IVtuberResponse;
        tagVodRelations: ITagVodRelationsResponse;
        timestamps: ITimestampsResponse;
        video240Hash: string;
        videoSrcHash: string;
        videoSrcB2: IB2FileResponse | null;
        announceTitle: string;
        announceUrl: string;
        uploader: IUserResponse;
        note: string;
    }
}

const fetchVodsOptions = {
    next: {
        tags: ['vods']
    }
}


export async function getVodFromSafeDateOrCuid(safeDateOrCuid: string): Promise<IVod|null> {
    let vod: IVod|null;
    let date: Date;
    if (!safeDateOrCuid) {
        console.log(`safeDateOrCuid was missing`);
        return null;
    } else if (/^[0-9a-z]{10}$/.test(safeDateOrCuid)) {
        console.log('this is a CUID!');
        vod = await getVodByCuid(safeDateOrCuid);
        if (!vod) return null;
    } else {
        console.log('This is a safeDate!');
        date = await getDateFromSafeDate(safeDateOrCuid);
        if (!date) {
            console.log('there is no date')
            return null;
        } else {
            console.log(`date=${date}`)
        }
        vod = await getVodForDate(date);
    }
    return vod;
}

export function getUrl(vod: IVod, slug: string, date: string): string {
    return `${siteUrl}/vt/${slug}/vod/${getSafeDate(date)}`
}


export function getPaginatedUrl(): (slug: string, pageNumber: number) => string {
    return (slug: string, pageNumber: number) => {
        return `${siteUrl}/vt/${slug}/vods/${pageNumber}`
    }
}


/** @deprecated old format for futureporn.net/api/v1.json, which is deprecated. Please use getUrl() instead */
export function getDeprecatedUrl(vod: IVod): string {
    return `${siteUrl}/vods/${getSafeDate(vod.attributes.date2)}`
}

export async function getNextVod(vod: IVod): Promise<IVod | null> {
    const query = qs.stringify({
        filters: {
            date2: {
                $gt: vod.attributes.date2
            },
            vtuber: {
                slug: {
                    $eq: vod.attributes.vtuber.data.attributes.slug
                }
            },
            publishedAt: {
                $notNull: true
            }
        },
        sort: {
            date2: 'asc'
        },
        fields: ['date2', 'title', 'announceTitle'],
        populate: {
            vtuber: {
                fields: ['slug']
            }
        }
    })
    const res = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions);
    if (!res.ok) throw new Error('could not fetch next vod');
    const json = await res.json();
    const nextVod = json.data[0];
    if (!nextVod) return null;
    return nextVod

}

export function getLocalizedDate(vod: IVod): string {
    return new Date(vod.attributes.date2).toLocaleDateString()
}

export async function getPreviousVod(vod: IVod): Promise<IVod> {
    const res = await fetchAPI(
        '/vods',
        {
            filters: {
                date2: {
                    $lt: vod.attributes.date2
                },
                vtuber: {
                    slug: {
                        $eq: vod.attributes.vtuber.data.attributes.slug
                    }
                }
            },
            sort: {
                date2: 'desc'
            },
            fields: ['date2', 'title', 'announceTitle'],
            populate: {
                vtuber: {
                    fields: ['slug']
                }
            },
            pagination: {
                limit: 1
            }
        },
        fetchVodsOptions
    )
    return res.data[0];
}

export async function getVodByCuid(cuid: string): Promise<IVod | null> {
    const query = qs.stringify(
        {
            filters: {
                cuid: {
                    $eq: cuid
                }
            },
            populate: {
                vtuber: {
                    fields: ['slug', 'displayName', 'image', 'imageBlur', 'themeColor']
                },
                muxAsset: {
                    fields: ['playbackId', 'assetId']
                },
                thumbnail: {
                    fields: ['cdnUrl', 'url']
                },
                tagVodRelations: {
                    fields: ['tag', 'createdAt', 'creatorId'],
                    populate: ['tag']
                },
                videoSrcB2: {
                    fields: ['url', 'key', 'uploadId', 'cdnUrl']
                },
                stream: {
                    fields: ['archiveStatus', 'date', 'tweet', 'cuid']
                }
            }
        })

        try {
            const res = await fetch(`${strapiUrl}/api/vods?${query}`, { cache: 'no-store', next: { tags: ['vods'] } })
            if (!res.ok) {
                throw new Error('failed to fetch vodForDate')
            }
            const json = await res.json()
            const vod = json.data[0]
            if (!vod) return null;
            return vod;
        } catch (e) {
            if (e instanceof Error) {
                console.error(e)
            }
            return null;
        }
}

export async function getVodForDate(date: Date): Promise<IVod | null> {
    // if (!date) return null;
    // console.log(date)
    // console.log(`getting vod for ${date.toISOString()}`)
    try {
        const iso8601DateString = date.toISOString().split('T')[0];
        const query = qs.stringify(
            {
                filters: {
                    date2: {
                        $eq: date.toISOString()
                    }
                },
                populate: {
                    vtuber: {
                        fields: ['slug', 'displayName', 'image', 'imageBlur', 'themeColor']
                    },
                    muxAsset: {
                        fields: ['playbackId', 'assetId']
                    },
                    thumbnail: {
                        fields: ['cdnUrl', 'url']
                    },
                    tagVodRelations: {
                        fields: ['tag', 'createdAt', 'creatorId'],
                        populate: ['tag']
                    },
                    videoSrcB2: {
                        fields: ['url', 'key', 'uploadId', 'cdnUrl']
                    },
                    stream: {
                        fields: ['archiveStatus', 'date', 'tweet', 'cuid']
                    }
                }
            }
        )
        const res = await fetch(`${strapiUrl}/api/vods?${query}`, { cache: 'no-store', next: { tags: ['vods'] } })
        if (!res.ok) {
            throw new Error('failed to fetch vodForDate')
        }
        const json = await res.json()
        const vod = json.data[0]
        if (!vod) return null;
        return vod;
    } catch (e) {

        return null;
    }
}

export async function getVod(id: number): Promise<IVod|null> {
    const query = qs.stringify(
        {
            filters: {
                id: {
                    $eq: id
                }
            }
        }
    )
    const res = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
}

export async function getVods(page: number = 1, pageSize: number = 25, sortDesc = true): Promise<IVodsResponse> {
    const query = qs.stringify(
        {
            populate: {
                vtuber: {
                    fields: ['slug', 'displayName', 'image', 'imageBlur']
                },
                muxAsset: {
                    fields: ['playbackId', 'assetId']
                },
                thumbnail: {
                    fields: ['cdnUrl', 'url']
                },
                tagVodRelations: {
                    fields: ['tag'],
                    populate: ['tag']
                },
                videoSrcB2: {
                    fields: ['url', 'key', 'uploadId', 'cdnUrl']
                }
            },
            sort: {
                date: (sortDesc) ? 'desc' : 'asc'
            },
            pagination: {
                pageSize: pageSize,
                page: page
            }
        }
    )

    const res = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions);
    if (!res.ok) {
        throw new Error('Failed to fetch vods');
    }
    const json = await res.json()
    return json;
}



export async function getAllVods(): Promise<IVod[] | null> {
    const pageSize = 100; // Adjust this value as needed
    const sortDesc = true; // Adjust the sorting direction as needed

    const allVods: IVod[] = [];
    let currentPage = 1;

    while (true) {
        const query = qs.stringify({
            populate: {
                vtuber: {
                    fields: ['slug', 'displayName', 'image', 'imageBlur'],
                },
                muxAsset: {
                    fields: ['playbackId', 'assetId'],
                },
                thumbnail: {
                    fields: ['cdnUrl', 'url'],
                },
                tagVodRelations: {
                    fields: ['tag'],
                    populate: ['tag'],
                },
                videoSrcB2: {
                    fields: ['url', 'key', 'uploadId', 'cdnUrl'],
                },
            },
            sort: {
                date: sortDesc ? 'desc' : 'asc',
            },
            pagination: {
                pageSize,
                page: currentPage,
            },
        });

        try {
            const response = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions);

            if (!response.ok) {
                // Handle non-successful response (e.g., HTTP error)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (!responseData.data || responseData.data.length === 0) {
                // No more data to fetch
                break;
            }

            allVods.push(...responseData.data);
            currentPage++;
        } catch (error) {
            // Handle fetch error
            if (error instanceof Error) {
                console.error('Error fetching data:', error.message);
            }
            return null;
        }
    }

    return allVods;
}



export async function getVodsForVtuber(vtuberId: number, page: number = 1, pageSize: number = 25, sortDesc = true): Promise<IVodsResponse | null> {
    const query = qs.stringify(
        {
            populate: {
                thumbnail: {
                    fields: ['cdnUrl', 'url']
                },
                vtuber: {
                    fields: [
                        'id',
                        'slug',
                        'displayName',
                        'image',
                        'imageBlur'
                    ]
                },
                videoSrcB2: {
                    fields: ['url', 'key', 'uploadId', 'cdnUrl']
                }
            },
            filters: {
                vtuber: {
                    id: {
                        $eq: vtuberId
                    }
                }
            },
            pagination: {
                page: page,
                pageSize: pageSize
            },
            sort: {
                date: (sortDesc) ? 'desc' : 'asc'
            }
        }
    )
    const res = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions)
    if (!res.ok) return null;
    const data = await res.json() as IVodsResponse;
    return data;

}


export async function getVodsForTag(tag: string): Promise<IVodsResponse|null> {
    const query = qs.stringify(
        {
            populate: {
                vtuber: {
                    fields: ['slug', 'displayName', 'image', 'imageBlur']
                },
                videoSrcB2: {
                    fields: ['url', 'key', 'uploadId', 'cdnUrl']
                }
            },
            filters: {
                tagVodRelations: {
                    tag: {
                        name: {
                            $eq: tag
                        }
                    }
                }
            }
        }
    )
    const res = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions)
    if (!res.ok) return null;
    const vods = await res.json()
    return vods;
}

/**
 * This returns stale data, because futureporn-historian is broken.
 * @todo get live data from historian
 * @see https://git.futureporn.net/futureporn/futureporn-historian/issues/1
 */
export async function getProgress(vtuberSlug: string): Promise<{ complete: number; total: number }> {
    const query = qs.stringify({
        filters: {
            vtuber: {
                slug: {
                    $eq: vtuberSlug
                }
            }
        }
    })
    const data = await fetch(`${strapiUrl}/api/vods?${query}`, fetchVodsOptions)
        .then((res) => res.json())
        .then((g) => {
            return g
        })

    const total = data.meta.pagination.total

    return {
        complete: total,
        total: total
    }
}