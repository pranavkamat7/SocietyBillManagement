import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom'
import { CustomThemeProvider } from './theme/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <Router>
         <App />
      </Router>
    </CustomThemeProvider>
  </React.StrictMode>
)
