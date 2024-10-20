import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../styles/childlogin.css';
import image1 from '../images/login1.png';
import image2 from '../images/login2.png';
import image3 from '../images/login3.png';
import image4 from '../images/login4.png';
import image5 from '../images/login5.png';
import image6 from '../images/login6.png';
import image7 from '../images/login7.png';
import image8 from '../images/login8.png';
import sound1 from '../sounds/sound1.mp3';
import sound2 from '../sounds/sound2.mp3';
import sound3 from '../sounds/sound3.mp3';
import sound4 from '../sounds/sound4.mp3';
import sound5 from '../sounds/sound5.mp3';
import sound6 from '../sounds/sound6.mp3';
import sound7 from '../sounds/sound7.mp3';
import sound8 from '../sounds/sound8.mp3';
import loginimage from '../images/loginc.jpg';
import logoImage from '../images/logo.png';
import '../styles/login.css';
import InteractiveIcons from './headerAndFooter';

const imageList = [
    { id: 'image1', src: image1, sound: sound1},
    { id: 'image2', src: image2, sound: sound2 },
    { id: 'image3', src: image3, sound: sound3 },
    { id: 'image4', src: image4, sound: sound4 },
    { id: 'image5', src: image5, sound: sound5 },
    { id: 'image6', src: image6, sound: sound6 },
    { id: 'image7', src: image7, sound: sound7 },
    { id: 'image8', src: image8, sound: sound8 },
  ];
  

const Childlogin = () => {
    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [loginImages, setLoginImages] = useState([]); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();


    useEffect(() => {
        const fetchNames = async () => {
          try {
            const response = await axios.get('/api/childrenCollection');
            setNames(response.data);
          } catch (error) {
            console.error('Error fetching names:', error);
          }
        };    
        fetchNames();

        const shuffledImages = [...imageList].sort(() => Math.random() - 0.5);
        setLoginImages(shuffledImages);
      }, []);



      const handleImageSelect = (imageId) => {
        if (selectedImages.length < 8) {
          const image = imageList.find(img => img.id === imageId);
          if (image && image.sound) {
            playSound(image.sound);
          }
          setSelectedImages((prevSelectedImages) => [...prevSelectedImages, imageId]);
        }
      };

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };
  
  
      
  const handleSubmitLogin = async () => {
    setLoading(true);
  
    try {
      const response = await axios.post('/api/childLogin', {
        name: selectedName,
        pictureSequence: selectedImages,
      });
  
      if (response.data === 'User authenticated successfully') {
        setIsAuthenticated(true);
        history.push('/ChildHome'); 
      } else {
        setErrorMessage("Login failed, try again."); 
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("Login failed, try again."); 
    } finally {
      setLoading(false);
    }
  };
  
  

      const handleDeleteLastImage = () => {
        setSelectedImages(selectedImages.slice(0, -1));
      };

      const handleNameChange = (e) => {
        const name = e.target.value;
        setSelectedName(name);
        setErrorMessage(""); 
      };
      
      


      return (
        <div className="container">
          <div className="childlogin-image-container">
            {/* Use the same image import as the LoginPage */}
            <img className="childlogin-image" src={loginimage} alt="Login Visual" />
          </div>
      
          <div className="childlogin-container">
            <p className='dropdowntext'>Name:</p>
            <div className="name-select">
              <select value={selectedName} onChange={handleNameChange}>
                <option value="">Select an Attendee</option>
                {names.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className={`calculator-container ${selectedName ? 'visible' : 'hidden'}`}>
              <div className="selected-images-display">
                {selectedImages.length > 0 ? (
                  selectedImages.map((imageId, index) => {
                    const image = imageList.find(img => img.id === imageId);
                    return <img key={index} src={image.src} alt={`Selected ${index + 1}`} className="selected-image" />;
                  })
                ) : (
                  <span className="placeholder-text">Insert your image pattern</span>
                )}
                <button onClick={handleDeleteLastImage} className="action-button delete-button">&#x2190;</button>
                <button onClick={() => setSelectedImages([])} className="action-button">Clear</button>
              </div>
              <div className="image-grid">
                {loginImages.map((img, index) => (
                  <button key={index} onClick={() => handleImageSelect(img.id)}
                          disabled={loading || selectedImages.includes(img.id)}
                          className={`image-button ${selectedImages.includes(img.id) ? 'selected' : ''}`}>
                    <img src={img.src} alt={`login option ${index + 1}`} className="login-image" />
                  </button>
                ))}
              </div>
              <div className="action-buttons">
                <button onClick={handleSubmitLogin} disabled={loading || selectedImages.length < 4 || selectedImages.length > 8} className="submit-button">Login</button>
              </div>
            </div>
            {errorMessage && (
              <p className="login-message error">
                {errorMessage}
              </p>
            )}
          </div>
          <InteractiveIcons hideButton="childLogin"/>
        </div>
      );      
      
};

export default Childlogin;
