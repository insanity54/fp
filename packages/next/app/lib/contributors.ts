import { strapiUrl } from "./constants";
import fetchAPI from "./fetch-api";

export interface IContributor {
    id: number;
    attributes: {
        name: string;
        url?: string;
        isFinancialDonor: boolean;
        isVodProvider: boolean;
    }
}


export async function getContributors(): Promise<IContributor[]|null> {
    try {
        const res = await fetchAPI(`/contributors`);
        return res.data;
    } catch (e) {
        console.error(`error while fetching contributors`)
        console.error(e);
        return null;
    }
}
