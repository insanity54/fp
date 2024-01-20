import React from 'react';
import { IToy, IToysResponse } from '@/lib/toys';
import { IVtuber } from '@/lib/vtubers';
import Link from 'next/link';
import Image from 'next/image';

export interface IToyProps {
  toy: IToy;
}

export interface IToysListsProps {
  vtuber: IVtuber;
  toys: IToysResponse;
  page: number;
  pageSize: number;
}

// interface VodsListProps {
//   vtuber: IVtuber;
//   vods: IVods;
//   page: number;
//   pageSize: number;
// }



export function ToysListHeading({ slug, displayName }: { slug: string, displayName: string }): React.JSX.Element {
  return (
    <div className='box'>
      <h3 className='title'>
        <Link href={`/vt/${slug}`}>{displayName}&apos;s</Link> Toys
      </h3>
    </div>
  )
}

// export interface IToy {
//   id: number;
//   tags: ITag[];
//   linkTag: ITag;
//   make: string;
//   model: string;
//   aspectRatio: string;
//   image2: string;
// }

export function ToyItem({ toy }: IToyProps) {
  const displayName = `${toy.attributes.make} ${toy.attributes.model}`;
  // if (!toy?.linkTag) return <div><span className='mr-2'>toy.linkTag is missing which is a problem</span><br/></div>
  return (
    <div className="column is-half-mobile is-one-quarter-tablet is-one-fifth-desktop is-1-widescreen">

      <Link href={`/tags/${toy.attributes.linkTag.data.attributes.name}`}>
        <figure style={{ position: 'relative', width: '100px', height: '100px' }}>
          <Image 
            src={toy.attributes.image2}
            alt={displayName}
            objectFit='contain'
            
            fill
          />
        </figure>
        <p className="heading">{toy.attributes.model}</p>
      </Link>
    </div>
  );
};

export function ToysList({ vtuber, toys, page = 1, pageSize = 24 }: IToysListsProps) {
  return (
    <div className='section'>
      {/* <pre><code>{JSON.stringify(toys, null, 2)} toys:{toys.data.length} page:{page} pageSize:{pageSize}</code></pre> */}
      <div className="columns is-mobile is-multiline">
        {toys.data.map((toy: IToy) => (
          // <p className='mr-3'>{JSON.stringify(toy, null, 2)}</p>
          <ToyItem key={toy.id} toy={toy} />
        ))}
      </div>
    </div>
  )
};
