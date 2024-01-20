import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faLink } from "@fortawesome/free-solid-svg-icons";

interface ILinkableHeadingProps {
    icon?: IconDefinition;
    text: string;
    slug: string;
}

export default function LinkableHeading({ icon, text, slug }: ILinkableHeadingProps) {
    return (
        <h4
            id={slug}
            className='title is-4 mb-5'
        >
            {icon && <FontAwesomeIcon icon={icon} className="mr-2"></FontAwesomeIcon>}
            <span>{text}</span>
            <a id={slug}></a>
            <Link href={`#${slug}`}>
                <FontAwesomeIcon
                    icon={faLink}
                    className="fab fa-link ml-2"
                ></FontAwesomeIcon>
            </Link>
        </h4>
    )
}