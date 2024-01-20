'use client'

import { useAuth, LoginButton, LogoutButton } from "../components/auth"
import { patreonVideoAccessBenefitId } from "../lib/constants";
import UserControls from "../components/user-controls";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { skeletonHeight, skeletonBorderRadius, skeletonBaseColor, skeletonHighlightColor } from '../lib/constants'

export default function Page() {
  const { authData } = useAuth()
  const isLoggedIn = (!!authData?.accessToken)
  const isEntitledToCDN = (!!authData?.user?.patreonBenefits.split(',').includes(patreonVideoAccessBenefitId))

  if (!authData) {
    return <div className="box">
      <SkeletonTheme 
        baseColor={skeletonBaseColor}
        height={skeletonHeight} 
        highlightColor={skeletonHighlightColor}
        borderRadius={skeletonBorderRadius}
      >
        <Skeleton count={8} enableAnimation={false}/>
      </SkeletonTheme>
    </div>
  }

  
  return (
    <>
        <div className="box">

          <h1 className="title mb-3">{authData?.user?.username} Profile</h1>

          {/* if not logged in, show login button */}
          {
            (!authData?.user) && (
              <LoginButton />
            )
          }

          {/* if logged in and not patron, display welcome */}
          {
            (!!authData?.accessToken && !isEntitledToCDN) &&
            <>
              <p className="">Welcome to Futureporn, {authData?.user?.username || 'chatmember'}! It seems that you are not a patron yet. Please log out and log in again if you believe this is an error. Thank you for your interest!</p>
              <LogoutButton></LogoutButton>
            </>
          }

          {/* if logged in and patron, display profile*/}
          {
            (!!authData?.user?.patreonBenefits && isEntitledToCDN) &&
            <UserControls></UserControls>
          }




        </div>
    </>
  )
}