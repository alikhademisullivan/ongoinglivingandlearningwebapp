import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../styles/adminlogin.css';
import loginimage from '../images/loginc.jpg';
import logoImage from '../images/logo.png'
import InteractiveIcons from './headerAndFooter';

const Adminlogin = ({ onLogin }) => {
    const [loginForm, setLoginForm] = useState(true);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/stafflogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.isAdmin); // Pass isAdmin status to handleLogin function

                console.log("ISADMIN: " + data.isAdmin);
                history.push('/AdminControls');
            } else {
                alert('Invalid login credentials');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };


    return (
        <div id='admin'>
        
        <InteractiveIcons hideButton="adminLogin"/>

            <div className="containeradmin">
                <div className="image-containeradmin">
                    <img src={loginimage} alt="Image 1" />
                </div>
                <div id='adminformdiv'>
                <form id='adminform'>
                <h2>Login</h2>

                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="button" onClick={handleLogin}>
                        Login
                    </button>
                </form>
                </div>

                
            </div>

        </div>
    );
};

export default Adminlogin;
