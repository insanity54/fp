import { IVtuberResponse } from "./vtubers";
import { IMeta } from "./types";

export interface ITweet {
    id: number;
    attributes: {
        date: string;
        date2: string;
        isChaturbateInvite: boolean;
        isFanslyInvite: boolean;
        cuid: string;
        json:  string;
        id_str: string;
        url: string;
        vtuber: IVtuberResponse;
    }
}

export interface ITweetResponse {
    data: ITweet;
    meta: IMeta;
}

export interface ITweetsResponse {
    data: ITweet[];
    meta: IMeta;
}

