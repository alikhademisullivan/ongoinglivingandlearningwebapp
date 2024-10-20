

// In your React component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Eventspage.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import logoImage from '../images/logo.png';
import image1 from '../images/image6.jpg';
import image2 from '../images/image7.jpg';
import image3 from '../images/image8.jpg';
import image4 from '../images/image4.jpg';
import image5 from '../images/image5.jpg';
function ParentEventPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="events-page-container">
         <div className="profile-container">
         <div className="header">
        <div className="logo-container">
          <img src={logoImage} alt="OLLI Logo" /> {/* Replace logoImage with your logo import */}
        </div>
        <h1 className="title">
          <span className="main">OLLI</span>
          <br></br>
          <span className="sub">Ongoing Living & Learning Inc</span>
        </h1>
        <div className="buttons-container">
          <Link to="/parent-home" className="header-button user-login" >Home</Link>
          <Link to="/events" className="header-button admin-login" >Events</Link>
          <Link to="/calendar" className="header-button admin-login" >Calendar</Link>
          <Link to="/register" className="header-button admin-login" >Register</Link>
          <Link to="/profile" className="header-button admin-login" >Profile</Link>
          <Link to="/announcements" className="header-button admin-login" >Announcements</Link>

        </div>
      </div>
      </div>
      <h1>Events</h1>
      <h3>Welcome to our vibrant Events Page! Here, you'll find a curated selection of upcoming workshops, social gatherings, and special events designed to enrich your 
        experience with us.  This page is fully updated to match all the events that are upcoming for OLLI. Join us as we bring our community together to learn, 
        grow, and celebrate together. Don't miss out – explore our calendar and mark your calendar for the next exciting event!
            </h3>
  <div className="image-containerr">
  <div>
    <img src={image5} alt="Image 5" />
  </div>
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
  

  </div>


      {events.map(event => (
        <div key={event._id} className="event-card">
          <h2 className="event-title">{event.title}</h2>
          <p className="event-description">{event.description}</p>
          <p className="event-details">Date: {event.date}</p>
          <p className="event-details">Time: {event.time}</p>
          <p className="event-details">Location: {event.location}</p>
        </div>
      ))}
    </div>
  );
}

export default ParentEventPage;

