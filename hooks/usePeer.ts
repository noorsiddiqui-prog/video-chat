import { useEffect, useRef, useState } from "react";
import peer from "peerjs"; // if this import doesnot work then import in useEffect
import useSocket from "./useSocket";
import { useRouter } from "next/router";

const usePeer = () => {
  const socket = useSocket();
  const [peer, setPeer] = useState<any>(null);
  const [myId, setMyId] = useState<string>("");
  const roomId = useRouter().query.roomId;
  const isPeerSet = useRef(false);
  useEffect(() => {
    if (isPeerSet?.current || !roomId || !socket) return;
    isPeerSet.current = true;
    (async function initPeer() {
      const myPeer = new (await import("peerjs")).default();
      setPeer(myPeer);
      myPeer.on("open", (id) => {
        console.log(`your peer id is ${id}`);
        setMyId(id);
        socket?.emit("join-room", roomId, id);
      });
    })();
  }, [roomId, socket]);
  return {
    myId,
    peer,
  };
};

export default usePeer;
