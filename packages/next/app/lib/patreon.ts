import { strapiUrl, patreonVideoAccessBenefitId, giteaUrl } from './constants'
import { IAuthData } from '@/components/auth';

export interface IPatron {
    username: string;
    vanityLink?: string;
}


export interface ICampaign {
    pledgeSum: number;
    patronCount: number;
}


export interface IMarshalledCampaign {
    data: {
        attributes: {
            pledge_sum: number,
            patron_count: number
        }
    }
}



export function isEntitledToPatronVideoAccess(authData: IAuthData): boolean {
    if (!authData.user?.patreonBenefits) return false;
    const patreonBenefits = authData.user.patreonBenefits
    return (patreonBenefits.includes(patreonVideoAccessBenefitId))
}


export async function getPatrons(): Promise<IPatron[]> {
    const res = await fetch(`${strapiUrl}/api/patreon/patrons`);
    return res.json();
}


export async function getCampaign(): Promise<ICampaign> {
    const res = await fetch('https://www.patreon.com/api/campaigns/8012692', {
        headers: {
            accept: 'application/json'
        },
        next: {
            revalidate: 43200 // 12 hour cache
        }
    })
    const campaignData = await res.json();
    const data = {
        patronCount: campaignData.data.attributes.patron_count,
        pledgeSum: campaignData.data.attributes.campaign_pledge_sum
    }
    return data
}
