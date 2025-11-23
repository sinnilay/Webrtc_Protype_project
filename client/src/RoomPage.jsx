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

// ----------------------------------------------------------------------------------------------

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSocket } from './Providers/Socket';
// import { usePeer } from './Providers/Peer';

// function RoomPage() {
//   const { roomId } = useParams();
//   const { socket } = useSocket();
//   const {
//     Peer,
//     createOffer,
//     creteanswer,
//     setRemoteans,
//     sendstream,
//     remotestream,
//   } = usePeer();

//   const [remoteEmail, setremoteEmail] = useState(null);
//   const [mystream, setmystream] = useState(null);

//   const videoRef = useRef(null);
//   const remotevideoref = useRef(null);

//   // ✅ Attach streams to video elements
//   useEffect(() => {
//     if (videoRef.current && mystream) {
//       videoRef.current.srcObject = mystream;
//     }
//   }, [mystream]);

//   useEffect(() => {
//     if (remotevideoref.current && remotestream) {
//       remotevideoref.current.srcObject = remotestream;
//     }
//   }, [remotestream]);

//   // ✅ Handle a new user joining the room (send offer)
//   const handleNewUserJoined = useCallback(async (data) => {
//     const { email } = data;
//     console.log(`user ${email} joined the room`);

//     const offer = await createOffer();
//     socket.emit('call-user', { email, offer });
//   }, [createOffer, socket]);

//   // ✅ Handle incoming offer (create answer)
//   const handleIncomingCall = useCallback(async (data) => {
//     const { email, offer } = data;
//     console.log('Incoming call from', email);
//     const ans = await creteanswer(offer);
//     setremoteEmail(email);
//     socket.emit('call-accepted', { email, answer: ans });
//   }, [creteanswer, socket]);

//   // ✅ Handle answer from remote peer
//   const handleCallAccepted = useCallback(async (data) => {
//     const { answer, femail } = data;
//     console.log(`Call accepted by ${femail}`);
//     setremoteEmail(femail);
//     await setRemoteans(answer);
//   }, [setRemoteans]);

//   // ✅ Handle ICE candidate generation and send over socket
//   useEffect(() => {
//     Peer.onicecandidate = (event) => {
//       console.log("icecandisdate came");
      
//       if (event.candidate && remoteEmail) {
//         console.log("Sending ICE candidate");
//         socket.emit("send-ice-candidate", {
//           candidate: event.candidate,
//           to: remoteEmail,
//         });
//       }
//     };
//   }, [Peer, socket, remoteEmail]);

//   // ✅ Handle ICE candidate received from remote
//   useEffect(() => {
//     const handleIncomingCandidate = async (data) => {
//       try {
//         console.log("Received ICE candidate");
//         await Peer.addIceCandidate(new RTCIceCandidate(data.candidate));
//       } catch (error) {
//         console.error("Error adding received ice candidate", error);
//       }
//     };
//     socket.on("receive-ice-candidate", handleIncomingCandidate);

//     return () => {
//       socket.off("receive-ice-candidate", handleIncomingCandidate);
//     };
//   }, [Peer, socket]);

//   // ✅ Handle negotiationneeded (for later track addition renegotiation)
//   const handlenegotiation = useCallback(async () => {
//     console.log("Negotiation needed...");
//     if (!remoteEmail) {
//       console.warn("No remoteEmail to negotiate with yet");
//       return;
//     }
//     const offer = await createOffer();
//     socket.emit("call-user", { email: remoteEmail, offer });
//   }, [Peer, socket, remoteEmail, createOffer]);

//   // ✅ Register socket event handlers
//   useEffect(() => {
//     socket.on('user-joined', handleNewUserJoined);
//     socket.on('incomming-call', handleIncomingCall);
//     socket.on('call-accepted', handleCallAccepted);
//     Peer.addEventListener('negotiationneeded', handlenegotiation);

//     return () => {
//       socket.off('user-joined', handleNewUserJoined);
//       socket.off('incomming-call', handleIncomingCall);
//       socket.off('call-accepted', handleCallAccepted);
//       Peer.removeEventListener('negotiationneeded', handlenegotiation);
//     };
//   }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted, Peer, handlenegotiation]);

//   // ✅ Get local media
//   const getUserMediaStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setmystream(stream);
//     } catch (err) {
//       console.error("Error accessing media devices", err);
//     }
//   }, []);

//   useEffect(() => {
//     getUserMediaStream();
//   }, [getUserMediaStream]);

//   return (
//     <>
//       <div>Welcome to the RoomPage</div>
//       <h1>Room Id: {roomId}</h1>

//       <button onClick={() => sendstream(mystream)}>Send My Video</button>

//       <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           style={{ width: '300px', backgroundColor: 'black' }}
//         ></video>

//         <video
//           ref={remotevideoref}
//           autoPlay
//           playsInline
//           style={{ width: '300px', backgroundColor: 'black' }}
//         ></video>
//       </div>
//     </>
//   );
// }

// export default RoomPage;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Phone, Maximize2, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from './Providers/Socket';
import { usePeer } from './Providers/Peer';
import './RoomPage.css'; // 👈 Importing CSS file

function RoomPage() {
    const [screenStream, setScreenStream] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

 const localScreenRef = useRef(null);
 const remoteScreenRef = useRef(null);
  const { roomId } = useParams();
  const { socket } = useSocket();
  const {
    Peer,
    createOffer,
    creteanswer,
    setRemoteans,
    sendstream,
    remotestream,
    remoteScreenStream
  } = usePeer();

  const [remoteEmail, setremoteEmail] = useState(null);
  const [mystream, setmystream] = useState(null);
     const [videoEnabled, setVideoEnabled] = useState(true);
   const [audioEnabled, setAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef(null);
  const remotevideoref = useRef(null);
  
  const handleShareScreen = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });

    setScreenStream(stream);

    // Show my own screen locally
    if (localScreenRef.current) {
      localScreenRef.current.srcObject = stream;
    }

    // Add screen tracks to peer connection
    stream.getTracks().forEach(track => {
      Peer.addTrack(track, stream);
    });

    // If user presses browser "Stop sharing"
    stream.getVideoTracks()[0].onended = () => {
      stopScreenShare();
    };

  } catch (err) {
    console.log("Screen share error", err);
  }
};

const stopScreenShare = () => {
  if (!screenStream) return;

  // Stop tracks
  screenStream.getTracks().forEach(t => t.stop());

  // Remove local screen preview
  if (localScreenRef.current) {
    localScreenRef.current.srcObject = null;
  }

  setScreenStream(null);
};

  useEffect(() => {
    if (videoRef.current && mystream) {
      videoRef.current.srcObject = mystream;
    }
  }, [mystream]);
  useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

  useEffect(() => {
    if (remotevideoref.current && remotestream) {
      remotevideoref.current.srcObject = remotestream;
    }
    if (remoteScreenStream && remoteScreenRef.current) {
    remoteScreenRef.current.srcObject = remoteScreenStream;
  }
  }, [remotestream,remoteScreenStream]);

  const handleNewUserJoined = useCallback(async (data) => {
    const { email } = data;
    console.log(`user ${email} joined the room`);
    const offer = await createOffer();
    socket.emit('call-user', { email, offer });
  }, [createOffer, socket]);

  const handleIncomingCall = useCallback(async (data) => {
    const { email, offer } = data;
    console.log('Incoming call from', email);
    const ans = await creteanswer(offer);
    setremoteEmail(email);
    socket.emit('call-accepted', { email, answer: ans });
  }, [creteanswer, socket]);

  const handleCallAccepted = useCallback(async (data) => {
    const { answer, femail } = data;
    console.log(`Call accepted by ${femail}`);
    setremoteEmail(femail);
    await setRemoteans(answer);
  }, [setRemoteans]);

  useEffect(() => {
    Peer.onicecandidate = (event) => {
      console.log("ICE candidate event triggered");
      if (event.candidate && remoteEmail) {
        socket.emit("send-ice-candidate", {
          candidate: event.candidate,
          to: remoteEmail,
        });
      }
    };
  }, [Peer, socket, remoteEmail]);

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

  const handlenegotiation = useCallback(async () => {
    console.log("Negotiation needed...");
    if (!remoteEmail) {
      console.warn("No remoteEmail to negotiate with yet");
      return;
    }
    const offer = await createOffer();
    socket.emit("call-user", { email: remoteEmail, offer });
  }, [Peer, socket, remoteEmail, createOffer]);

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

//   return (
//     <div className="room-container">
//       <header className="room-header">
//         <h1>Room ID: <span>{roomId}</span></h1>
//       </header>

//       <main className="video-section">
//         <div className="video-container">
//           <div className="video-card">
//             <video ref={videoRef} autoPlay muted playsInline></video>
//             <p className="video-label">You</p>
//           </div>
//           <div className="video-card">
//             <video ref={remotevideoref} autoPlay playsInline></video>
//             <p className="video-label">Remote</p>
//           </div>
//         </div>
//                 <br />
//         <br />
// <div
//   id="video-wrapper"
//   style={{ position: "relative", width: "800px" }}
// >
//   <video
//     ref={remoteScreenRef}
//     autoPlay
//     playsInline
//     style={{
//       width: "100%",
//       height: "100%",
//       objectFit: "contain",
//     }}
//   />

 
//     {remoteScreenStream ?  <button
//     onClick={() => {
//       document.getElementById("video-wrapper").requestFullscreen();
//     }}
//     style={{
//       position: "absolute",
//       bottom: "10px",
//       right: "10px",
//       padding: "8px 12px",
//       background: "rgba(0, 0, 0, 0.5)",
//       color: "white",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//     }}
//   >⛶</button> : ""}
  
// </div>

//       </main>

//       <footer className="controls">
//         <button onClick={() => sendstream(mystream)} className="control-btn">
//           🎥 Send My Video
//         </button>
//         <br />
//         <button onClick={handleShareScreen}>SHARE SCREEN</button>
//       </footer>
//     </div>
//   );
return (
    <div className="room-wrapper">
      {/* Animated background particles */}
      <div className="background-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      {/* Header */}
      <header className="room-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-box">
              <Video size={20} />
            </div>
            <div className="header-info">
              <h1 className="header-title">Video Conference</h1>
              <p className="header-subtitle">
                <Users size={14} />
                <span>Room: <span className="room-code">{roomId}</span></span>
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <div className="status-dot"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Video Grid - Always shown */}
        <div className="video-grid">
          {/* Local Video */}
          <div className="video-card">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              className="video-element"
            ></video>
            {/* Mock video placeholder */}
            {/* <div className="video-placeholder local-placeholder">
              <div className="placeholder-content">
                <div className="avatar-circle local-avatar">
                  <Video size={40} />
                </div>
                <p className="placeholder-name">You</p>
              </div>
            </div> */}
            {/* Video label overlay */}
            <div className="video-overlay">
              <div className="overlay-content">
                <span className="user-name">You</span>
                <div className="status-indicators">
                  {videoEnabled && <div className="indicator indicator-green"></div>}
                  {audioEnabled && <div className="indicator indicator-blue"></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Remote Video */}
          <div className="video-card">
            
            <video 
              ref={remotevideoref} 
              autoPlay 
              playsInline
              className="video-element"

            ></video>
  
          </div>
          
        </div>

        {/* Screen Share Section - Shows below video grid when active */}
        {remoteScreenStream && (
          <div className="screen-share-section">
            <h2 className="section-title">
              <Monitor size={20} className="section-icon" />
              Shared Screen
            </h2>
            <div className="screen-share-container">
              <video
                ref={remoteScreenRef}
                autoPlay
                playsInline
                className="screen-video"
                controls={false}
                disablePictureInPicture
                controlsList="nofullscreen noplaybackrate nodownload"

              />
              {/* Mock screen placeholder */}
              {/* <div className="screen-placeholder">
                <div className="screen-content">
                  <div className="screen-icon-wrapper">
                    <Monitor size={60} />
                  </div>
                  <p className="screen-text">Remote User's Screen</p>
                </div>
              </div> */}
              <button
                onClick={() => {
                  remoteScreenRef.current?.requestFullscreen?.();
                }}
                className="fullscreen-btn"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="control-panel">
          <div className="controls-container">
            {/* Video Toggle */}
            <button
              onClick={() => sendstream(mystream)}
              className={`control-btn ${!videoEnabled ? 'control-btn-disabled' : ''}`}
              title="Toggle Video"
            >
              {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            {/* Audio Toggle */}
            {/* <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`control-btn ${!audioEnabled ? 'control-btn-disabled' : ''}`}
              title="Toggle Audio"
            >
              {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button> */}

            {/* Screen Share Toggle - Hidden on mobile */}
            {!isMobile && (
              <button
                onClick={handleShareScreen}
                className={`control-btn ${isScreenSharing ? 'control-btn-active' : ''}`}
                title="Share Screen"
              >
                {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
              </button>
            )}

            {/* Divider */}
            <div className="control-divider"></div>

            {/* End Call */}
            <button onClick={()=>navigate("/")} className="control-btn control-btn-end" title="End Call">
              <Phone size={24} className="phone-icon" />
            </button>
          </div>
        </div>
      </main>

    
    </div>
  );
}

export default RoomPage;
