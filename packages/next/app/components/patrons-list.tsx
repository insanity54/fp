import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getPatrons } from '../lib/patreon';
import Link from 'next/link'

interface PatronsListProps {
  displayStyle: string;
}

export default async function PatronsList({ displayStyle }: PatronsListProps) {
  const patrons = await getPatrons()

  if (!patrons) return (
    <SkeletonTheme baseColor="#000" highlightColor="#000">
      <Skeleton count={3} enableAnimation={false} />
    </SkeletonTheme>
  );
  if (displayStyle === 'box') {
    return (
      <div className="columns is-multiline">
        {patrons.map((patron) => (
          <div key={patron.username} className="column is-full-mobile is-half-tablet is-one-third-desktop">
            <div className="box">
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    {patron.username && (
                      <span>
                        <b>{patron.username}</b>
                      </span>
                    )}
                    {patron.vanityLink && (
                      <Link target="_blank" href={patron.vanityLink}>
                        <span>{patron.vanityLink}</span>
                        <span className="icon">
                          <i className="fas fa-external-link-alt"></i>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (displayStyle === 'list') {
    const patronNames = patrons.map((patron) => patron.username.trim()).join(', ');
    return <span>{patronNames}</span>;
  } else {
    return <span></span>; // Handle unsupported display styles or provide a default display style
  }
}

