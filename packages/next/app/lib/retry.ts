export async function retry(fn: Function, maxRetries: number) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            console.error(`Error during fetch attempt ${retries + 1}:`, error);
            retries++;
        }
    }
    console.error(`Max retries (${maxRetries}) reached. Giving up.`);
    return null;
}