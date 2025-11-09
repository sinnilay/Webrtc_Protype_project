// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSocket } from './Providers/Socket'
// import { usePeer } from './Providers/Peer'

// function RoomPage() {
//   const { roomId } = useParams()
//   const { socket } = useSocket()
//   const { Peer, createOffer, creteanswer, setRemoteans ,sendstream,remotestream} = usePeer()
//   const [remoteEmail,setremoteEmail] = useState(null)

//   const [mystream, setmystream] = useState(null)
//   const [joinerName, setjoinerName] = useState(null)

//   const videoRef = useRef(null)
//   const remotevideoref=useRef(null)

//   // ✅ Attach MediaStream to <video>
//   useEffect(() => {
//     if (videoRef.current && mystream) {
//       videoRef.current.srcObject = mystream
//     }
//   }, [mystream])
//    useEffect(() => {
//     if (remotevideoref.current && remotestream) {
//       remotevideoref.current.srcObject = remotestream
//     }
//   }, [remotestream])

//   const handleNewUserJoined = useCallback(async (data) => {
//     const { email } = data
//     console.log(`user ${email} joined the room`);

//     const offer = await createOffer()
//     socket.emit("call-user", { email, offer })
//   }, [createOffer, socket])

//   const handleIncomingCall = useCallback(async (data) => {
//     const { email, offer } = data
//     console.log("Incoming call from", email, offer);
//     const ans = await creteanswer(offer)
//     setremoteEmail(email)
//     socket.emit("call-accepted", { email, answer: ans })
//   }, [creteanswer, socket])

//   const handleCallAccepted = useCallback(async (data) => {
//     const { answer, femail } = data
//     console.log(`Call accepted by ${femail}`, answer);
//     setremoteEmail(femail)
//     await setRemoteans(answer)
//   }, [setRemoteans])

//      const handlenegotiation = useCallback(()=>{
//         console.log("oopd||||");
//         const offer =  Peer.localDescription
//         socket.emit("call-user", { remoteEmail, offer })
        
//       })
//   useEffect(() => {
//     socket.on("user-joined", handleNewUserJoined)
//     socket.on("incomming-call", handleIncomingCall)
//     socket.on("call-accepted", handleCallAccepted)
//     Peer.addEventListener('negotiationneeded',handlenegotiation)
//     return () => {
//       socket.off("user-joined", handleNewUserJoined)
//       socket.off("incomming-call", handleIncomingCall)
//       socket.off("call-accepted", handleCallAccepted)
//          Peer.removeEventListener('negotiationneeded',handlenegotiation)
//     }
//   }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted])

//   const getUserMediaStream = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//     // sendstream(stream)
//     setmystream(stream)

//   }, [Peer])

//   useEffect(() => {
//     getUserMediaStream()
//   }, [getUserMediaStream])

//   return (
//     <>
//       <div>Welcome to the RoomPage</div>

//       {joinerName && <div>Room joined by {joinerName}</div>}
//       <br />

//       <h1>Room Id: {roomId}</h1>

//       <button onClick={(e)=>sendstream(mystream)}>Send my video</button>

//       {/* ✅ Local Video */}
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         style={{ width: '150px', backgroundColor: 'black' }}
//       ></video>
//        <video
//         ref={remotevideoref}
//         autoPlay
//         muted
//         playsInline
//         style={{ width: '150px', backgroundColor: 'black' }}
//       ></video>
//     </>
//   )
// }

// export default RoomPage


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from './Providers/Socket';
import { usePeer } from './Providers/Peer';

function RoomPage() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const {
    Peer,
    createOffer,
    creteanswer,
    setRemoteans,
    sendstream,
    remotestream,
  } = usePeer();

  const [remoteEmail, setremoteEmail] = useState(null);
  const [mystream, setmystream] = useState(null);

  const videoRef = useRef(null);
  const remotevideoref = useRef(null);

  // ✅ Attach streams to video elements
  useEffect(() => {
    if (videoRef.current && mystream) {
      videoRef.current.srcObject = mystream;
    }
  }, [mystream]);

  useEffect(() => {
    if (remotevideoref.current && remotestream) {
      remotevideoref.current.srcObject = remotestream;
    }
  }, [remotestream]);

  // ✅ Handle a new user joining the room (send offer)
  const handleNewUserJoined = useCallback(async (data) => {
    const { email } = data;
    console.log(`user ${email} joined the room`);

    const offer = await createOffer();
    socket.emit('call-user', { email, offer });
  }, [createOffer, socket]);

  // ✅ Handle incoming offer (create answer)
  const handleIncomingCall = useCallback(async (data) => {
    const { email, offer } = data;
    console.log('Incoming call from', email);
    const ans = await creteanswer(offer);
    setremoteEmail(email);
    socket.emit('call-accepted', { email, answer: ans });
  }, [creteanswer, socket]);

  // ✅ Handle answer from remote peer
  const handleCallAccepted = useCallback(async (data) => {
    const { answer, femail } = data;
    console.log(`Call accepted by ${femail}`);
    setremoteEmail(femail);
    await setRemoteans(answer);
  }, [setRemoteans]);

  // ✅ Handle ICE candidate generation and send over socket
  useEffect(() => {
    Peer.onicecandidate = (event) => {
      console.log("icecandisdate came");
      
      if (event.candidate && remoteEmail) {
        console.log("Sending ICE candidate");
        socket.emit("send-ice-candidate", {
          candidate: event.candidate,
          to: remoteEmail,
        });
      }
    };
  }, [Peer, socket, remoteEmail]);

  // ✅ Handle ICE candidate received from remote
  useEffect(() => {
    const handleIncomingCandidate = async (data) => {
      try {
        console.log("Received ICE candidate");
        await Peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error adding received ice candidate", error);
      }
    };
    socket.on("receive-ice-candidate", handleIncomingCandidate);

    return () => {
      socket.off("receive-ice-candidate", handleIncomingCandidate);
    };
  }, [Peer, socket]);

  // ✅ Handle negotiationneeded (for later track addition renegotiation)
  const handlenegotiation = useCallback(async () => {
    console.log("Negotiation needed...");
    if (!remoteEmail) {
      console.warn("No remoteEmail to negotiate with yet");
      return;
    }
    const offer = await createOffer();
    socket.emit("call-user", { email: remoteEmail, offer });
  }, [Peer, socket, remoteEmail, createOffer]);

  // ✅ Register socket event handlers
  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined);
    socket.on('incomming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    Peer.addEventListener('negotiationneeded', handlenegotiation);

    return () => {
      socket.off('user-joined', handleNewUserJoined);
      socket.off('incomming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      Peer.removeEventListener('negotiationneeded', handlenegotiation);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted, Peer, handlenegotiation]);

  // ✅ Get local media
  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setmystream(stream);
    } catch (err) {
      console.error("Error accessing media devices", err);
    }
  }, []);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <>
      <div>Welcome to the RoomPage</div>
      <h1>Room Id: {roomId}</h1>

      <button onClick={() => sendstream(mystream)}>Send My Video</button>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '300px', backgroundColor: 'black' }}
        ></video>

        <video
          ref={remotevideoref}
          autoPlay
          playsInline
          style={{ width: '300px', backgroundColor: 'black' }}
        ></video>
      </div>
    </>
  );
}

export default RoomPage;
