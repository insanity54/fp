'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { strapiUrl } from '@/lib/constants'
import { useAuth, IAuthData, IUser, IJWT } from '@/components/auth'
import { DangerNotification } from '@/components/notifications'

export type AccessToken = string | null;


export default function Page() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { authData, setAuthData, lastVisitedPath } = useAuth()
    const [errors, setErrors] = useState<String[]>([])

    const initAuth = async () => {
        try {
            const accessToken: AccessToken = getAccessTokenFromURL();
            const json = await getJwt(accessToken);
            if (!json) {
                setErrors(errors.concat(['Unable to get access token from portal. Please try again later or check Futureporn Discord.']))
            } else {
                storeJwtJson(json)
                redirect();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const storeJwtJson = (json: IJWT) => {


        // Store the JWT and other relevant data in your state management system
        const data: IAuthData = {
            accessToken: json.jwt,
            user: json.user,
        }
        setAuthData(data);
    }


    const getAccessTokenFromURL = () => {
        const accessToken: AccessToken = searchParams?.get('access_token');
        if (!accessToken) {
            throw new Error('Failed to get access_token from auth portal.');
        }
        return accessToken;
    };

    const getJwt = async (accessToken: AccessToken): Promise<IJWT | null> => {
        
        try {
            const response = await fetch(`${strapiUrl}/api/auth/patreon/callback?access_token=${accessToken}`);
            
            if (!response.ok) {
                // Handle non-2xx HTTP response status
                throw new Error(`Failed to fetch. Status: ${response.status}`);
            }
            
            const json = await response.json();
            
            if (!json.jwt) {
                throw new Error('Failed to get auth token. Please try again later.');
            }
            
            return json;
        } catch (error) {
            console.error(error);
            return null; // Return null or handle the error in an appropriate way
        }
    };
    

    const redirect = () => {
        if (!lastVisitedPath) return; // on first render, it's likely null
        router.push(lastVisitedPath);
    };


    useEffect(() => {
        initAuth()
    })






    {/* 
        After user auths,
        they are redirected to this page.
      
        This page grabs the access_token from the query string,
        exchanges it with strapi for a jwt
        then persists the jwt
      
        After a jwt is stored, this page redirects the user 
        to whatever page they were previously on.
    */}

    // @todo get query parameters
    // @todo save account info to session
    // @todo ???
    // @todo profit
    // const searchParams = useSearchParams()
    // const accessToken = searchParams?.get('access_token');
    // const refreshToken = searchParams?.get('refresh_token');
    // const lastVisitedPath = '@todo!'

    return (
        <div className='box'>
            {errors && errors.length > 0 && (
                <DangerNotification errors={errors} />
            )}
            <p>Redirecting...</p>
            <Link href={lastVisitedPath || '/profile'}>Click here if you are not automatically redirected</Link>
        </div>
    )
}