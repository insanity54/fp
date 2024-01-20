'use client';

// import { type Helia, createHelia } from 'helia';
// import React, { useState, useEffect } from 'react';

// export default function Ipfs () {
//   const [id, setId] = useState<string|null>(null)
//   const [helia, setHelia] = useState<Helia|null>(null)
//   const [isOnline, setIsOnline] = useState(false)

//   useEffect(() => {
//     const init = async () => {
//       if (helia) return

//       const heliaNode = await createHelia();

//       const nodeId = heliaNode.libp2p.peerId.toString();
//       const nodeIsOnline = heliaNode.libp2p.isStarted();

//       setHelia(heliaNode);
//       setId(nodeId);
//       setIsOnline(nodeIsOnline);
//     }

//     init()
//   }, [helia])

//   if (!helia || !id) {
//     return <h4>Connecting to IPFS...</h4>
//   }

//   return (
//     <div>
//       <h4 data-test="id">ID: {id.toString()}</h4>
//       <h4 data-test="status">Status: {isOnline ? 'Online' : 'Offline'}</h4>
//     </div>
//   )
// }

