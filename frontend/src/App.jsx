import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Home />
      </div>
    </BrowserRouter>
  )
}

export default App