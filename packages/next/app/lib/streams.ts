
import { strapiUrl, siteUrl } from './constants';
import { getSafeDate } from './dates';
import { IVodsResponse } from './vods';
import { IVtuber, IVtuberResponse } from './vtubers';
import { ITweetResponse } from './tweets';
import { IMeta } from './types';
import qs from 'qs';


export interface IStream {
    id: number;
    attributes: {
        date: string;
        archiveStatus: 'good' | 'issue' | 'missing';
        vods: IVodsResponse;
        cuid: string;
        vtuber: IVtuberResponse;
        tweet: ITweetResponse;
        isChaturbateStream: boolean;
        isFanslyStream: boolean;
    }
}

export interface IStreamResponse {
    data: IStream;
    meta: IMeta;
}

export interface IStreamsResponse {
    data: IStream[];
    meta: IMeta;
}


const fetchStreamsOptions = {
    next: {
        tags: ['streams']
    }
}


export async function getStreamByCuid(cuid: string): Promise<IStream> {
    const query = qs.stringify({
        filters: {
            cuid: {
                $eq: cuid
            }
        },
        pagination: {
            limit: 1
        },
        populate: {
            vtuber: {
                fields: ['slug', 'displayName']
            },
            tweet: {
                fields: ['isChaturbateInvite', 'isFanslyInvite', 'url']
            },
            vods: {
                fields: ['note', 'cuid', 'publishedAt'],
                populate: {
                    tagVodRelations: {
                        fields: ['id']
                    },
                    timestamps: '*'
                }
            }
        }
    });
    const res = await fetch(`${strapiUrl}/api/streams?${query}`);
    const json = await res.json();
    return json.data[0];
}

export function getUrl(stream: IStream, slug: string, date: string): string {
    return `${siteUrl}/vt/${slug}/stream/${getSafeDate(date)}`
}


export function getPaginatedUrl(): (slug: string, pageNumber: number) => string {
    return (slug: string, pageNumber: number) => {
        return `${siteUrl}/vt/${slug}/streams/${pageNumber}`
    }
}



export function getLocalizedDate(stream: IStream): string {
    return new Date(stream.attributes.date).toLocaleDateString()
}




export async function getStreamsForYear(year: number): Promise<IStream[]> {
    const startOfYear = new Date(year, 0, 0);
    const endOfYear = new Date(year, 11, 31);

    const pageSize = 100; // Number of records per page
    let currentPage = 0;
    let allStreams: IStream[] = [];
  
    while (true) {
      const query = qs.stringify({
        filters: {
          date: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
        populate: {
            vtuber: {
                fields: ['displayName']
            }
        },
        pagination: {
            page: currentPage,
            pageSize: pageSize,
        }
      });
  
      const res = await fetch(`${strapiUrl}/api/streams?${query}`, fetchStreamsOptions);
  
      if (!res.ok) {
        // Handle error if needed
        console.error('here is the res.body')

        console.error((await res.text()));
        throw new Error(`Error fetching streams: ${res.status}`);
      }
  
      const json = await res.json();
      const streams = json as IStreamsResponse;
  
      if (streams.data.length === 0) {
        // No more records, break the loop
        break;
      }
  
      allStreams = [...allStreams, ...streams.data];
      currentPage += pageSize;
    }
  
    return allStreams;
  }

export async function getStream(id: number): Promise<IStream> {
    const query = qs.stringify({
        filters: {
            id: {
                $eq: id
            }
        }
    });
    const res = await fetch(`${strapiUrl}/api/vods?${query}`, fetchStreamsOptions);
    const json = await res.json();
    return json.data;
}




export async function getAllStreams(archiveStatuses = ['missing', 'issue', 'good']): Promise<IStream[]> {
    const pageSize = 100; // Adjust this value as needed
    const sortDesc = true; // Adjust the sorting direction as needed

    const allStreams: IStream[] = [];
    let currentPage = 1;

    while (true) {
        const query = qs.stringify({
            populate: {
                vtuber: {
                    fields: ['slug', 'displayName', 'image', 'imageBlur', 'themeColor'],
                },
                muxAsset: {
                    fields: ['playbackId', 'assetId'],
                },
                thumbnail: {
                    fields: ['cdnUrl', 'url'],
                },
                tagstreamRelations: {
                    fields: ['tag'],
                    populate: ['tag'],
                },
                videoSrcB2: {
                    fields: ['url', 'key', 'uploadId', 'cdnUrl'],
                },
                tweet: {
                    fields: ['isChaturbateInvite', 'isFanslyInvite']
                }
            },
            filters: {
                archiveStatus: {
                    '$in': archiveStatuses
                }
            },
            sort: {
                date: sortDesc ? 'desc' : 'asc',
            },
            pagination: {
                pageSize,
                page: currentPage,
            },
        });
        const response = await fetch(`${strapiUrl}/api/streams?${query}`, fetchStreamsOptions);
        const responseData = await response.json();

        if (!responseData.data || responseData.data.length === 0) {
            // No more data to fetch
            break;
        }

        allStreams.push(...responseData.data);
        currentPage++;
    }

    return allStreams;
}

export async function getStreamForVtuber(vtuberId: number, safeDate: string): Promise<IStream> {
    const query = qs.stringify({
        populate: {
            vods: {
                fields: [
                    'id',
                    'date'
                ]
            },
            tweet: {
                fields: [
                    'id'
                ]
            }
        }
    });

    const response = await fetch(`${strapiUrl}/api/streams?${query}`, fetchStreamsOptions);

    if (response.status !== 200) throw new Error('network fetch error while attempting to getStreamForVtuber');

    const responseData = await response.json();
    return responseData;
}

export async function getAllStreamsForVtuber(vtuberId: number, archiveStatuses = ['missing', 'issue', 'good']): Promise<IStream[]> {
    const maxRetries = 3;

    let retries = 0;
    let allStreams: IStream[] = [];
    let currentPage = 1;

    while (retries < maxRetries) {
        try {
            const query = qs.stringify({
                populate: '*',
                filters: {
                    archiveStatus: {
                        '$in': archiveStatuses
                    },
                    vtuber: {
                        id: {
                            $eq: vtuberId
                        }
                    }
                },
                sort: {
                    date: 'desc',
                },
                pagination: {
                    pageSize: 100,
                    page: currentPage,
                },
            });

            console.log(`strapiUrl=${strapiUrl}`)
            const response = await fetch(`${strapiUrl}/api/streams?${query}`, fetchStreamsOptions);

            if (response.status !== 200) {
                // If the response status is not 200 (OK), consider it a network failure
                const bod = await response.text();
                console.log(response.status);
                console.log(bod);
                retries++;
                continue;
            }

            const responseData = await response.json();

            if (!responseData.data || responseData.data.length === 0) {
                // No more data to fetch
                break;
            }

            allStreams.push(...responseData.data);
            currentPage++;
        } catch (error) {
            // Network failure or other error occurred
            retries++;
        }
    }

    if (retries === maxRetries) {
        throw new Error(`Failed to fetch streams after ${maxRetries} retries.`);
    }

    return allStreams;
}

export async function getStreamsForVtuber(vtuberId: number, page: number = 1, pageSize: number = 25, sortDesc = true): Promise<IStreamsResponse> {
    const query = qs.stringify(
        {
            populate: {
                vtuber: {
                    fields: [
                        'id',
                    ]
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
    return fetch(`${strapiUrl}/api/streams?${query}`, fetchStreamsOptions)
        .then((res) => res.json())
}


// /**
//  * This returns stale data, because futureporn-historian is broken.
//  * @todo get live data from historian
//  * @see https://gitea.futureporn.net/futureporn/futureporn-historian/issues/1
//  */
// export async function getProgress(vtuberSlug: string): Promise<{ complete: number; total: number }> {
//     const query = qs.stringify({
//         filters: {
//             vtuber: {
//                 slug: {
//                     $eq: vtuberSlug
//                 }
//             }
//         }
//     })
//     const data = await fetch(`${strapiUrl}/api/streams?${query}`, fetchStreamsOptions)
//         .then((res) => res.json())
//         .then((g) => {
//             return g
//         })

//     const total = data.meta.pagination.total

//     return {
//         complete: total,
//         total: total
//     }
// }