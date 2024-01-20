import VodsList from '@/components/vods-list';
import Link from 'next/link';
import { getVtuberBySlug } from '@/lib/vtubers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faPatreon, faYoutube, faTwitch, faTiktok, faXTwitter, faReddit, faDiscord } from "@fortawesome/free-brands-svg-icons";
import Image from 'next/image';
import OnlyfansIcon from "@/components/icons/onlyfans";
import PornhubIcon from '@/components/icons/pornhub';
import ThroneIcon from '@/components/icons/throne';
import LinktreeIcon from '@/components/icons/linktree';
import FanslyIcon from '@/components/icons/fansly';
import ChaturbateIcon from '@/components/icons/chaturbate';
import CarrdIcon from '@/components/icons/carrd';
import styles from '@/assets/styles/icon.module.css';

import { getVodsForVtuber } from '@/lib/vods';
import { notFound } from 'next/navigation';
import ArchiveProgress from '@/components/archive-progress';
import StreamsCalendar from '@/components/streams-calendar';
import { getAllStreamsForVtuber, getStreamsForVtuber } from '@/lib/streams';
import LinkableHeading from '@/components/linkable-heading';



export default async function Page({ params }: { params: { slug: string } }) {
  const vtuber = await getVtuberBySlug(params.slug);
  if (!vtuber) notFound();

  const vods = await getVodsForVtuber(vtuber.id, 1, 9);
  if (!vods) notFound();

  const missingStreams = await getAllStreamsForVtuber(vtuber.id, ['missing']);
  const issueStreams = await getAllStreamsForVtuber(vtuber.id, ['issue']);
  const goodStreams = await getAllStreamsForVtuber(vtuber.id, ['good']);



  // return (         
  //   <>
  //     <p>hi mom!</p>
  //     <pre>
  //       <code>
  //         {JSON.stringify(missingStreams, null, 2)}
  //       </code>
  //     </pre>
  //   </>   
  // )

  return (
    <>
      {vtuber && (
        <>
          <div className="box">

            <div className="columns is-multiline">
              <div className="column is-full">
                <h1 className="title is-2">{vtuber.attributes.displayName}</h1>
              </div>
              <div className="column is-one-quarter">
                <figure className="image is-rounded is-1by1">
                  <Image
                    className="is-rounded"
                    alt={vtuber.attributes.displayName}
                    src={vtuber.attributes.image}
                    fill={true}
                    placeholder='blur'
                    blurDataURL={vtuber.attributes.imageBlur}
                  />
                </figure>
              </div>
              <div className="column is-three-quarters">
                <p className="is-size-5 mb-3">{vtuber.attributes.description1}</p>
                <p className="is-size-5">{vtuber.attributes.description2}</p>
              </div>
            </div>

            <h2 id="socials" className="title is-3">
              <Link href="#socials">Socials</Link>
            </h2>


            <div className="column is-full mb-5">
              <div className="columns has-text-centered is-multiline is-centered">
                {vtuber.attributes.patreon && (
                  <div className="column is-3 is-narrow">
                    <Link href={vtuber.attributes.patreon} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faPatreon} className="fab fa-patreon" /></span><span className="mr-2">Patreon</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.twitter && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.twitter} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faXTwitter} className="fab fa-x-twitter" /></span><span className="mr-2">Twitter</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.youtube && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.youtube} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faYoutube} className="fab fa-youtube" /></span><span className="mr-2">YouTube</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.twitch && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.twitch} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faTwitch} className="fab fa-twitch" /></span><span className="mr-2">Twitch</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.tiktok && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.tiktok} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faTiktok} className="fab fa-tiktok" /></span><span className="mr-2">TikTok</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.fansly && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.fansly} className='subtitle is-5'>
                      <span className='mr-2'><FanslyIcon width={20} height={20} className={styles.icon}/></span><span className="mr-2">Fansly</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.onlyfans && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.onlyfans} className='subtitle is-5'>
                      <span className='mr-2'>
                        <OnlyfansIcon width={20} height={20} className={styles.icon}></OnlyfansIcon>
                      </span><span className="mr-2">OnlyFans</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.pornhub && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.pornhub} className='subtitle is-5'>
                      <span className='mr-2'><PornhubIcon width={20} height={20} className={styles.icon}/></span><span className="mr-2">Pornhub</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.reddit && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.reddit} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faReddit} className="fab fa-reddit" /></span><span className="mr-2">Reddit</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.discord && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.discord} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faDiscord} className="fab fa-discord" /></span><span className="mr-2">Discord</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.instagram && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.instagram} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faInstagram} className="fab fa-instagram" /></span><span className="mr-2">Instagram</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.facebook && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.facebook} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faFacebook} className="fab fa-facebook" /></span><span className="mr-2">Facebook</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.merch && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.merch} className="subtitle is-5">
                      <span className="mr-2"><FontAwesomeIcon icon={faBagShopping} className="fas fa-bag-shopping" /></span><span className="mr-2">Merch</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.chaturbate && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.chaturbate} className='subtitle is-5'>
                      <span className='mr-2'><ChaturbateIcon width={20} className={styles.icon}/></span><span className="mr-2">Chaturbate</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.throne && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.throne} className='subtitle is-5'>
                      <span className='mr-2'><ThroneIcon width={20} height={20} className={styles.icon}/></span><span className="mr-2">Throne</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.linktree && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.linktree} className='subtitle is-5'>
                      <span className='mr-2'><LinktreeIcon width={20} height={20} className={styles.icon}/></span><span className="mr-2">Linktree</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
                {vtuber.attributes.carrd && (
                  <div className="column is-3 is-narrow">
                    <Link target="_blank" href={vtuber.attributes.carrd} className='subtitle is-5'>
                      <span className='mr-2'><CarrdIcon width={20} height={20} className={styles.icon}/></span><span className="mr-2">Carrd</span><span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></span>
                    </Link>
                  </div>
                )}
              </div>
            </div>


            {/* <h2 id="toys" className="title is-3">
              <Link href="#toys">Toys</Link>
            </h2>

            <>
              <ToysList vtuber={vtuber} toys={toys} page={1} pageSize={toySampleCount} />
              {(toys.pagination.total > toySampleCount) && <Link href={`/vt/${vtuber.slug}/toys/1`} className='button mb-5'>See all of {vtuber.displayName}'s toys</Link>}
            </> */}

            <h2 id="vods" className="title is-3">
              <Link href="#vods">Vods</Link>
            </h2>

            <VodsList vtuber={vtuber} vods={vods.data} page={1} pageSize={9} />
            {
              (vtuber.attributes.vods) ? (
                <Link className='button mb-5' href={`/vt/${vtuber.attributes.slug}/vods/1`}>See all {vtuber.attributes.displayName} vods</Link>
              ) : (<p className='section'><i>No VODs have been added, yet.</i></p>)
            }

            <h2 id="streams" className='title is-3'>
              <Link href="#streams">Streams</Link>
            </h2>
            <StreamsCalendar missingStreams={missingStreams} issueStreams={issueStreams} goodStreams={goodStreams} />
{/* 
            <h2 id="progress" className='title is-3'>
              <Link href="#progress">Archive Progress</Link>
            </h2>
            <ArchiveProgress vtuber={vtuber} /> */}

            
          </div>
        </>
      )}
    </>
  );
}
