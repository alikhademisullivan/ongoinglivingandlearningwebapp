import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ParentAnnouncement.css';
import { Link } from 'react-router-dom';
import logoImage from '../images/logo.png';

const ParentAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return (
    <div className="announcement-container">
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
      <h1 className="announcement-heading">Announcements</h1>
      <ul className="announcement-list">
        {announcements.map((announcement) => (
          <li className="announcement-item" key={announcement._id}>
            <h3 className="announcement-title">{announcement.title}</h3>
            <p className="announcement-date">Date: {new Date(announcement.date).toLocaleDateString()}</p>
            <p className="announcement-description">{announcement.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParentAnnouncement;
