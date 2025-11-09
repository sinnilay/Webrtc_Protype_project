import React ,{useContext, useMemo}from "react";
import { io } from "socket.io-client";
const Socketcontext = React.createContext(null)

export const Socketprovider=(props)=>{
    const socket = useMemo(()=>io("http://localhost:7401"))
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