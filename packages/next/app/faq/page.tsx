import Link from 'next/link';
import { getVtuberBySlug } from '../lib/vtubers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { projektMelodyEpoch } from '@/lib/constants';
import LinkableHeading from '@/components/linkable-heading';

export default async function Page() {
  return (
    <div className="content">
      <div className="block">
        <div className="box">
          <p id="faq" className="title">Frequently Asked Questions (FAQ)</p>



          <div className="section">
            <LinkableHeading text="What is a VTuber?" slug="vtuber"></LinkableHeading>
            <p>VTuber is a portmantou of the words Virtual and Youtuber. Originally started in Japan, VTubing uses cameras and/or motion capture technology to replicate human movement and facial expressions onto a virtual character in realtime.</p>
          </div>

          <div className="section">
            <LinkableHeading text="What is a Lewdtuber?" slug="lewdtuber"></LinkableHeading>
            <p>Lewdtubers are sexually explicit vtubers. ProjektMelody was the first Vtuber to livestream on Chaturbate on {projektMelodyEpoch.toDateString()}. Many more followed after her.</p>
          </div>

          <div className="section">
            <LinkableHeading text="What is IPFS?" slug="ipfs"></LinkableHeading>
            <p>Interplanetary File System (IPFS) is a new-ish technology which gives a unique address to every file. This address is called a Content ID, or CID for short. A CID can be used to request the file from the IPFS network.</p>
            <p>IPFS is a distributed, decentralized protocol with no central point of failure. IPFS provider nodes can come and go, providing file serving capacity to the network. As long as there is at least one node pinning the content you want, you can download it.</p>
            <p>There are a few ways to use IPFS, each with their own tradeoffs. Firstly, you can use a public gateway. IPFS public gateways can be overloaded and unreliable at times, but it&apos;s simple to use. All you have to do is visit a gateway URL containing the CID. One such example is <Link target="_blank" href="https://ipfs.io/ipfs/bafkreifdwhy2rnn26w5zieqxmowocxzbo7p5n7sy5u4fj7beymqoxungem"><span className='mr-1'>https://ipfs.io/ipfs/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link> </p>
            <p>The next way to use IPFS consists of running <Link target="_blank" href="https://docs.ipfs.io/install/ipfs-desktop/"><span className="mr-1">IPFS Desktop</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link> on your computer. A local IPFS node runs for as long as IPFS Desktop is active, and you can query this node for the content you want. This setup works best with <Link href="https://docs.ipfs.tech/install/ipfs-companion/"><span className='mr-1'>IPFS Companion</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>, or a web browser that natively supports IPFS, such as <Link href="https://brave.com/" target="_blank"><span className='mr-1'>Brave browser.</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link></p>
          </div>



          <div className="section">
            <div>
              <div className="mb-3">
                <LinkableHeading text="My browser says the video is not reachable" slug="not-working"></LinkableHeading>
              </div>
              <div>
                <p>You may get an error when clicking on a video link. Errors such as <code>DNS_PROBE_FINISHED_NXDOMAIN</code></p>

                <p>This is a DNS server error that occurs when a web browser isn&apos;t able to translate the domain name into an IP address.</p>

                <p>If this happens, using a different DNS server can fix it. There are many gratis services to choose from, including <Link target="_blank" href="https://cloudflare-dns.com/dns/"><span className="mr-1">Cloudflare DNS</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link> or <Link target="_blank" href="https://developers.google.com/speed/public-dns/"><span className="mr-1">Google DNS</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>.</p>

                <p>Often, using a DNS server other than the one provided to you by your ISP can improve your internet browsing experience for all websites.</p>
              </div>
            </div>
          </div>

          <div className="section">
            <div>
              <div className='mb-3'>
                <LinkableHeading text="The IPFS videos are slow! I can't even watch it!" slug="slow"></LinkableHeading>
              </div>
              
              <div>
                <p>Bandwidth is prohibitively expensive, so that&apos;s the free-to-play experience at the moment. (<Link href="/patrons">Patrons</Link> get access to CDN which is much faster.)</p>
                <p>If the video isn&apos;t loading fast enough to stream, you can <Link href="#download">download</Link> the entire video then playback later on your device.</p>
              </div>
            </div>
          </div>

          <div className='section'>
            <div>
              <div className='mb-3'>
                <LinkableHeading text="Can I download the video?" slug="download" />

                <p>Yes! The recommended way is to use either <Link target="_blank" href="https://docs.ipfs.tech/install/ipfs-desktop/"><span className='mr-1'>IPFS Desktop</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link> or <Link target="_blank" href="https://dist.ipfs.tech/#ipget"><span className='mr-1'>ipget</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>.</p>
                <p><b>ipget</b> example is as follows.</p>
                <pre>
                  <code>
                    ipget --progress -o projektmelody-chaturbate-2023-12-03.mp4 bafybeiejms45zzonfe7ndr3mp4vmrqrg3btgmuche3xkeq5b77uauuaxkm
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className='section'>
            <div className="mb-3">
              <LinkableHeading text="There&apos;s a cool new Lewd Vtuber who streams on CB. Will you archive their vods?" slug="other-luber" />
            </div>
            <p>Yes. Futureporn aims to become the galaxy&apos;s best VTuber hentai site.</p>
          </div>

          <div className='section'>
            <div className='mb-3'>
              <LinkableHeading text="How can I help?" slug="how-can-i-help" />
              <p>Bandwidth and rental fees are expensive, so Futureporn needs financial assistance to keep servers online and videos streaming.</p>
              <p><Link href="/patrons">Patrons</Link> gain access to perks like our video Content Delivery Network (CDN), and optional shoutouts on the patrons page.</p>
              <p>Additionally, help is needed <Link href="/upload">populating our archive</Link> with vods from past lewdtuber streams.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}