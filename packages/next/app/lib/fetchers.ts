import { strapiUrl } from "./constants";

export async function fetchPaginatedData(apiEndpoint: string, pageSize: number, queryParams: Record<string, any> = {}): Promise<any[]> {
    let data: any[] = [];
    let totalDataCount: number = 0;
    let totalRequestsNeeded: number = 1;

    for (let requestCounter = 0; requestCounter < totalRequestsNeeded; requestCounter++) {
        const humanReadableRequestCount = requestCounter + 1;
        const params = new URLSearchParams({
            'pagination[page]': humanReadableRequestCount.toString(),
            'pagination[pageSize]': pageSize.toString(),
            ...queryParams,
        });
        const url = `${strapiUrl}${apiEndpoint}?${params}`;
        
        const response = await fetch(url, {
            method: 'GET'
        });

        const responseData = await response.json();


        if (requestCounter === 0) {
            totalDataCount = responseData.meta.pagination.total;
            totalRequestsNeeded = Math.ceil(totalDataCount / pageSize);
        }
        data = data.concat(responseData.data);
    }

    return data;
}
