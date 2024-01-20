import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faGit, faReddit, faDiscord, faPatreon } from "@fortawesome/free-brands-svg-icons";
import Contributors from "./contributors";
import PatronsList from "./patrons-list";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="content">

                    <div className="columns is-multiline is-mobile">
                        <div className="column is-12">
                            <p className="mt-4 heading">Sitemap</p>
                            <ul>
                                <li><Link href="#top">&uarr; Top of page</Link></li>
                                <li><Link href="/vt">Vtubers</Link></li>
                                <li><Link href="/streams">Stream Archive</Link></li>
                                <li><Link href="/about">About</Link></li>
                                <li><Link href="/faq">FAQ</Link></li>
                                <li><Link href="/goals">Goals</Link></li>
                                <li><Link href="/patrons">Patrons</Link></li>
                                <li><Link href="/tags">Tags</Link></li>
                                <li><Link href="/feed">RSS Feed</Link></li>
                                <li><Link href="/api">API</Link></li>
                                <li><Link href="/blog">Blog</Link></li>
                                <li><Link href="https://status.futureporn.net/" target="_blank"><span className="mr-1">Status</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fab fa-external-link-alt"></FontAwesomeIcon></Link></li>
                                <li><Link href="/upload">Upload</Link></li>
                                <li><Link href="/profile">Profile</Link></li>
                            </ul>
                        </div>
                        <div className="column is-12">
                            <p className="mt-4">
                                Futureporn.net is made with ❤️ by <Link target="_blank" href="https://twitter.com/CJ_Clippy">CJ_Clippy <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                        className="fab fa-external-link-alt"
                                    ></FontAwesomeIcon></Link>
                            </p>
                            <p>
                                Made possible by generous <Link
                                    href="https://patreon.com/CJ_Clippy"
                                    target="_blank"
                                >

                                    <span> donations </span>
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                        className="fab fa-external-link-alt"
                                    ></FontAwesomeIcon>
                                </Link>

                                <span> from</span> <PatronsList displayStyle="list" />

                            </p>
                            <p>
                                VOD contributions by <Contributors />
                            </p>
                            <p>
                                <Link
                                    href="https://gitea.futureporn.net/futureporn"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon
                                        icon={faGit}
                                        className="fab fa-git"
                                    ></FontAwesomeIcon>
                                    <span> Git Repo </span>
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                        className="fab fa-external-link-alt"
                                    ></FontAwesomeIcon>
                                </Link>
                            </p>

                            <p>
                                <Link
                                    href="https://www.reddit.com/r/projektmelody/comments/qikzy0/futureporn_an_unofficial_projektmelody_chaturbate/"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon
                                        icon={faReddit}
                                        className="fab fa-reddit"
                                    ></FontAwesomeIcon>
                                    <span> Reddit Thread </span>
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                        className="fab fa-external-link-alt"
                                    ></FontAwesomeIcon>
                                </Link>
                            </p>

                            <p>
                                <Link
                                    href="https://discord.gg/wrZQnK3M8z"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon
                                        icon={faDiscord}
                                        className="fab fa-discord"
                                    ></FontAwesomeIcon>
                                    <span> Discord Server </span>
                                    <FontAwesomeIcon
                                        icon={faExternalLinkAlt}
                                        className="fab fa-external-link-alt"
                                    ></FontAwesomeIcon>
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>
                <script data-goatcounter="https://futureporn.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
            </footer>
        </>
    )
}