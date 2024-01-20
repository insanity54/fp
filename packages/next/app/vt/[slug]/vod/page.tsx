import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface IPageParams {
    params: {
        slug: string;
    }
}

export default function Page({ params: { slug } }: IPageParams) {
    redirect(`/vt/${slug}/vods`)
    return <Link href={`/vt/${slug}/vods`}>See {`/vt/${slug}/vods`}</Link>
}

