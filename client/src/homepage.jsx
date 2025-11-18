// import React, { useEffect, useState } from 'react'
// import { useSocket } from './Providers/Socket'
// import { useNavigate } from 'react-router-dom'

// function Homepage() {
//    const navigate=useNavigate();
//     const [email,setemail] = useState("")
//     const [roomId,setroomId] = useState("")
//     const {socket} = useSocket();
//     // useEffect(()=>{
        
        
//     // },[email,roomId])
//     function joineRoom() {
       
//         socket.emit("join-room",{email,roomId})
//     }
//    useEffect(() => {
//   const handleJoinedRoom = (data) => {
//     console.log("data", data);
//     navigate(`/room/${data.roomId}`)
//     // alert(`room joined ${data.roomId}`);
//   };

//   socket.on("joined-room", handleJoinedRoom);

//   return () => {
//     socket.off("joined-room", handleJoinedRoom);
//   };
// }, [socket, roomId]);

//   return (
//     <>
//    <input type="text" value={email} onChange={e=>setemail(e.target.value)}   placeholder='enter your gmail'/>
//    <br />

//    <input type="number" onChange={e=>setroomId(e.target.value)} value={roomId} placeholder='enter your room id' />
//    <br />

//    <button onClick={joineRoom} type="submit">SUBMIT</button>
//    </>
//   )
// }

// export default Homepage

import React, { useEffect, useState } from 'react'
import { useSocket } from './Providers/Socket'
import { useNavigate } from 'react-router-dom'

function Homepage() {
  const navigate=useNavigate();
      const {socket} = useSocket();
   const [email, setemail] = useState("")
   const [roomId, setroomId] = useState("")

 function joineRoom() {
       if(email =="" || roomId ==""){
        alert("pls fill all the details")
        return
       }
        socket.emit("join-room",{email,roomId})
    }
   useEffect(() => {
  const handleJoinedRoom = (data) => {
    console.log("data", data);
    navigate(`/room/${data.roomId}`)
    // alert(`room joined ${data.roomId}`);
  };

  socket.on("joined-room", handleJoinedRoom);

  return () => {
    socket.off("joined-room", handleJoinedRoom);
  };
}, [socket, roomId]);

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <h1>Join Video Room</h1>
          <p>Connect with others in a secure video call</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={e => setemail(e.target.value)}   
            placeholder='Enter your email'
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="roomId">Room ID</label>
          <input 
            id="roomId"
            type="number" 
            onChange={e => setroomId(e.target.value)} 
            value={roomId} 
            placeholder='Enter room ID' 
            className="input-field"
            required
          />
        </div>

        <button onClick={joineRoom} className="submit-btn" type="button">
          <span>Join Room</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          padding: 20px;
        }

        .card {
          background: white;
          border-radius: 20px;
          padding: 48px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
          margin-bottom: 24px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .card-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .card-header p {
          font-size: 15px;
          color: #718096;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.3s ease;
          outline: none;
          background: #f8fafc;
        }

        .input-field:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-field::placeholder {
          color: #a0aec0;
        }

        .submit-btn {
          width: 100%;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn svg {
          transition: transform 0.3s ease;
        }

        .submit-btn:hover svg {
          transform: translateX(4px);
        }

        @media (max-width: 480px) {
          .card {
            padding: 36px 24px;
          }

          .card-header h1 {
            font-size: 24px;
          }

          .icon {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
    </div>
  )
}

export default Homepage