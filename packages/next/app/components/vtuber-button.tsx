import Image from "next/image"

interface VtuberButtonProps {
    image: string;
    displayName: string;
    size?: string;
}

export default function VtuberButton ({ image, displayName, size }: VtuberButtonProps) {
    const sizeClass = (() => {
        if (size === 'large') return 'is-large';
        if (size === 'medium') return 'is-medium';
        if (size === 'small') return 'is-small'
    })();
    return (
        <div className={`button ${sizeClass}`}>
            <span className="icon image">
                <Image
                    className='is-rounded'
                    src={image}
                    alt={displayName}
                    width={32}
                    height={32}
                    />
                </span>
            <span>{displayName}</span>
        </div>
    );
}