'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faUser, faUpload } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link'
import { LoginButton, useAuth } from '@/components/auth'


export default function Navbar() {
    const [isExpanded, setExpanded] = useState(false);
    const [isProfileButton, setIsProfileButton] = useState(false);

    const handleBurgerClick = () => {
        setExpanded(!isExpanded);
    };

    const { authData } = useAuth()

    useEffect(() => {
        if (!!authData?.accessToken && !!authData?.user?.username) setIsProfileButton(true)
        else setIsProfileButton(false)
    }, [authData])

    return (
        <>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" href="/">
                        <h1 className="title">🔞💦 Futureporn.net</h1>
                    </Link>
                    <button
                        className="navbar-burger" 
                        onClick={handleBurgerClick}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className={`navbar-menu ${isExpanded ? 'is-active' : ''}`} id="navMenu">
                    <div className='navbar-start'>
                        <Link className="navbar-item is-expanded" href="/vt">Vtubers</Link>
                        <Link className="navbar-item is-expanded" href="/streams">Stream Archive</Link>
                        <Link className="navbar-item is-expanded" href="/about">About</Link>
                        <Link className="navbar-item is-expanded" href="/faq">FAQ</Link>
                        <Link className="navbar-item is-expanded" href="/goals">Goals</Link>
                        <Link className="navbar-item is-expanded" href="/patrons">Patrons</Link>
                        <Link className="navbar-item is-expanded" href="/tags">Tags</Link>
                        <Link className="navbar-item is-expanded" href="/api">API</Link>
                    </div>
                    <div className='navbar-end'>
                        <div className="navbar-item is-expanded">
                            <Link target="_blank" href="https://status.futureporn.net">
                                <span>Status </span>
                                <FontAwesomeIcon
                                    icon={faExternalLinkAlt}
                                    className="fab fa-external-link-alt"
                                ></FontAwesomeIcon>
                            </Link>
                        </div>


                        {/* <div className="navbar-item">
                            <Link className="button " href="/upload">
                                <span className="mr-1">Upload</span>
                                <FontAwesomeIcon
                                    icon={faUpload}
                                    className="fas fa-upload"
                                ></FontAwesomeIcon>
                            </Link>
                        </div> */}

                        <div className="navbar-item fp-profile-button">
                            {/* show the login button if user is anon */}
                            {/* show the profile button if the user is authed */}
                            {
                                (isProfileButton) ? (
                                    <Link className="button" href="/profile">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="fas fa-user-large mr-1"
                                        ></FontAwesomeIcon>
                                        <span>{ authData?.user?.username || 'profile' }</span>
                                    </Link>
                                ) : (
                                    <LoginButton></LoginButton>
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}