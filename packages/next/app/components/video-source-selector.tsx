'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';

interface IVSSProps {
    isMux: boolean;
    isB2: boolean;
    isIPFSSource: boolean;
    isIPFS240: boolean;
    isEntitledToCDN: boolean;
    setSelectedVideoSource: (option: string) => void;
    selectedVideoSource: string;
}

export function VideoSourceSelector({
    isMux,
    isB2,
    isIPFSSource,
    isIPFS240,
    isEntitledToCDN,
    selectedVideoSource,
    setSelectedVideoSource,
}: IVSSProps): React.JSX.Element {

    // Check for user's entitlements and saved preference when component mounts
    useEffect(() => {
        // Function to determine the best video source based on entitlements and preferences
        const determineBestVideoSource = () => {
            if (isEntitledToCDN) {
                if (selectedVideoSource === 'Mux' && isMux) {
                    return 'Mux';
                } else if (selectedVideoSource === 'B2' && isB2) {
                    return 'B2';
                }
            }
            // If the user doesn't have entitlements or their preference is not available, default to IPFS
            if (isIPFSSource) {
                return 'IPFSSource';
            } else if (isIPFS240) {
                return 'IPFS240';
            }
            // If no sources are available, return an empty string
            return '';
        };

        // If selectedVideoSource is unset, find the value to use
        if (selectedVideoSource === '') {
            // Load the user's saved preference from storage (e.g., local storage)
            const savedPreference = localStorage.getItem('videoSourcePreference');

            // Check if the saved preference is valid based on entitlements and available sources
            if (savedPreference === 'Mux' && isMux && isEntitledToCDN) {
                setSelectedVideoSource('Mux');
            } else if (savedPreference === 'B2' && isB2 && isEntitledToCDN) {
                setSelectedVideoSource('B2');
            } else {
                // Determine the best video source if the saved preference is invalid or not available
                const bestSource = determineBestVideoSource();
                setSelectedVideoSource(bestSource);
            }
        }


    }, [isMux, isB2, isIPFSSource, isIPFS240, isEntitledToCDN, selectedVideoSource, setSelectedVideoSource]);

    // Handle button click to change the selected video source
    const handleSourceClick = (source: string) => {
        if (
            (source === 'Mux' && isMux && isEntitledToCDN) || 
            (source === 'B2' && isB2 && isEntitledToCDN) || 
            (source === 'IPFSSource') || 
            (source === 'IPFS240')
        ) {
            setSelectedVideoSource(source);
            // Save the user's preference to storage (e.g., local storage)
            localStorage.setItem('videoSourcePreference', source);
        }
    };

    return (
        <>
        <div className="box">
            <nav className="level is-text-centered">
                <div className="nav-heading">
                    Video Source Selector
                </div>
                {(!isMux && !isB2 && !isIPFSSource && !isIPFS240) && <div className="nav-item">
                    <div className="notification is-danger">
                        <span>No video sources available</span>
                    </div>
                </div>}
                {(isMux) && <div className="nav-item">
                    <button onClick={() => handleSourceClick('Mux')} disabled={!isEntitledToCDN} className={`button ${selectedVideoSource === 'Mux' && 'is-active'}`}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faPatreon} className="fab fa-patreon" />
                        </span>
                        <span>CDN 1</span>
                    </button>
                </div>}
                {(isB2) && <div className="nav-item">
                    <button onClick={() => handleSourceClick('B2')} disabled={!isEntitledToCDN} className={`button ${selectedVideoSource === 'B2' && 'is-active'}`}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faPatreon} className="fab fa-patreon" />
                        </span>
                        <span>CDN 2</span>
                    </button>
                </div>}
                {(isIPFSSource) && <div className="nav-item">
                    <button onClick={() => handleSourceClick('IPFSSource')} className={`button ${(selectedVideoSource === 'IPFSSource') && 'is-active'}`}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faGlobe} className="fas fa-globe" />
                        </span>
                        <span>IPFS Src</span>
                    </button>
                </div>}
                {(isIPFS240) && <div className="nav-item">
                    <button onClick={() => handleSourceClick('IPFS240')} className={`button ${(selectedVideoSource === 'IPFS240') && 'is-active'}`}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faGlobe} className="fas fa-globe" />
                        </span>
                        <span>IPFS 240p</span>
                    </button>
                </div>}                
            </nav>
        </div>
        </>
    )
}