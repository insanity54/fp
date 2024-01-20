'use client';

import { ITagVodRelation, ITagVodRelationsResponse } from "@/lib/tag-vod-relations"
import { isWithinInterval, subHours } from "date-fns";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext, IUseAuth } from "./auth";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { strapiUrl } from "@/lib/constants";

export interface ITagParams {
    tvr: ITagVodRelation;
}


function isCreatedByMeRecently(userId: number | undefined, tvr: ITagVodRelation) {
    if (!userId) return false;
    if (userId !== tvr.attributes.creatorId) return false;
    const last24H: Interval = { start: subHours(new Date(), 24), end: new Date() };
    if (!isWithinInterval(new Date(tvr.attributes.createdAt), last24H)) return false;
    return true;
}

async function handleDelete(authContext: IUseAuth | null, tvr: ITagVodRelation): Promise<void> {
    if (!authContext) return;
    const { authData } = authContext;
    const res = await fetch(`${strapiUrl}/api/tag-vod-relations/deleteMine/${tvr.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authData?.accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) throw new Error(res.statusText)
}

export function Tag({ tvr }: ITagParams) {
    const authContext = useContext(AuthContext);
    const router = useRouter()
    const [shouldRenderDeleteButton, setShouldRenderDeleteButton] = useState<boolean>(false);

    useEffect(() => {
        setShouldRenderDeleteButton(isCreatedByMeRecently(authContext?.authData?.user?.id, tvr));
    }, [authContext?.authData?.user?.id, tvr]);

    return (
        <span className="tags mr-2 mb-0">
            <span className="tag">{tvr.attributes.tag.data.attributes.name}</span>
            {shouldRenderDeleteButton && <a onClick={
                () => {
                    handleDelete(authContext, tvr); router.refresh()
                }
            } className="tag"><span className="icon is-small"><FontAwesomeIcon className="fas fa-trash" icon={faTrash}></FontAwesomeIcon></span></a>}
        </span>
    )
}