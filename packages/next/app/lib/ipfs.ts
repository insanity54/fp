export function buildIpfsUrl (urlFragment: string): string {
    return `https://ipfs.io/ipfs/${urlFragment}`
}

export function buildPatronIpfsUrl (cid: string, token: string): string {
    return `https://gw.futureporn.net/ipfs/${cid}?token=${token}`
}
