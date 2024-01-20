'use client';

import React, { useState } from 'react';
import { LogoutButton, useAuth } from "../components/auth"
import { patreonQuantumSupporterId, strapiUrl } from '../lib/constants';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import Skeleton from 'react-loading-skeleton';

interface IArchiveSupporterProps {
    isNamePublic: boolean;
    setIsNamePublic: Function;
}

interface ISaveButtonProps {
    isDirty: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isNamePublic: boolean;
    isLinkPublic: boolean;
    vanityLink: string;
    setVanityLink: Function;
    setIsLoading: Function;
    setIsSuccess: Function;
    setIsDirty: Function;
    setAuthData: Function;
    errors: String[];
    setErrors: Function;
}

interface IQuantumSupporterProps {
    isLinkPublic: boolean;
    hasUrlBenefit: boolean;
    setIsLinkPublic: Function;
    vanityLink: string;
    setVanityLink: Function;
}


export default function UserControls() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isNamePublic, setIsNamePublic] = useState(false);
    const [isLinkPublic, setIsLinkPublic] = useState(false);
    const [errors, setErrors] = useState([])
    const [vanityLink, setVanityLink] = useState('')
    
    const { authData, setAuthData } = useAuth()
    
    
    if (!authData) return <p>Loading...</p>
    

    const hasUrlBenefit = (authData?.user?.patreonBenefits) ? authData.user.patreonBenefits.split(' ').includes(patreonQuantumSupporterId) : false;

    return (
        <div>
            <section className="mb-5">
                <h3 className="heading">Patron Perks</h3>
                <Thanks />
                <ArchiveSupporterPerks 
                    isNamePublic={isNamePublic} 
                    setIsNamePublic={setIsNamePublic}
                />
                <QuantumSupporterPerks
                    isLinkPublic={isLinkPublic}
                    vanityLink={vanityLink}
                    setVanityLink={setVanityLink}
                    setIsLinkPublic={setIsLinkPublic}
                    hasUrlBenefit={hasUrlBenefit}
                />
                <LogoutButton />
                <span className='mr-1'></span>
                <SaveButton
                    isSuccess={isSuccess} 
                    isLoading={!authData}
                    isDirty={isDirty} 
                    setIsSuccess={setIsSuccess}
                    setIsLoading={setIsLoading}
                    setIsDirty={setIsDirty}
                    isNamePublic={isNamePublic}
                    isLinkPublic={isLinkPublic}
                    vanityLink={vanityLink}
                    setVanityLink={setVanityLink}
                    setAuthData={setAuthData}
                    errors={errors}
                    setErrors={setErrors}
                />
            </section>
        </div>
    );
};


export function SaveButton({
    isDirty,
    setIsDirty,
    isLoading,
    setIsLoading,
    setIsSuccess,
    isSuccess,
    isNamePublic,
    isLinkPublic,
    vanityLink,
    setVanityLink,
    setAuthData,
    errors,
    setErrors,
}: ISaveButtonProps) {
    const { authData } = useAuth();
    const handleClick = async () => {
        if (!authData?.user) return;
        try {
            setIsLoading(true);
            
            const response = await fetch(`${strapiUrl}/api/profile/${authData.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.accessToken}`
                },
                body: JSON.stringify({
                    isNamePublic,
                    isLinkPublic,
                    vanityLink
                })
            });
    
            setIsLoading(false);
            setIsDirty(true);

            if (!response.ok) {
                setIsSuccess(false);
            } else {
                setIsSuccess(true);
    
                // Update authData if needed
                const updatedAuthData = { ...authData };
                if (!updatedAuthData?.user) return;
                updatedAuthData.user.vanityLink = vanityLink;
                updatedAuthData.user.isNamePublic = isNamePublic;
                updatedAuthData.user.isLinkPublic = isLinkPublic;
                setAuthData(updatedAuthData);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrors(errors.concat([error.message]))
            }
        }
    };
    

    return (
        <button
            className={`button is-primary ${isLoading ? 'is-loading' : ''} ${isSuccess ? 'is-success' : isDirty && !isSuccess ? 'is-warning' : ''}`}
            onClick={handleClick}
        >
            <span style={{ display: !isDirty ? 'inline' : 'none' }} className="icon">
                <FontAwesomeIcon icon={faSave} />
            </span>
            <span style={{ display: isDirty && isSuccess ? 'inline' : 'none' }} className="icon">
                <FontAwesomeIcon icon={faCheck} />
            </span>
            <span style={{ display: isDirty && !isSuccess ? 'inline' : 'none' }} className="icon">
                <FontAwesomeIcon icon={faTimes} />
            </span>
            <span>Save</span>
        </button>
    )
}

export function Thanks() {
    return <p className='mb-3'>Thank you so much for supporting Futureporn!</p>
}

export function QuantumSupporterPerks({ isLinkPublic, setIsLinkPublic, setVanityLink, vanityLink, hasUrlBenefit }: IQuantumSupporterProps) {
    const { authData } = useAuth()

    return (
        <div className="field box" style={{ display: hasUrlBenefit ? 'block' : 'none' }}>
            <label className="label">URL</label>
            <div className="control">
                <label className="checkbox noselect">
                    <span className='mr-1'><input
                        type="checkbox"
                        checked={isLinkPublic}
                        onChange={() => setIsLinkPublic(!isLinkPublic)}
                    /></span>
                    <span>Publicly display my URL <b>{vanityLink}</b> on the patrons page.</span>
                </label>
            </div>
            <div className="control">
                <input
                    className="input"
                    type="text"
                    placeholder="https://twitter.com/example"
                    value={vanityLink}
                    onChange={(e) => setVanityLink(e.target.value)}
                />
            </div>
            
        </div>
    )
}

export function AdvancedArchiveSupporterPerks() {

}

export function ArchiveSupporterPerks({ isNamePublic, setIsNamePublic }: IArchiveSupporterProps) {
    const { authData } = useAuth()

    return (
        <div className="field box fp-noselect">
            <label className="label">Username</label>
            <div className="control">
                <label className="checkbox noselect">
                    <span className='mr-1'><input
                        type="checkbox"
                        checked={isNamePublic}
                        onChange={() => setIsNamePublic(!isNamePublic)}
                    /></span>
                    Publicly display <b>{(authData?.user?.username) ? authData.user.username : <Skeleton></Skeleton> }</b> on the patrons page.
                </label>
            </div>
        </div>
    )
}