




export interface IMuxAsset {
	id: number;
	attributes: {
		playbackId: string;
		assetId: string;
	}
}

export interface IPagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

export interface IMuxAssetResponse {
	data: IMuxAsset;
	meta: IMeta;
}

export interface IMeta {
	pagination: IPagination;
}
