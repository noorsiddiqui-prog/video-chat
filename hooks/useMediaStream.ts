//when it is instantiate it would request access for your camera and it would setup the stream

import { useEffect, useRef, useState } from "react";

const useMediaStream = () => {
  const [state, setState] = useState<any>(null);
  const isStreamSet = useRef(false);

  useEffect(() => {
    if (isStreamSet?.current) return;
    isStreamSet.current = true;
    (async function initStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("setting your stream");
        setState(stream);
      } catch (error) {
        console.log("error in media navigator", error);
      }
    })();
  }, []);
  return {
    stream: state,
  };
};

export default useMediaStream;
