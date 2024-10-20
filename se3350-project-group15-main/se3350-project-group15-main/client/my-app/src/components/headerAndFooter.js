import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdContactMail, MdVolumeUp, MdVolumeOff, MdChatBubble } from 'react-icons/md';    
import '../styles/mainPage.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactGA from 'react-ga';
import logoImage from '../images/logo.png';
import '../styles/mainPage.css';


const InteractiveIcons = ({ hideButton }) => {
    const [showForm, setShowForm] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [messageStatus, setMessageStatus] = useState(null);
    const [isTtsEnabled, setIsTtsEnabled] = useState(false);
    const [chatbotVisible, setChatbotVisible] = useState(false);
    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
      }, []);

      const speak = (text) => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Cancel any ongoing speech
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        } else {
          alert("Sorry, your browser does not support text to speech!");
        }
      };
    
      const speakSelectedText = () => {
        if (!isTtsEnabled) return; // Don't speak if TTS is disabled
    
        const text = window.getSelection().toString().trim();
        if (text) {
          speak(text);
        }
      };

      const handleButtonClick = () => {
        speak("Hello, welcome to our website!");
      };
    
      useEffect(() => {
        if (isTtsEnabled) {
          document.addEventListener('selectionchange', speakSelectedText);
        } else {
          document.removeEventListener('selectionchange', speakSelectedText);
        }
    
        // Cleanup function to remove the event listener
        return () => {
          document.removeEventListener('selectionchange', speakSelectedText);
        };
      }, [isTtsEnabled]); // Re-run this effect when isTtsEnabled changes

      const handleSubmit = (event) => {
        event.preventDefault();
        setSendingEmail(true);
    
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
    
        const payload = {
          name,
          senderEmail: email,
          message,
        };
    
        axios.post('/send-contact-email', payload)
          .then((response) => {
            setMessageStatus({ success: true, text: 'Thank you for reaching out! Our team will read your message as soon as possible and send the reply to the email inserted in the form.' });
            setShowForm(false);
          })
          .catch((error) => {
            setMessageStatus({ success: false, text: 'Failed to send email. Please try again later.' });
          })
          .finally(() => {
            setSendingEmail(false);
          });
    
        event.target.reset();
      };

      const toggleChatbot = () => setChatbotVisible(!chatbotVisible);

      const ChatbotModal = ({ visible, onClose, children }) => {
        if (!visible) return null;
      
        return (
          <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              {children}
            </div>
          </div>
        );
      };
    

      return (
        <div className="scontainer">
          <div className="header">
            <div className="logo-container">
              <img src={logoImage} alt="OLLI Logo" /> 
            </div>
            <h1 className="title">
              <span className="main">OLLI</span>
              <br></br>
              <span className="sub">Ongoing Living & Learning Inc</span>
            </h1>
            <div className="buttons-container">

            {!hideButton || hideButton !== "home" ? (
                <Link to="/" className="header-button" onMouseEnter={() => isTtsEnabled && speak("Home")}>
                    Home
                </Link>
            ) : null}

{!hideButton || hideButton !== "userLogin" ? (
                <Link to="/login" className="header-button" onMouseEnter={() => isTtsEnabled && speak("User Login")}>
                    User Login
                </Link>
            ) : null}

            {!hideButton || hideButton !== "childLogin" ? (
                <Link to="/childlogin" className="header-button" onMouseEnter={() => isTtsEnabled && speak("Child Login")}>
                    Attendee Login
                </Link>
            ) : null}

            {!hideButton || hideButton !== "adminLogin" ? (
                <Link to="/adminlogin" className="header-button" onMouseEnter={() => isTtsEnabled && speak("Admin Login")}>
                    Caregiver Login
                </Link>
            ) : null}

            {!hideButton || hideButton !== "gallery" ? (
                <Link to="/gallery" className="header-button" onMouseEnter={() => isTtsEnabled && speak("Gallery")}>
                    Gallery
                </Link>
            ) : null}

            {!hideButton || hideButton !== "reviews" ? (
                <Link to="/reviews" className="header-button" onMouseEnter={() => isTtsEnabled && speak("Reviews")}>
                    Reviews
                </Link>
            ) : null}
        </div>
          </div>
          <MdContactMail className="contact-icon" onClick={() => setShowForm(!showForm)} />
          <MdChatBubble className="chatbot-icon" onClick={() => setChatbotVisible(!chatbotVisible)} />
    <div className={`chat-container ${chatbotVisible ? 'show' : ''}`} style={{ width: '300px', height: 'auto' }}>
      {chatbotVisible && (
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/i2gv-1fD5bFQZDaMEu-dv"
          title="Chatbot"
          style={{ width: '100%', height: '500px' }} 
          frameBorder="0"
        />
      )}
    </div>
          <MdVolumeUp className={`tts-icon ${isTtsEnabled ? '' : 'hidden'}`} onClick={() => setIsTtsEnabled(!isTtsEnabled)} />
          <MdVolumeOff className={`tts-icon ${isTtsEnabled ? 'hidden' : ''}`} onClick={() => setIsTtsEnabled(!isTtsEnabled)} />
          <div className={`form-container ${showForm ? 'show' : ''}`}>
            {showForm && (
              <form onSubmit={handleSubmit}>
                <div className="input-field">
                  <label htmlFor="name">Name:</label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div className="input-field">
                  <label htmlFor="email">Email:</label>
                  <input id="email" name="email" type="email" required />
                </div>
                <div className="input-field">
                  <label htmlFor="message">Message:</label>
                  <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit" disabled={sendingEmail}>Send Message</button>
              </form>
            )}
            {messageStatus && (
              <p className={`message-status ${messageStatus.success ? 'success' : 'error'}`}>
                {messageStatus.text}
              </p>
            )}
          </div>
        </div>
    
      );
    
    };
    

export default InteractiveIcons;
