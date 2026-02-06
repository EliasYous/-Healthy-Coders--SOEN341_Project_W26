import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import './App.css'
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <h1>Testing</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
