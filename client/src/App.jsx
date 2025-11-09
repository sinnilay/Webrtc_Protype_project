import { useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import Homepage from "./homepage";
import RoomPage from "./RoomPage";


function App() {


  return (
    <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/room/:roomId" element={<RoomPage/>}/>
    </Routes>
  );
}

export default App;
