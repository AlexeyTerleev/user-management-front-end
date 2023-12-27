import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"
import Router from './Router';

const App:React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

