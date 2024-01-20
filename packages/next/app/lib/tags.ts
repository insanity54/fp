import { strapiUrl } from './constants'
import { fetchPaginatedData } from './fetchers';
import { IVod } from './vods';
import slugify from 'slugify';
import { IToy } from './toys';
import { IAuthData } from '@/components/auth';
import qs from 'qs';
import { IMeta } from './types';


export interface ITag {
    id: number;
    attributes: {
        name: string;
        count: number;
    }
}

export interface ITagsResponse {
    data: ITag[];
    meta: IMeta;
}

export interface ITagResponse {
    data: ITag;
    meta: IMeta;
}

export interface IToyTagResponse {
    data: IToyTag;
    meta: IMeta;
}


export interface IToyTag extends ITag {
    toy: IToy;
}



export function getTagHref(name: string): string {
    return `/tags/${slugify(name)}`
}


export async function createTag(accessToken: string, tagName: string): Promise<ITag> {
    const payload = {
        name: slugify(tagName)
    };
    const res = await fetch(`${strapiUrl}/api/tags`, {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({ data: payload })
    });
    const json = await res.json();
    console.log(json);
    if (!!json?.error) throw new Error(json.error.message);
    if (!json?.data) throw new Error('created tag was missing data');
    return json.data as ITag;
}

export async function readTag(accessToken: string, tagName: string): Promise<ITag | null> {
    
    const findQuery = qs.stringify({
        filters: {
            name: {
                $eq: tagName
            }
        }
    });
    const findResponse = await fetch(`${strapiUrl}/api/tags?${findQuery}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const json = await findResponse.json();
    return json.data[0];
}

export async function readOrCreateTag(accessToken: string, tagName: string): Promise<ITag> {
    console.log(`Checking if the tagName=${tagName} already exists`);

    const existingTag = await readTag(accessToken, tagName);
    if (!!existingTag) {
        console.log('there is an existing tag so we return it');
        console.log(existingTag);
        return existingTag;
    }

    const newTag = await createTag(accessToken, tagName);
    return newTag;


}

export async function getTags(): Promise<ITag[]> {
    const tagVodRelations = await fetchPaginatedData('/api/tag-vod-relations', 100, { 'populate[0]': 'tag', 'populate[1]': 'vod' });

    // Create a Map to store tag data, including counts and IDs
    const tagDataMap = new Map<string, { id: number, count: number }>();

    // Populate the tag data map with counts and IDs
    tagVodRelations.forEach(tvr => {
        const tagName = tvr.attributes.tag.data.attributes.name;
        const tagId = tvr.attributes.tag.data.id;

        if (!tagDataMap.has(tagName)) {
            tagDataMap.set(tagName, { id: tagId, count: 1 });
        } else {
            const existingData = tagDataMap.get(tagName);
            if (existingData) {
                tagDataMap.set(tagName, { id: existingData.id, count: existingData.count + 1 });
            }
        }
    });

    // Create an array of Tag objects with id, name, and count
    const tags = Array.from(tagDataMap.keys()).map(tagName => {
        const tagData = tagDataMap.get(tagName);
        return {
            id: tagData ? tagData.id : -1,
            attributes: {
                name: tagName,
                count: tagData ? tagData.count : 0,
            }
        };
    });


    return tags;
}
