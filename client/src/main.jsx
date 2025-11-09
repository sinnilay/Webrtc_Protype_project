// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// // import App2 from './app2.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import { Socketprovider } from './Providers/Socket.jsx'
// import { PeerProvider } from './Providers/Peer.jsx'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//   <PeerProvider>
//   <Socketprovider>
//     <App />
//   </Socketprovider>
//   </PeerProvider>
// </BrowserRouter>
// )
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Socketprovider } from './Providers/Socket.jsx'
import { PeerProvider } from './Providers/Peer.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Socketprovider>
      <PeerProvider>
        <App />
      </PeerProvider>
    </Socketprovider>
  </BrowserRouter>
)
