import { formatISO } from "date-fns";

interface ILocalizedDateProps {
    date: Date;
}

export function LocalizedDate ({ date }: ILocalizedDateProps) {
    const isoDateTime = formatISO(date);
    const isoDate = formatISO(date, { representation: 'date' });
    return (
        <>
            <time dateTime={isoDateTime}>{isoDate}</time>
        </>
    )
}