import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <BrowserRouter>
      <div>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setShowRegister(false)}>Login</button>
          <button onClick={() => setShowRegister(true)}>Register</button>
        </div>
        
        {showRegister ? <Register /> : <Login />}
      </div>
    </BrowserRouter>
  )
}

export default App;
