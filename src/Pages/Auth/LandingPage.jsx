import React from 'react'
import './Css/LandingPage.css'
import Header from '../../Components/Header'
import Hero from '../../Components/Hero'
import Features from '../../Components/Features'
import Manage from '../../Components/Manage'
import Inventra from '../../Components/Inventra'
import Welcome from '../../Components/Welcome'
import RealTime from '../../Components/RealTime'
import StandsOut from '../../Components/StandsOut'
import Track from '../../Components/Track'
import Freq from '../../Components/Freq'
import Actions from '../../Components/Actions'
import Works from '../../Components/Works'
import Control from '../../Components/Control'
import Footer from '../../Components/Footer'

const LandingPage = () => {
  return (
    <div>
      <Header/>
      <Hero/>
      <Features/>
      <Manage/>
      <Inventra/>
      <Welcome/>
      <RealTime/>
      <StandsOut/>
      <Track/>
      <Freq/>
      <Actions/>
      <Works/>
      <Control/>
      <Footer/>
    </div>
  )
}

export default LandingPage
