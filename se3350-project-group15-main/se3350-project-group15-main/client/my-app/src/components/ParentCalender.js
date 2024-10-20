import React, { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './profile';
import RegisterChild from './RegisterChild';
import 'react-calendar/dist/Calendar.css';
import logoImage from '../images/logo.png';


import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      fetch('/api/events')
        .then(response => response.json())
        .then(data => {
          const formattedEvents = data.map(event => ({
            title: event.title,
            start: new Date(event.date + 'T' + event.time),
            extendedProps: {
              description: event.description,
              location: event.location,
              attendees: event.attendees,
              interestedInComing: event.interestedInComing,
            },
          }));
          setEvents(formattedEvents);
        });
    }, []);
  
    const handleEventClick = (clickInfo) => {
      const attendees = clickInfo.event.extendedProps.attendees || [];
      const interestedInComing = clickInfo.event.extendedProps.interestedInComing || [];
    
      alert(`
        Title: ${clickInfo.event.title}
        Description: ${clickInfo.event.extendedProps.description}
        Location: ${clickInfo.event.extendedProps.location}
        Attendees: ${attendees.join(', ')}
        Interested: ${interestedInComing.join(', ')}
      `);
    };
  
    const fetchEvents = () => {
      fetch('/api/events')
        .then(response => response.json())
        .then(data => {
          const formattedEvents = data.map(event => ({
            title: event.title,
            start: new Date(event.date + 'T' + event.time),
            extendedProps: {
              description: event.description,
              location: event.location,
              attendees: event.attendees,
              interestedInComing: event.interestedInComing,
            },
          }));
          setEvents(formattedEvents);
        });
    };
  
    useEffect(fetchEvents, []);
    
  
    return (
      <div id='calendar-container'>
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
      <br />    



      <button onClick={fetchEvents}>Refresh</button>
  
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
        />

        <div className="route-content">
        <Route path="/profile" component={Profile} />
        <Route path="/register" component={RegisterChild} />

      </div>
      </div>

    );
  };

  export default MyCalendar;