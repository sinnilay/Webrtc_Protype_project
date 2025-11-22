import React ,{useContext, useMemo}from "react";
import { io } from "socket.io-client";
const Socketcontext = React.createContext(null)

export const Socketprovider=(props)=>{
    // const socket = useMemo(()=>io("http://localhost:7401"))
    const socket = useMemo(()=>io("https://webrtc-protype-project.onrender.com/"))
    // const socket = useMemo(()=>io("https://r5dx1g46-7401.inc1.devtunnels.ms/"))
    // https://r5dx1g46-7401.inc1.devtunnels.ms/
    const name="nilay"
    return(
        <Socketcontext.Provider value={{socket}}>
            {props.children}
        </Socketcontext.Provider>
    )
}

export const useSocket=()=>{
    return useContext(Socketcontext)

}