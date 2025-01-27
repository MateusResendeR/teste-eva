import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Journey from './pages/Journey'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<Journey />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
