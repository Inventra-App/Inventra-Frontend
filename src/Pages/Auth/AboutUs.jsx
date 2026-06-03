import React from 'react'
import { useState } from "react";
import Footer  from '../../Components/Footer'
import './Css/AboutUs.css'
import Header from '../../Components/Header'
import about  from "../../assets/about.png"
import team from "../../assets/team.png"
import ourmission from "../../assets/OUR MISSION.png"
import ourvission from "../../assets/OUR VISION.png"
import amico from "../../assets/amico.png"
import customerFeedback from "../../assets/customerFeedback.png"
import ear from "../../assets/Ear.png"
import star from "../../assets/Star.png"
import anto from "../../assets/Anto.png"
import Ellipse from "../../assets/Ellipse 23 (1).png"
import { useRef } from 'react';
const AboutUs = () => {
const [hovered, setHovered] = useState(false);
const sliderRef = useRef(null);

const handleMouseDown = (e) => {
  const slider = sliderRef.current;
  let startX = e.pageX;
  let scrollLeft = slider.scrollLeft;

  const handleMouseMove = (e) => {
    slider.scrollLeft = scrollLeft - (e.pageX - startX);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
  return (
    <div className='aboutus-container'>
      <Header/>
      <section className='aboutus'>
      <img src={about} alt="" className='imgabout'/>
      </section>

      <section className='aboutSmarter'>
        <div className='aboutText'>
          <h5>Building Smarter <br />
           Inventory Operation for <br />
           Modern Supermarkets</h5>
           <p className='h52'>
            Inventra helps supermarkets simplify inventory management <br />
monitor products expiry, manage sales, and improve operational <br />
visibility- all from one centralized platform. <br />
           </p>
        </div>
        <div
  className='aboutImg'
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>
  <div className={`imagePair ${hovered ? "hide" : "show"}`}>
    <img src={anto} alt="" className='bigImg' />
    <img src={Ellipse} alt="" className='smallImg' />
  </div>

  <div className={`imagePair ${hovered ? "show" : "hide"}`}>
    <img src={Ellipse} alt="" className='bigImg' />
    <img src={anto} alt="" className='smallImg' />
  </div>
</div>
      </section>

      <section className='ourstory'>
        <div className='ourstory-container'>
          <article className='acoma'>
            <img src={amico} alt="" className='amico' />

            <div className='aboutusText-container'>
              <h5 className='aboutusText'>OUR STORY</h5>
              <div className='aboutusText2'>
                <p className='story-text'>
                 <p>During  our research with supermarkets, we discovered that many <br />
supermarkets still rely on Manuel inventory counting, spreadsheets, <br />
and inconsistent expiry tracking processes <br /></p>

<p>This often leads to inaccurate stocks records, expired products, <br />
operational stress, and financial losses. <br /></p>

<p>Inventra was created to solve these challenges by helping <br />
businesses manage inventory, sales, expiry monitoring, and staff <br />
accountability more efficiently through technology</p>
                </p>
              </div>
            </div>
          </article>
        </div>
        <div className='ourstory-container2'>
           <article className='acoma2'>
            <img src={ourmission} alt="" className='ourmission'/>
            <img src={ourvission} alt="" className='ourvission'/> 
           </article>
        </div>
      </section>

<section className='Research'>
<article className='research-container'>
  <h5 className='researchText'>RESEARCH DRIVEN</h5>
  <p className='researchText2'> <div className='research-content'><b className='bold'>Built from Real Supermarket Research</b> <br />

<span>Our product decision were guided by <b>interviews</b> and research <br />
conducted with supermarket operators to better understand <br />
their daily inventory and operational challenges.</span></div>
</p>
</article>

<div className='researchImg'>
  <div className='box1'>
    <nav className='box-content'>
      <div className='box-contenth6'>15+</div>
     <div className='box-contentspan1'>Supermarkets Interviewed</div>
    </nav>
  </div>
  <div className='box1'>
    <nav className='box-content'>
      <div className='box-contenth6'>30+</div>
     <div className='box-contentspan2'>Operational <br /> Challenges Identified</div>
    </nav>
  </div>
  <div className='box1'>
    <nav className='box-content'>
      <div className='box-contenth6'>100+</div>
      <div className='box-contentspan3'>Insights Driving <br /> Our Solution</div>
    </nav>
  </div>
</div>
</section>

<section className='customerFeedback'>
  <img src={customerFeedback} alt=""  className='customerFeedbackImg'/>
</section>
<section className='customerReview'>
  <article className='customerReview-container'>
    <div className='customerReviewText'>
      <div className='customerReviewText1'>
<img src={ear} alt="" className='ear'/>
      </div>
      <div className='customerReviewText2'>
        <h5 className='customerReviewText2h5'>What our <br/>
customers are <br />
saying</h5>
      </div>
    </div>
  </article>
  <div ref={sliderRef} className="reviews-container" onMouseDown={handleMouseDown}>
  <div className="review-card">
    <div className="review-content">
      <div className="reviewer-info">
        <h6 className="reviewer-name">Since we started using inventra, tracking expiring <br/>
products has become much easier. we've reduced <br />
product losses and improved our inventory accuracy <br />
significantly</h6>
      </div>
      <img src={star} alt="" className='star'/>
      <article className='reviewer-info2'>
        <img src={anto} alt="" className='anto'/>
        <p className='reviewer-name2'>Chinedu Okafor, Store Manager</p>
      </article>
    </div>
  </div>

    <div className="review-card">
    <div className="review-content">
      <div className="reviewer-info">
        <h6 className="reviewer-name">What i like most is the accountability feature. Everu <br />
stock update is tracked, so managing operations is  <br />
now more transparent and efficient <br /></h6>
      </div>
      <img src={star} alt="" className='star'/>
      <article className='reviewer-info2'>
        <img src={Ellipse} alt="" className='anto'/>
        <p className='reviewer-name2'>Mary ibrahim, Inventory Officer</p>
      </article>
    </div>
  </div>

    <div className="review-card">
    <div className="review-content">
      <div className="reviewer-info">
        <h6 className="reviewer-name">Since we started using inventra, tracking expiring <br/>
products has become much easier. we've reduced <br />
product losses and improved our inventory accuracy <br />
significantly</h6>
      </div>
      <img src={star} alt="" className='star'/>
      <article className='reviewer-info2'>
        <img src={anto} alt="" className='anto'/>
        <p className='reviewer-name2'>Chinedu Okafor, Store Manager</p>
      </article>
    </div>
  </div>

    <div className="review-card">
    <div className="review-content">
      <div className="reviewer-info">
        <h6 className="reviewer-name">Since we started using inventra, tracking expiring <br/>
products has become much easier. we've reduced <br />
product losses and improved our inventory accuracy <br />
significantly</h6>
      </div>
      <img src={star} alt="" className='star'/>
      <article className='reviewer-info2'>
        <img src={anto} alt="" className='anto'/>
        <p className='reviewer-name2'>Chinedu Okafor, Store Manager</p>
      </article>
    </div>
  </div>

    <div className="review-card">
    <div className="review-content">
      <div className="reviewer-info">
        <h6 className="reviewer-name">Since we started using inventra, tracking expiring <br/>
products has become much easier. we've reduced <br />
product losses and improved our inventory accuracy <br />
significantly</h6>
      </div>
      <img src={star} alt="" className='star'/>
      <article className='reviewer-info2'>
        <img src={anto} alt="" className='anto'/>
        <p className='reviewer-name2'>Mary ibrahim, Inventory Officer</p>
      </article>
    </div>
  </div>
</div>
<div className="review-dots" aria-hidden="true">
  <span className="review-dot active"></span>
  <span className="review-dot"></span>
  <span className="review-dot"></span>
  <span className="review-dot"></span>
</div>
  </section>
      <section>
        <img src={team} alt=""  className='team'/>
      </section>
<Footer/>
    </div>
  )
}

export default AboutUs
