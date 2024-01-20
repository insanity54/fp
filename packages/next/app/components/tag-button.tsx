
import { useState } from 'react';

export function TagButton ({ name, selectedTag, setSelectedTag }: { name: string, selectedTag: string | null, setSelectedTag: Function }) {
    return (
        <button onClick={() => (selectedTag === name) ? setSelectedTag('') : setSelectedTag(name)} className={`button is-small mr-2 mb-1 ${(selectedTag === name) ? 'is-info' : ''}`}>{name}</button>
    )
}