'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import RemoteSources from '@uppy/remote-sources';
import { useAuth } from './components/auth';

const companionUrl = process.env.NEXT_PUBLIC_UPPY_COMPANION_URL!

export const UppyContext = createContext(new Uppy());

export default function UppyProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { authData } = useAuth();
  const [uppy] = useState(() => new Uppy(
      { 
        autoProceed: true
      }
    )
    .use(RemoteSources, {
      companionUrl,
      sources: ['GoogleDrive']
    })
    .use(AwsS3, {
      companionUrl,
      shouldUseMultipart: true,
      abortMultipartUpload: () => {}, // @see https://github.com/transloadit/uppy/issues/1197#issuecomment-491756118
      companionHeaders: {
        'authorization': `Bearer ${authData?.accessToken}`
      }
    })
  );

  

  return (
    <UppyContext.Provider value={uppy}>
      {children}
    </UppyContext.Provider>
  )
}
