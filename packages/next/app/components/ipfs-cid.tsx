'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import styles from '@/assets/styles/cid.module.css'

interface IIpfsCidProps {
    label?: string;
    cid: string;
}


export function IpfsCid({ label, cid }: IIpfsCidProps) {

    const [isCopied, setIsCopied] = useState(false);



    return (
        <div className={`mb-1 ${styles.container}`}>
            <span className={`heading mr-1 mb-0 ${styles.label}`}>{label} </span>
            <pre className={`mr-5 px-1 py-0 ${styles.cid}`}><code>{cid}</code></pre>
            {(isCopied) ? 
                <FontAwesomeIcon
                    icon={faCheck}
                    className={`fas fa-check mr-3 ${styles.green}`}
                ></FontAwesomeIcon>
            :
                <FontAwesomeIcon 
                    icon={faCopy} 
                    className="fas fa-copy mr-3"
                    onClick={() => {
                        navigator.clipboard.writeText(cid)
                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 3000)
                    }}
                ></FontAwesomeIcon>
            }
        </div>
    )
}
