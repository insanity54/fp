
import Link from 'next/link'

export default async function Page() {
    return (
        <>
            <div className="content">
                <div className="block">
                    <div className="box">

                        <p className="title">RSS Feed</p>

                        <p className="subtitle">Keep up to date with new VODs using Real Simple Syndication (RSS).</p>

                        <p>Don&apos;t have a RSS reader? Futureporn recommends <Link target="_blank" href="https://fraidyc.at/">Fraidycat <span className="icon"><i className="fas fa-external-link-alt"></i></span></Link></p>

                        <div className='field is-grouped'>
                            <p className='control'><Link className="my-5 button is-primary" href="/feed/feed.xml">ATOM</Link></p>
                            <p className="control"><Link className="my-5 button" href="/feed/rss.xml">RSS</Link></p>
                            <p className='control'><Link className="my-5 button" href="/feed/feed.json">JSON</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

