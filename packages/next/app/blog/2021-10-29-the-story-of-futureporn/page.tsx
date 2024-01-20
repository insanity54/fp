
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"

export default async function Page() {


    
    return (
        <div className="content">
        <div className="box">

            <div className="block">




                <h1>The Story of Futureporn</h1>

                <p>2020 was a busy time for me. I started a small business, attended lots of support group meetings, and rode my bicycle more than ever before. I often found myself away from home during times when Melody was streaming on Chaturbate.</p>

                <p>You probably know that unlike other video streaming platforms, Chaturbate doesn’t store any VODs. When I missed a stream, I felt sad. I felt like I had missed out and there’s no way I’d ever find out what happened.</p>

                <p>I’m pretty handy with computer software. Creating programs and websites has been my biggest passion for my entire life. In order to never miss a ProjektMelody livestream again, I resolved to create some software that would automatically record Melody’s Chaturbate streams.</p>

                <p>I put the project on hold for a few months, because I didn’t think I could make a website that could handle the traffic that the Science Team would generate.</p>

                <p>I couldn’t shake the idea, though. I wanted Futureporn to exist no matter what!</p>

                <p>I’ve been working on this project off and on for about a year and a half. It’s gone through several iterations, and each iteration has taught me something new. Right now, the website is usable for finding and downloading ProjektMelody Chaturbate VODs. Every VOD has a link to Melody’s tweet which originally announced the stream, and a title/description derived from said tweet. I have archived all of her known Chaturbate streams.</p>

                <p>The project has evolved over time. Originally, I wanted to have a place to go when I missed one of Melody’s livestreams. Now, the project is becoming a sort of a time capsule. We’ve all seen how Melody has been de-platformed a half dozen times, and I’ve taken this to heart. Platforms are a problem for data preservation! This is one of the reasons for why I chose to use the Inter-Planetary File System (<Link target="_blank" href="https://ipfs.io/">IPFS<FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>.)</p>

                <p>IPFS can end 404s through “pinning,” a way of mirroring a file across several different computers. It’s a way for computers to work together to serve content instead of working independently, thus gaining redundancy and performance benefits. I see a future where pinning files on IPFS becomes as easy as pinning a photo on Pinterest. Fans of ProjektMelody can pin the VODs on Futureporn, increasing that VOD’s replication and servability to future viewers.</p>

                <p>But wait, there’s more! I have been thinking about a bunch of other stuff that could be done with past VODs. I think the most exciting thing would be to use computer vision to parse Melody’s vibrator activity from the video, and export to a data file. This data file could be used to send good vibes to a viewer’s vibrator in-sync with VOD playback. Feel what Melody feels! Very exciting, very sexy! This is a long-term goal for Futureporn.</p>

                <p>I have several goals for Futureporn, as listed on the <Link href="/goals">Goals page</Link>. A bunch of them have to do with increasing video playback performance, user interface design, but there’s a few that are pretty eccentric… Serving ProjektMelody VODs to Mars, for example!</p>

                <p>I hope this site is useful to all the Science Team!</p>

                <article className="mt-5 message is-success">
                    <div className="message-body">
                        <p>Futureporn needs financial support to continue improving. If you enjoy this website, please consider <Link target="_blank" href="https://patreon.com/CJ_Clippy">becoming a patron<FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>.</p>
                    </div>
                </article>

            </div>
        </div>
    </div>

    )
}