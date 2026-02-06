import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import './App.css'
import Register from './pages/Register';

function App() {
  return (
    <div>
      <h1>Testing</h1>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </div>
  )
}

export default App
