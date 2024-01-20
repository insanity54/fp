import { IMeta } from "./types";


export interface IUser {
    id: number;
    attributes: {
        username: string;
        vanityLink?: string;
        image: string;
    }
}

export interface IUserResponse {
	data: IUser;
	meta: IMeta;
}