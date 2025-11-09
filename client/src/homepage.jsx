import React, { useEffect, useState } from 'react'
import { useSocket } from './Providers/Socket'
import { useNavigate } from 'react-router-dom'

function Homepage() {
   const navigate=useNavigate();
    const [email,setemail] = useState("")
    const [roomId,setroomId] = useState("")
    const {socket} = useSocket();
    // useEffect(()=>{
        
        
    // },[email,roomId])
    function joineRoom() {
       
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
    <>
   <input type="text" value={email} onChange={e=>setemail(e.target.value)}   placeholder='enter your gmail'/>
   <br />

   <input type="number" onChange={e=>setroomId(e.target.value)} value={roomId} placeholder='enter your room id' />
   <br />

   <button onClick={joineRoom} type="submit">SUBMIT</button>
   </>
  )
}

export default Homepage