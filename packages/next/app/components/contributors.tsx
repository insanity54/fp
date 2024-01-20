import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { getContributors } from "../lib/contributors";
import Link from 'next/link';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function Contributors() {
    const contributors = await getContributors();
    if (!contributors || contributors.length < 1) return (
        <SkeletonTheme baseColor="#000" highlightColor="#000" width="25%">
            <Skeleton count={1} enableAnimation={false} />
        </SkeletonTheme>
    )
    const contributorList = contributors.map((contributor, index) => (
        <span key={index}>
            {contributor.attributes.url ? (
                <Link href={contributor.attributes.url} target="_blank">
                    <span className="mr-1">{contributor.attributes.name}</span>
                    <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        className="fab fa-external-link-alt"
                    ></FontAwesomeIcon>
                </Link>
            ) : (
                contributor.attributes.name
            )}
            {index !== contributors.length - 1 ? ", " : ""}
        </span>
    ));
    return (
        <>{contributorList}</>
    )
}