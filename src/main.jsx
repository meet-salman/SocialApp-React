import React from 'react'
import ReactDOM from 'react-dom/client'
import ContextProvider from './config/context/ContextProvider.jsx'

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <ContextProvider> */}
      <App />
    {/* </ContextProvider> */}
  </React.StrictMode>,
)
