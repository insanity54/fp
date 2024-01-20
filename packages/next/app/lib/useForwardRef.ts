/**
 * greetz https://github.com/facebook/react/issues/24722#issue-1270749463
 */

import React, { useEffect, useRef, type ForwardedRef } from 'react';

const useForwardRef = <T,>(
  ref: ForwardedRef<T>,
  initialValue: any = null
) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
};


export default useForwardRef