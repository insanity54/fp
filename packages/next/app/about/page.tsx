import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
// import { getProgress } from '../lib/vods'

export default async function Page() {
    // const { complete, total } = await getProgress('projektmelody')

    return (
        <>
        <div className="content">
            <div className="box">

                <div className="block">

                    <h1>About</h1>
                    <div className="section hero is-primary">
                        <p>Futureporn is a fanmade public archive of NSFW R18 vtuber livestreams.</p>
                    </div>

                    <h1>Mission</h1>
                    <div className="section">

                        <p>It&apos;s a lofty goal, but Futureporn aims to become <b>the Galaxy&apos;s best VTuber hentai site.</b></p>
                    </div>

                        <h2>How do we get there?</h2>

                    <div className="section">
                        <h3>1. Solve the viewer&apos;s common problems</h3>

                        <p>Viewers want to watch livestream VODs on their own time. Futureporn collects vods from public streams, and caches them for later viewing.</p>

                        <p>Viewers want to find content that interests them. Futureporn enables vod tagging for easy browsing.</p>
                    </div>

                    <div className="section">
                        <h3>2. Solve the streamer&apos;s common problems</h3>

                        <p>Platforms like PH are not rising to the needs of VTubers. Instead of offering support and resources, they restrict and ban top talent.</p>

                        <p>Futureporn is different, embracing the medium and leveraging emerging technologies to amplify VTuber success.</p>
                    </div>

                    <div className="section">
                        <h3>3. Scale beyond Earth</h3>

                        <p>Piggybacking on <Link href="/faq#ipfs">IPFS</Link>&apos; content-addressable capabilities and potential to end 404s, VODs preserved here can withstand the test of time, and eventually persist <Link href="/goals">off-world</Link>.</p>
                    </div>

                    <div className="section">
                        <article className="mt-5 message is-success">
                            <div className="message-body">
                                <p>Futureporn needs financial support to continue improving. If you enjoy this website, please consider <Link target="_blank" href="https://patreon.com/CJ_Clippy">becoming a patron<FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>.</p>
                            </div>
                        </article>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}
