'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link'
import { Highlight, themes } from "prism-react-renderer";

const bootstrapScript = `#!/bin/bash

## bootstrap.sh
## tested on Ubuntu 22.04

## install dependencies
cd
apt install -y screen

## Open necessary firewall ports
ufw allow 9096/tcp
ufw allow 9094/tcp
ufw allow 4001/tcp
ufw allow 4001/udp

## Download kubo
wget 'https://dist.ipfs.tech/kubo/v0.24.0/kubo_v0.24.0_linux-amd64.tar.gz'
tar xvzf ./kubo_v0.24.0_linux-amd64.tar.gz
chmod +x ./kubo/install.sh
./kubo/install.sh

## Download ipfs-cluster-follow
wget 'https://dist.ipfs.tech/ipfs-cluster-follow/v1.0.7/ipfs-cluster-follow_v1.0.7_linux-amd64.tar.gz'
tar xvzf ./ipfs-cluster-follow_v1.0.7_linux-amd64.tar.gz
chmod +x ./ipfs-cluster-follow/ipfs-cluster-follow
mv ./ipfs-cluster-follow/ipfs-cluster-follow /usr/local/bin/

## initialize ipfs
ipfs init

## run ipfs in a screen session
screen -d -m ipfs daemon

## run ipfs-cluster-follow
CLUSTER_PEERNAME="my-cluster-peer-name" ipfs-cluster-follow futureporn.net run --init https://futureporn.net/api/service.json
`

export default function Page() {
    return (
        <div className="content">
            <div className="section">
                <h1 className="title">Futureporn API</h1>
                <p className="subtitle">Futureporn Application Programmable Interface (API) for developers and power users</p>
            </div>
            <div>
                <div className="section">
                    <div className="box">
                        <h2 className="title">RSS Feed</h2>
                        <p className="subtitle">Keep up to date with new VODs using Real Simple Syndication (RSS).</p>

                        <p>Don&apos;t have a RSS reader? Futureporn recommends <Link target="_blank" href="https://fraidyc.at/">Fraidycat <FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link></p>

                        <div className='field is-grouped'>
                            <p className='control'><a className="my-5 button is-primary" href="/feed/feed.xml">ATOM</a></p>
                            <p className="control"><a className="my-5 button" href="/feed/rss.xml">RSS</a></p>
                            <p className='control'><a className="my-5 button" href="/feed/feed.json">JSON</a></p>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="box">
                        <h2 className="title mb-2">Data API</h2>
                        <p>The Data API contains all the data served by this website in JSON format, including IPFS Content IDs (CID), VOD titles, dates, and stream announcement links.</p>
                        <p><Link className="mt-3 mb-5 button is-primary" href="/api/v1.json">Futureporn API Version 1</Link></p>
                    </div>
                </div>

                <div className="section">
                    <div className="box">
                        <h2 className="title mb-2">IPFS Cluster Template</h2>
                        <p>The IPFS Cluster Template allows other IPFS cluster instances to join the Futureporn.net IPFS cluster as a <Link target="_blank" href="https://ipfscluster.io/documentation/collaborative/joining/">follower peer <FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link>. Cluster peers automatically pin (replicate) the IPFS content listed on this website.</p>

                        <p>Basic instructions are as follows</p>
                        <p>1. Download & install both <Link target="_blank" href="https://dist.ipfs.tech/#kubo"><span className="mr-1">kubo</span><FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link> and <Link target="_blank" href="https://dist.ipfs.tech/#ipfs-cluster-follow">ipfs-cluster-follow <FontAwesomeIcon icon={faExternalLinkAlt} className="fas fa-external-link-alt" /></Link> onto your server.</p>
                        <p>2. Initialize your ipfs repo & start the ipfs daemon</p>
                        <p>3. Join the cluster using ipfs-cluster-follow</p>

                        <p>Below is an example bash script to get everything you need to run an IPFS follower peer. This is only an example and may need tweaks to run in your environment.</p>

                                <Highlight 
                                    code={bootstrapScript}
                                    language='bash'
                                >
                                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre style={style}>
                                        {tokens.map((line, i) => (
                                            <div key={i} {...getLineProps({ line })}>
                                                {line.map((token, key) => (
                                                    <span key={key} {...getTokenProps({ token })} />
                                                ))}
                                            </div>
                                        ))}
                                    </pre>
                                    )}
                                </Highlight>
                                
                            



                        <h2 className="title mb-2"><a id="cluster" className="mt-3 mb-5 button is-info" href="/api/service.json">Futureporn IPFS Cluster Template (service.json)</a></h2>
                        <div className="mb-5"></div>
                    </div>
                </div>


            </div>
        </div>
    )
}