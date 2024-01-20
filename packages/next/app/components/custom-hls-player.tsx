import React, { useEffect, useRef, useState, forwardRef, MutableRefObject } from "react";
import { APITypes, PlyrProps, usePlyr } from "plyr-react";
import "plyr-react/plyr.css";
import { Options } from "plyr";
import Hls from "hls.js";


export function UnsupportedHlsMessage(): React.JSX.Element {
  return (
    <div className="unsupported-hls">
      HLS is not supported in your browser. Please try a different browser.
    </div>
  );
}

const useHls = (src: string, options: Options | null) => {
  const hls = useRef<Hls>(new Hls());
  const hasQuality = useRef<boolean>(false);
  const [plyrOptions, setPlyrOptions] = useState<Options | null>(options);



  useEffect(() => {
    hasQuality.current = false; 
  }, [options]);

  useEffect(() => {
    hls.current.loadSource(src);
    hls.current.attachMedia(document.querySelector(".plyr-react")!);

    hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
      if (hasQuality.current) return; // early quit if already set

      const levels = hls.current.levels;
      const quality: Options["quality"] = {
        default: levels[levels.length - 1].height,
        options: levels.map((level) => level.height),
        forced: true,
        onChange: (newQuality: number) => {
          levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.current.currentLevel = levelIndex;
            }
          });
        },
      };

      setPlyrOptions({ ...plyrOptions, quality });
      hasQuality.current = true;
    });
  });

  return { options: plyrOptions };
};

const CustomPlyrInstance = forwardRef<
  APITypes,
  PlyrProps & { hlsSource: string; mainColor: string; plyrOptions: Options }
>((props, ref) => {
  const { source, plyrOptions, hlsSource, mainColor } = props;
  const plyrRef = usePlyr(ref, {
    ...useHls(hlsSource, plyrOptions),
    source,
  }) as MutableRefObject<HTMLVideoElement>;

  return (
    <>
      <video
        ref={plyrRef}
        className="plyr-react plyr"
        style={{ "--plyr-color-main": mainColor } as React.CSSProperties}
      ></video>
    </>
  );
});


CustomPlyrInstance.displayName = 'CustomPlyrInstance'

export { CustomPlyrInstance }