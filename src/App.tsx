import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Journey from './pages/Journey'
import { useState } from 'react';

function App() {
  const [token, setToken] = useState('');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home token={token} setToken={setToken}/>} />
        <Route path="/journey" element={<Journey token={token} setToken={setToken}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
