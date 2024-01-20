'use client'

import React, { useState } from 'react';
import { ITag } from '../lib/tags';
import Link from 'next/link';
import slugify from 'slugify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

interface ISortableTagsProps {
    tags: ITag[];
}

export default function SortableTags({ tags }: ISortableTagsProps) {
    const [filterText, setFilterText] = useState('');
    const [sortOption, setSortOption] = useState('Sort');

    const filteredTags = tags.filter((tag: ITag) =>
        tag.attributes.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const sortedTags = [...filteredTags].sort((a, b) => {
        if (sortOption === 'Alphabetical') {
            return a.attributes.name.localeCompare(b.attributes.name);
        } else if (sortOption === 'Frequency') {
            return b.attributes.count - a.attributes.count;
        }
        return 0;
    });

    return (
        <>
            <div className="field is-grouped">
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        placeholder="Filter"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faFilter} className="fas fa-filter" />
                    </span>
                </div>
                <div className="control">
                    <div className="select">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option>Sort</option>
                            <option>Alphabetical</option>
                            <option>Frequency</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="tags">
                {sortedTags.map((tag: ITag) => (
                    <span key={tag.id} className="tag">
                        <Link href={`/tags/${slugify(tag.attributes.name)}`} className="vod-tag">
                            {tag.attributes.name} ({tag.attributes.count})
                        </Link>
                    </span>
                ))}
            </div>
        </>
    );
}
