
import PatronsList from '../components/patrons-list';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link'
import { getCampaign } from '../lib/patreon';

export default async function Page() {

  const patreonCampaign = await getCampaign()

  return (
    <>
      <div className="content">
        <div className="block">
          <div className="box">
            <h1 className="title">Patron List</h1>
            <p className="subtitle">
              <span>Futureporn.net continues to improve thanks to </span>
              <strong>{patreonCampaign.patronCount} generous supporters.</strong>
            </p>

            <PatronsList displayStyle="box" />

            <p>Want to get your name on this list, and get perks like FAST video streaming?</p>
            <Link target="_blank" rel="noopener noreferrer" href="https://patreon.com/CJ_Clippy" className='button is-primary mb-3'>
              <span className="mr-1">Become a patron today!</span>
                <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="fab fa-external-link-alt"
                ></FontAwesomeIcon>
            </Link>
            <p className='subtitle'>
              Patron names are private by default--{' '}
              <Link href="/profile">Opt-in</Link> to have your name displayed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
