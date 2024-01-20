
import FundingGoal from "@/components/funding-goal";
import VodCard from "@/components/vod-card";
import { getVodTitle } from "@/components/vod-page";
import { getVods } from '@/lib/vods';
import { IVod } from "@/lib/vods";
import { getVtubers, IVtuber } from "./lib/vtubers";
import VTuberCard from "./components/vtuber-card";
import Link from 'next/link';
import { notFound } from "next/navigation";

export default async function Page() {
  const vods = await getVods(1, 9, true);
  const vtubers = await getVtubers();
  if (!vtubers) notFound();

  // return (
  //   <pre>
  //     <code>
  //       {JSON.stringify(vods.data, null, 2)}
  //     </code>
  //   </pre>
  // )
  return (
    <>
      <div className="main">
        <section className="section">
          <div className="container">
            <h1 className="title">
              The Galaxy&apos;s Best VTuber Hentai Site
            </h1>
            <h2 className="subtitle">For adults only (NSFW)</h2>
          </div>
        </section>

        <section className="section">
          <FundingGoal />
        </section>

        <section className="section">

            <h2 className="is-2 title">Latest VODs</h2>
            <div className="columns is-multiline is-mobile">
              
              {vods.data.map((vod: IVod) => (
                <VodCard
                  key={vod.id}
                  id={vod.id}
                  title={getVodTitle(vod)}
                  date={vod.attributes.date2}
                  muxAsset={vod.attributes.muxAsset.data.attributes.assetId}
                  vtuber={vod.attributes.vtuber.data}
                  thumbnail={vod.attributes.thumbnail?.data?.attributes?.cdnUrl}
                />
              ))}
            </div>

            <Link className='button' href={`/latest-vods/1`}>See all Latest Vods</Link>
          </section>
          <section className="section">
            
            <h2 className="is-2 title">VTubers</h2>
            {/* <nav className="columns is-multiline">
              {vtubers.data.map((vtuber: IVtuber) =>
                <VTuberCard key={vtuber.id} {...vtuber} />
              )}
            </nav> */}
        </section>
      </div>
    </>
  );
}
