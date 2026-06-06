import React, { useState } from 'react'
import './Css/ContactUs.css'
import Header from '../../Components/Header'
import Footer from "../../Components/Footer"
import  phone from "../../assets/phone.png"

const ContactUs = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !email || !phoneNumber || !message) {
      alert("Please fill all fields");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      alert("Enter a valid email");
      return;
    }

    if (!agreed) {
      alert("You must agree to the privacy policy");
      return;
    }

    alert("Message sent successfully");

    setFirstName("");
    setEmail("");
    setPhoneNumber("");
    setMessage("");
    setAgreed(false);
  };

  return (
    <div>
      <Header/>
      <section className='contact-container'>
        <article className='contactus'>
          <div className='contactext-container'>
            <h3 className='contacth3'>Contact <span>Us</span></h3>
            <p className='contactp'>We are here to help! whether you have question, feedback, or
need support, our team is ready to assist you </p>
          </div>

          <form className='contact-form' onSubmit={handleSubmit}>
            <label className='contact-field'>
              <span>First Name</span>
              <input
                type='text'
                placeholder='Chibuzor'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className='contact-field'>
              <span>Email</span>
              <input
                type='email'
                placeholder='you@company.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className='contact-field'>
              <span>Phone Number</span>
              <input
                type='tel'
                placeholder='+234'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>

            <label className='contact-field'>
              <span>Message</span>
              <textarea
                placeholder='Leave us a message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>

            <label className='privacy-check'>
              <input
                type='checkbox'
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>i agree with your friendly <u>privacy policy</u></span>
            </label>

            <button type='submit' className='contact-submit'>Send message</button>
          </form>

          <section className='contact-info'>
            <h3>Get in touch</h3>

            <div className='contact-info-item'>
              <p>Email:</p>
              <a href='mailto:admin@the-curve-.africa'>admin@the-curve-.africa</a>
            </div>

            <div className='contact-info-item'>
              <p>Phone:</p>
              <a href='tel:09069273334'>09069273334</a>
            </div>

            <div className='contact-info-item'>
              <p>Address:</p>
              <address>161/162 Muyili Street, Olodi<br />Apapa, Lagos</address>
            </div>
          </section>

          <div className='contact-content'>
            <div className='content-right'>
              <h3 className='get-touch'>Get in touch</h3>
              <div className='email-holder'>
                <div className='email-text1'>
                  <p>Email:</p>
                  <span className='spa'>admin@the-curve-.africa</span>
                </div>

                <div className='email-text2'>
                  <p>phone:</p>
                  <span className='spa'>09069273334</span>
                </div>

                <div className='email-text3'>
                  <p>Address:</p>
                  <span className='spa'>161/162 Muyili Street, Olodi <br />Apapa, Lagos</span>
                </div>
              </div>
            </div>
            <form className='content-left contact-side-form' onSubmit={handleSubmit}>
              <label className='contact-field'>
                <span>First Name</span>
                <input
                  type='text'
                  placeholder='Chibuzor'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className='contact-field'>
                <span>Email</span>
                <input
                  type='email'
                  placeholder='you@company.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className='contact-field'>
                <span>Phone Number</span>
                <input
                  type='tel'
                  placeholder='+234'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </label>

              <label className='contact-field'>
                <span>Message</span>
                <textarea
                  placeholder='Leave us a message...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </label>

              <label className='privacy-check'>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>i agree with your friendly <u>privacy policy</u></span>
              </label>

              <button type='submit' className='contact-submit'>Send message</button>
            </form>
          </div>
        </article>

        <section className='contact'>
          <article className='contact2'>
            <div className='contact3'>
              <div className='smater'>
                <nav className='smater-text'>Smarter Inventory starts <br />
with Inventra</nav>
<nav className='smater-text-container'>
  <div className='smarter-text1'>We help supermarkets manage inventory, track expiry, <br />
monitor sales , and improve daily operations through <br />
one smart and efficient platform</div>
</nav>
<button className='smarter-btn'><nav className='smarter-btn2'>Get Started</nav></button>
              </div>
              <img src={phone} alt=""  className='phone'/>
            </div>
          </article>
        </section>
      </section>
      <Footer/>
    </div>
  )
}

export default ContactUs
