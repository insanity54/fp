import type { MutableRefObject, RefCallback } from 'react';

type RefType<T> = MutableRefObject<T> | RefCallback<T> | null;

export const shareRef = <T>(refA: RefType<T>, refB: RefType<T>): RefCallback<T> => instance => {
    if (typeof refA === 'function') {
        refA(instance);
    } else if (refA && 'current' in refA) {
        (refA as MutableRefObject<T>).current = instance as T; // Use type assertion to tell TypeScript the type
    }
    if (typeof refB === 'function') {
        refB(instance);
    } else if (refB && 'current' in refB) {
        (refB as MutableRefObject<T>).current = instance as T; // Use type assertion to tell TypeScript the type
    }
};
