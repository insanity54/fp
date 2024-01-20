'use client';

import { useEffect, useState, forwardRef, useContext, Ref } from 'react';
import { IVod } from '@/lib/vods';
import "plyr-react/plyr.css";
import { useAuth } from '@/components/auth';
import { getVodTitle } from './vod-page';
import { VideoSourceSelector } from '@/components/video-source-selector'
import { buildIpfsUrl } from '@/lib/ipfs';
import { strapiUrl } from '@/lib/constants';
import MuxPlayer from '@mux/mux-player-react/lazy';
import { VideoContext } from './video-context';
import MuxPlayerElement from '@mux/mux-player';
import VideoApiElement from "@mux/mux-player/dist/types/video-api";

interface IPlayerProps {
    vod: IVod;
    setIsPlayerReady: Function;
}

interface ITokens {
    playbackToken: string;
    storyboardToken: string;
    thumbnailToken: string;
}

async function getMuxPlaybackTokens(playbackId: string, jwt: string): Promise<ITokens> {
    const res = await fetch(`${strapiUrl}/api/mux-asset/secure?id=${playbackId}`, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    const json = await res.json()

    return {
        playbackToken: json.playbackToken,
        storyboardToken: json.storyboardToken,
        thumbnailToken: json.thumbnailToken
    }
}

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}



export const VideoPlayer = forwardRef(function VideoPlayer( props: IPlayerProps, ref: Ref<MuxPlayerElement> ): React.JSX.Element {
    const { vod, setIsPlayerReady } = props
    const title: string = getVodTitle(vod);
    const { authData } = useAuth();
    const [selectedVideoSource, setSelectedVideoSource] = useState('');
    const [isEntitledToCDN, setIsEntitledToCDN] = useState(false);
    const [hlsSource, setHlsSource] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    const [playbackId, setPlaybackId] = useState('');
    const [src, setSrc] = useState('');
    const [tokens, setTokens] = useState({});
    const { setTimeStamp } = useContext(VideoContext);



    useEffect(() => {
        setIsClient(true);
        const token = authData?.accessToken;
        const playbackId = vod?.attributes.muxAsset?.data?.attributes?.playbackId;

        if (token) setIsEntitledToCDN(true);

        if (selectedVideoSource === 'Mux') {
            if (!!token && !!playbackId) {
                try {
                    getMuxPlaybackTokens(vod.attributes.muxAsset.data.attributes.playbackId, token)
                        .then((tokens) => {
                            setTokens({
                                playback: tokens.playbackToken,
                                storyboard: tokens.storyboardToken,
                                thumbnail: tokens.thumbnailToken
                            })
                            setHlsSource(vod.attributes.muxAsset.data.attributes.playbackId)
                            setPlaybackId(vod.attributes.muxAsset.data.attributes.playbackId)
                        });
                }

                catch (e) {
                    console.error(e)
                }
            }
        } else if (selectedVideoSource === 'B2') {
            if (!vod.attributes.videoSrcB2) return; // This shouldn't happen because videoSourceSelector won't choose B2 if there is no b2. This return is only for satisfying TS
            setHlsSource(vod.attributes.videoSrcB2.data.attributes.cdnUrl);
            setPlaybackId('');
            setSrc(vod.attributes.videoSrcB2.data.attributes.cdnUrl);
        } else if (selectedVideoSource === 'IPFSSource') {
            setHlsSource('');
            setPlaybackId('');
            setSrc(buildIpfsUrl(vod.attributes.videoSrcHash))
        } else if (selectedVideoSource === 'IPFS240') {
            setHlsSource('');
            setPlaybackId('');
            setSrc(buildIpfsUrl(vod.attributes.video240Hash))
        }
    }, [selectedVideoSource, authData, vod, setHlsSource]);


    if (!isClient) return <></>


    return (
        <>
            <MuxPlayer
                onCanPlay={() => {
                    setIsPlayerReady(true)}
                }
                ref={ref}
                preload="auto"
                crossOrigin="*"
                loading="viewport"
                playbackId={playbackId}
                src={src}
                tokens={tokens}
                primaryColor="#FFFFFF"
                secondaryColor={hexToRgba(vod.attributes.vtuber.data.attributes.themeColor, 0.85)}
                metadata={{
                    video_title: getVodTitle(vod)
                }}

                streamType="on-demand"
                onTimeUpdate={(evt) => {
                    const muxPlayer = evt.target as VideoApiElement
                    const { currentTime } = muxPlayer;
                    setTimeStamp(currentTime)
                }}
                muted
            ></MuxPlayer>

            <VideoSourceSelector
                isMux={!!vod?.attributes.muxAsset?.data?.attributes?.playbackId}
                isB2={!!vod?.attributes.videoSrcB2?.data?.attributes?.cdnUrl}
                isIPFSSource={!!vod?.attributes.videoSrcHash}
                isIPFS240={!!vod?.attributes.video240Hash}
                isEntitledToCDN={isEntitledToCDN}
                selectedVideoSource={selectedVideoSource}
                setSelectedVideoSource={setSelectedVideoSource}
            ></VideoSourceSelector>
        </>
    )
})