import Link from 'next/link';

interface IPagerProps {
    baseUrl: string; // Pass the base URL as a prop
    page: number;
    pageCount: number;
}

export default function Pager({ baseUrl, page, pageCount }: IPagerProps): React.JSX.Element {
    const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

    const getPagePath = (page: any) => {
        const pageNumber = parseInt(page);
        return `${baseUrl}/${pageNumber}`;
    };

    // Define the number of page links to show around the current page
    const maxPageLinksToShow = 3;

    // Calculate the range of page numbers to display
    const startPage = Math.max(1, page - Math.floor(maxPageLinksToShow / 2));
    const endPage = Math.min(pageCount, startPage + maxPageLinksToShow - 1);

    return (
        <div className="box">
            <nav className="pagination">
                {page > 1 && (
                    <Link href={getPagePath(page - 1)} className="pagination-previous">
                        <span>Previous</span>
                    </Link>
                )}
                {page < pageCount && (
                    <Link href={getPagePath(page + 1)} className="pagination-next" >
                        <span>Next</span>
                    </Link>
                )}

                <ul className="pagination-list">
                    {startPage > 1 && (
                        <li>
                            <Link href={getPagePath(1)} className={`pagination-link ${1 === page ? 'is-current' : ''}`}>
                                <span>1</span>
                            </Link>
                        </li>
                    )}

                    {startPage > 2 && (
                        <li>
                            <span className="pagination-ellipsis">&hellip;</span>
                        </li>
                    )}

                    {pageNumbers.slice(startPage - 1, endPage).map((pageNumber) => (
                        <li key={pageNumber}>
                            <Link href={getPagePath(pageNumber)} className={`pagination-link ${pageNumber === page ? 'is-current' : ''}`}>
                                <span>
                                    {pageNumber}
                                </span>
                            </Link>
                        </li>
                    ))}

                    {endPage < pageCount - 1 && (
                        <li>
                            <span className="pagination-ellipsis">&hellip;</span>
                        </li>
                    )}

                    {endPage !== pageCount && (
                        <li>
                            <Link href={getPagePath(pageCount)} className={`pagination-link ${pageCount === page ? 'is-current' : ''}`}>
                                <span>
                                    {pageCount}
                                </span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}
