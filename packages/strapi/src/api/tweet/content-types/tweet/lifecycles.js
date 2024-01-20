const generateCuid = require('../../../../../misc/generateCuid.js');

const cbUrlRegex = /chaturbate\.com/i;
const fanslyUrlRegex = /https?:\/\/(?:www\.)?fans(?:\.ly|ly\.com)\/r\/[a-zA-Z0-9_]+/;

const cbAlternativeUrls = [
    'shorturl.at/tNUVY' // used by ProjektMelody in the early days
]


/**
 * Returns true if the tweet contains a chaturbate.com link
 * 
 * @param {Object} tweet
 * @returns {Boolean}
 */
const containsCBInviteLink = (tweet) => {
    const containsCbUrl = (link) => {
        if (!link?.url) return false;
        const isCbUrl = cbUrlRegex.test(link.url);
        const isAlternativeCbUrl = cbAlternativeUrls.some(alternativeUrl => link.url.includes(alternativeUrl));
        return isCbUrl || isAlternativeCbUrl;
    }
    try {
        if (!tweet?.links) return false;
        return tweet.links.some(containsCbUrl)
    } catch (e) {
        logger.log({ level: 'error', message: 'ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR' });
        logger.log({ level: 'error', message: e });
        return false;
    }
};

const containsFanslyInviteLink = (tweet) => {
    const containsFanslyUrl = (link) => {
        if (!link?.url) return false;
        return (fanslyUrlRegex.test(link?.url))
    }
    try {
        if (!tweet?.links) return false;
        return tweet.links.some(containsFanslyUrl)
    } catch (e) {
        logger.log({ level: 'error', message: 'ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR' });
        logger.log({ level: 'error', message: e });
        return false;
    }
};


const deriveTitle = (text) => {
    // greetz https://www.urlregex.com/
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
    let title = text
        .replace(urlRegex, '') // remove urls
        .replace(/\n/g, ' ') // replace newlines with spaces
        .replace(/&gt;/g, '>') // gimme dem greater-than brackets
        .replace(/&lt;/g, '<') // i want them less-thans too
        .replace(/&amp;/g, '&') // ampersands are sexy
        .replace(/\s+$/, ''); // remove trailing whitespace
    return title;
};




module.exports = {
    async afterCreate(event) {
        // * [ ] Create Stream
        const id = event.result.id;
        console.log(`>>> tweet afterCreate id=${id}`);
        const { data } = event.params;
        
        console.log(data);

        // IF this tweet was a fansly or chaturbate invite, create & associate Stream
        if (data.isChaturbateInvite || data.isFanslyInvite) {
            const stream = await strapi.entityService.create('api::stream.stream', {
                data: {
                    tweet: id,
                    vtuber: data.vtuber,
                    date: data.date,
                    date_str: data.date,
                    date2: data.date,
                    archiveStatus: 'missing',
                    cuid: generateCuid()
                }
            });

            // console.log(data)
            console.log(`stream.id=${stream.id}`);

            // const existingData = await strapi.entityService.findOne("api::stream.stream", id, {
            //     populate: ['vods']
            // })
        }
    },
    async beforeCreate(event) {
        // * [x] Set platform to CB or Fansly
        // * [x] Set vtuber
        // * [x] Set date
        // * [x] Set id_str
        // * [x] Set url

        const { data, where, select, populate } = event.params;
        console.log('>>> tweet beforeCreate!');

        const tweet = JSON.parse(data.json);
        // console.log(tweet);
        console.log(`containsCBInviteLink=${containsCBInviteLink(tweet)}, containsFanslyInviteLink=${containsFanslyInviteLink(tweet)}`);


        data.isChaturbateInvite = containsCBInviteLink(tweet);
        data.isFanslyInvite = containsFanslyInviteLink(tweet);

        const tweetDate = new Date(tweet.date).toISOString();
        data.id_str = tweet.id_str;
        data.date = tweetDate;
        data.date2 = tweetDate;
        data.url = tweet.url;

        // Set VTuber
        const twitterUsername = tweet.user.username;
        const vtuberRecords = await strapi.entityService.findMany("api::vtuber.vtuber", {
            fields: ['displayName', 'slug', 'id'],
            filters: {
                twitter: {
                    $endsWithi: twitterUsername
                }
            }
        });
        if (!!vtuberRecords[0]) data.vtuber = vtuberRecords[0].id;



    }
}