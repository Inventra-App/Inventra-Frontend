import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/Auth/LandingPage'
import Pricing from './Pages/Auth/Pricing'
import AboutUs from './Pages/Auth/AboutUs'
import ContactUs from './Pages/Auth/ContactUs'
import SignUp from './Pages/Auth/SignUp'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
