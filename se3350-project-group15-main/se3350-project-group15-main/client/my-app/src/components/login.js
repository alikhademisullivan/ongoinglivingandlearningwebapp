import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../images/logo.png';
import '../styles/login.css';
import loginimage from '../images/loginc.jpg';

const LoginPage = ({ onLogin, setIsLoggedIn, setUserInfo }) => {
  const [loginForm, setLoginForm] = useState(true);
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistered, setisRegistered] = useState('');

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastName,
          phoneNumber,
        }),
      });

      if (response.ok) {
        const userFromServer = await response.json();
        setIsLoggedIn(true);
        setUserInfo(userFromServer);
        console.log(userFromServer);
        alert('Login successful');
      } else {
        console.error('Login failed');
        alert('Invalid login credentials or account not currently registered, Contact Admin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRegister = async () => {
    setisRegistered(false);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          isRegistered,
        }),
      });

      if (response.ok) {
        alert('Registration successful please wait for admin to accept website registration');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleForm = () => {
    setLoginForm(!loginForm);
  };

  return (
    <div className="containerr">

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
          <Link to="/" className="header-button user-login" >Home</Link>
          <Link to="/Adminlogin" className="header-button admin-login" >Admin Login</Link>
          <Link to="/childlogin" className="header-button admin-login" >Attendee Login</Link>
          <Link to="/Gallery" className="header-button admin-login" >Gallery</Link>
          <Link to="/Reviews" className="header-button admin-login" >Reviews</Link>

        </div>
      </div>



      <div className="image-container">
        <img src={loginimage} alt="Image 1" />
      </div>

        <div className="login-container">
          <form>
            {loginForm ? (
              <>
                <div className="input-field">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <button className="button" type="button" onClick={handleLogin}>
                  Login
                </button>
                <p>
                  Don't have an account?{' '}
                  <span className="link" onClick={toggleForm}>
                    Register
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="input-field">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <button className="button" type="button" onClick={handleRegister}>
                  Register
                </button>
                <p>
                  Already have an account?{' '}
                  <span className="link" onClick={toggleForm}>
                    Login
                  </span>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
