import { getTags } from '../lib/tags'
import SortableTags from '../components/sortable-tags'

export default async function Page() {
    const tags = await getTags();

    return (
        <div className="content">
            <div className="box">
                <h2>Tags</h2>
                <SortableTags tags={tags}/>
            </div>
        </div>
    )
}