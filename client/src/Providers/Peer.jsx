// import React ,{useMemo,useEffect, useState, useCallback} from "react";
// const PeerContext= React.createContext(null)

// export  const usePeer = ()=>React.useContext(PeerContext)
// export const PeerProvider=(props)=>{
// const Peer = useMemo(() => new RTCPeerConnection({
//   iceServers: [
//     {
//       urls: [
//         "stun:stun.l.google.com:19302",
//         "stun:global.stun.twilio.com:3478"
//       ],
//     },
//   ]
// }), []);

// const [remotestream,setremotestream] = useState(null)
//     const createOffer = async ()=>{
//         const offer = await Peer.createOffer()
//         await Peer.setLocalDescription(offer)
//         return offer

//     }

//     const creteanswer= async(offer)=>{
//         await Peer.setRemoteDescription(offer)
//         const answer = await Peer.createAnswer()
//         await Peer.setLocalDescription(answer)
       
//         return answer
//     }

//     const sendstream=async (stream)=>{
//           const tracks = stream.getTracks()
//           for(const track of tracks){
//             Peer.addTrack(track,stream)
//           }
//     }
//     const setRemoteans = async(ans)=>{
//       await Peer.setRemoteDescription(ans)
//     }
//     const handletrackevent =useCallback((ev)=>{
//         const streams = ev.streams
//         setremotestream(streams[0])
//     },[Peer])
 
//     useEffect(()=>{
//       Peer.addEventListener('track',handletrackevent)
//       // Peer.addEventListener('negotiationneeded',handlenegotiation)
//       return()=>{
//         Peer.removeEventListener('track',handletrackevent)
//         //  Peer.removeEventListener('negotiationneeded',handlenegotiation)
//       }
//     })

//     return(
//         <PeerContext.Provider value={{Peer,
//                                       createOffer,
//                                       creteanswer,
//                                       setRemoteans,
//                                       sendstream,
//                                       remotestream}}>
//         {props.children}
//         </PeerContext.Provider>
//     )
// }

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useSocket } from "./Socket";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const { socket } = useSocket();

  const Peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const [remotestream, setremotestream] = useState(null);
  const [remoteEmail, setRemoteEmail] = useState(null);
  const [remoteScreenStream, setRemoteScreenStream] = useState(null);
  // 🔹 ICE Candidate found locally
  useEffect(() => {
    Peer.onicecandidate = (event) => {
      if (event.candidate && remoteEmail) {
        socket.emit("send-ice-candidate", {
          candidate: event.candidate,
          to: remoteEmail,
        });
      }
    };
  }, [Peer, socket, remoteEmail]);

  // 🔹 Listen for ICE candidates from remote peer
  useEffect(() => {
    socket.on("receive-ice-candidate", async (data) => {
      try {
        await Peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });

    return () => socket.off("receive-ice-candidate");
  }, [socket, Peer]);

  const createOffer = async () => {
    const offer = await Peer.createOffer();
    await Peer.setLocalDescription(offer);
    return offer;
  };

  const creteanswer = async (offer) => {
    await Peer.setRemoteDescription(offer);
    const answer = await Peer.createAnswer();
    await Peer.setLocalDescription(answer);
    return answer;
  };

  const sendstream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      Peer.addTrack(track, stream);
    }
  };

  const setRemoteans = async (ans) => {
    await Peer.setRemoteDescription(ans);
  };

  const handletrackevent = useCallback((ev) => {
        const stream = ev.streams[0];

  // If it's screen share (video only)
  if (stream.getVideoTracks().length === 1 && stream.getAudioTracks().length === 0) {
    setRemoteScreenStream(stream);
    return
  }
    setremotestream(ev.streams[0]);
  }, []);

  useEffect(() => {
    Peer.addEventListener("track", handletrackevent);
    return () => {
      Peer.removeEventListener("track", handletrackevent);
    };
  }, [Peer, handletrackevent]);

  return (
    <PeerContext.Provider
      value={{
        Peer,
        createOffer,
        creteanswer,
        setRemoteans,
        sendstream,
        remotestream,
        setRemoteEmail,
        remoteScreenStream
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
