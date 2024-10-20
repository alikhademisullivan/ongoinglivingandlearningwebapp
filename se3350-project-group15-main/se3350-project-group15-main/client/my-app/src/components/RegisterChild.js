import React, { useState } from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './profile'; 
import ParentHome from './parentHome';
import logoImage from '../images/logo.png';
import loginimage from '../images/loginc.jpg';

const RegisterChild = ({ userInfo }) => {
  const [childName, setChildName] = useState('');
  const [childDisability, setChildDisability] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [parentPresent, setParentPresent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/childEventRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childName,
          childDisability,
          eventName,
          eventDate,
          parentPresent,
        }),
      });

      if (response.ok) {
        alert('Registration successful');
      } else {
        alert('Registration unsuccessful');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <div className='container'>
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
      </div><div className="image-container">
        <img src={loginimage} alt="Image 1" />
      </div>

      <div className="login-container">
        <h1>
          <strong>Hello</strong>  {userInfo.firstName } { userInfo.lastName}
        </h1>      
        <h2>Register Attendee</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="childName">Attendee Name:</label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="childDisability">Child Disability:</label>
            <input
              type="text"
              id="childDisability"
              value={childDisability}
              onChange={(e) => setChildDisability(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="eventDate">Event Date:</label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label>
              Will Caregiver be Present?
              <input
                type="checkbox"
                checked={parentPresent}
                onChange={() => setParentPresent(!parentPresent)}
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterChild;
