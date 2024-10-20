import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdContactMail, MdVolumeUp, MdVolumeOff, MdChatBubble } from 'react-icons/md';    
import '../styles/mainPage.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logoImage from '../images/logo.png';
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';
import image4 from '../images/image4.jpg';
import image5 from '../images/image5.jpg';
//import { Document, Page, pdfjs } from 'react-pdf';
//import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Document, Page,pdfjs } from 'react-pdf';


//import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
//pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import ReactGA from 'react-ga';


const MainPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [messageStatus, setMessageStatus] = useState(null);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const [hoursOfOperation, setHoursOfOperation] = useState({
    monday: '8:00 AM - 4:00 PM  ',
    tuesday: ' 8:00 AM - 4:00 PM ',
    wednesday: ' 8:00 AM - 4:00 PM ',
    thursday: ' 8:00 AM - 4:00 PM ',
    friday: ' 8:00 AM - 4:00 PM ',
    saturday: ' 8:00 AM - 4:00 PM ',
    sunday: ' 8:00 AM - 4:00 PM',
    // Add hours for other days as needed
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 5200,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow`}
        style={{ ...style, display: "block", color: "#647249" }}
        onClick={onClick}
      />
    );
  }

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


  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow`}
        style={{ ...style, display: "block", color: "#647249" }}
        onClick={onClick}
      />
    );
  }

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
    <div className="container">

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
          <Link to="/login" className="header-button user-login" onMouseEnter={() => isTtsEnabled && speak("User Login")}>Caregiver Login</Link>
          <Link to="/Adminlogin" className="header-button admin-login" onMouseEnter={() => isTtsEnabled && speak("Admin Login")}>Admin Login</Link>
          <Link to="/childlogin" className="header-button admin-login" onMouseEnter={() => isTtsEnabled && speak("Child Login")}>Attendee Login</Link>
          <Link to="/Gallery" className="header-button admin-login" onMouseEnter={() => isTtsEnabled && speak("Gallery")}>Gallery</Link>
          <Link to="/newsletter" className="header-button admin-login" onMouseEnter={() => isTtsEnabled && speak("newsletter")}>Newsletter</Link>

          <Link to="/Reviews" className="header-button admin-login" onMouseEnter={() => isTtsEnabled && speak("Reviews")}>Reviews</Link>

        </div>
      </div>


      <Slider {...settings}>
        <div>
          <img src={image1} alt="Image 1" />
        </div>
        <div>
          <img src={image2} alt="Image 2" />
        </div>
        <div>
          <img src={image3} alt="Image 3" />
        </div>
        <div>
          <img src={image4} alt="Image 4" />
        </div>
        <div>
          <img src={image5} alt="Image 5" />
        </div>
      </Slider>
      <br></br><br></br>
      <h2>Mission</h2>
      <p className="paragraph-style">
      Ongoing Living & Learning Inc. is dedicated to empowering adults with disabilities, offering comprehensive support and services to enhance their independence and societal participation. Our mission is to build a connected and informed community where individuals with disabilities, along with their caregivers and the public, have unhindered access to necessary resources and support. We are committed to ensuring inclusivity and accessibility, facilitating a supportive environment where every individual's needs are acknowledged and addressed.
      </p>
      <h2>Vision</h2>
      <p className="paragraph-style">
      Our vision is a world where adults with disabilities can achieve their full potential and enjoy equal opportunities for active participation in an inclusive society. We aim to foster a community where every person, irrespective of their abilities, has access to comprehensive support services. Through our efforts, we envision creating a society that upholds dignity, respect, and fulfillment for all, ensuring that individuals with disabilities lead enriching and self-directed lives.
      </p>
      <h2>Values</h2>
      <p className="paragraph-style">
      Ongoing Living & Learning Inc. operates on core values that include empowerment, inclusivity, accessibility, compassion, and collaboration. We empower our clients by providing them with the necessary tools and resources to lead self-directed lives. Inclusivity is at the heart of our operations, as we strive to create an environment where everyone is valued and included. Accessibility is a priority, ensuring that our services and information are easily reachable for everyone. Our approach is rooted in compassion, as we understand and cater to the unique needs of each individual we serve. Collaboration is key to our success, as we work in partnership with families, caregivers, and the community to enhance the support for our clients.      </p>
      <p>
       
        <div className="hours-of-operation">
          <h3>Hours of Operation</h3>
          <ul>
            <li>Monday: {hoursOfOperation.monday}</li>
            <li>Tuesday: {hoursOfOperation.tuesday}</li>
            <li>wednesday: {hoursOfOperation.wednesday}</li>
            <li>thursday: {hoursOfOperation.thursday}</li>
            <li>friday: {hoursOfOperation.tuesday}</li>
            <li>saturday: {hoursOfOperation.tuesday}</li>
            <li>sunday: {hoursOfOperation.tuesday}</li>

          </ul>
        </div>
        <a href="https://www.facebook.com/cheer.2023?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">Recreation and Leisure Program</a>
      </p>
      <p>
        <a href="https://www.facebook.com/cheer.2023?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">Family Support Group</a>
      </p>
      <p>
        <a href="https://www.facebook.com/people/Roxys-Mini-Golf-and-Cheer-Canteen/100057044577232/?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">Assisted Employment Program</a>
      </p>
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




export default MainPage;


function NewsletterPreview() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [newsletter, setNewsletter] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

  const years = Array.from({length: 20}, (_, i) => Number(year) + i);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetch(`/api/newsletters?year=${year}&month=${month}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
        console.log('Received data:', data);

        if (data && data.length > 0) {
          setNewsletter(data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching newsletters:', error);
      });
  }, [year, month]);
  useEffect(() => {
    // Initialize PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    console.log(`Loaded PDF with ${numPages} pages`);

    setNumPages(numPages);
  }

  if (!newsletter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Newsletters for {month} {year}</h1>
      <Document
  file={`/api/newsletters/${newsletter.filename}`}
  onLoadSuccess={onDocumentLoadSuccess} options={{ worker: new pdfjs.PDFWorker() }}
  >
        <Page pageNumber={pageNumber} width={1000} length={1000} />
</Document>
      <p>Page {pageNumber} of {numPages}</p>
      <button
        type="button"
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}>
        Previous
      </button>
      <button
        type="button"
        disabled={pageNumber >= numPages}
        onClick={() => setPageNumber(pageNumber + 1)}>
        Next
      </button>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );
}


function NewsletterSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        setMessage('Thank you for signing up!');
      } else {
        setMessage('Failed to sign up. Please try again later.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Sign Up for Our Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}