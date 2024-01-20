import { IMeta } from "./types";

export interface IB2File {
    id: number;
    attributes: {
        url: string;
        key: string;
        uploadId: string;
        cdnUrl: string;
    }
}
export interface IB2FileResponse {
    data: IB2File;
    meta: IMeta;
}