import { authorName, authorEmail, siteUrl, title, description, siteImage, favicon, authorLink } from './constants'
import { Feed } from "feed";
import { getVods, getUrl, IVod } from '@/lib/vods'
import { ITagVodRelation } from '@/lib/tag-vod-relations';

export async function generateFeeds() {
    const feedOptions = {
        id: siteUrl,
        title: title,
        description: description,
        link: siteUrl,
        language: 'en',
        image: siteImage,
        favicon: favicon,
        copyright: '',
        generator: ' ',
        feedLinks: {
            json: `${siteUrl}/feed/feed.json`,
            atom: `${siteUrl}/feed/feed.xml`
        },
        author: {
            name: authorName,
            email: authorEmail,
            link: authorLink
        }
    };

    const feed = new Feed(feedOptions);

    const vods = await getVods()

    vods.data.map((vod: IVod) => {
        feed.addItem({
            title: vod.attributes.title || vod.attributes.announceTitle,
            description: vod.attributes.title, // @todo vod.attributes.spoiler or vod.attributes.note could go here
            content: vod.attributes.tagVodRelations.data.map((tvr: ITagVodRelation) => tvr.attributes.tag.data.attributes.name).join(' '),
            link: getUrl(vod, vod.attributes.vtuber.data.attributes.slug, vod.attributes.date2),
            date: new Date(vod.attributes.date2),
            image: vod.attributes.vtuber.data.attributes.image
        })
    })


    return {
        atom1: feed.atom1(),
        rss2: feed.rss2(),
        json1: feed.json1()
    }
}


