import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const AddChild = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    allergies: '',
    age: '',
    address: '',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const shuffledImages = [...imageList].sort(() => 0.5 - Math.random());
  }, []);

  const handleImageSelect = (imageId) => {
    if (!selectedImages.includes(imageId) && selectedImages.length < 8) {
      const image = imageList.find(img => img.id === imageId);
      if (image && image.sound) {
        playSound(image.sound); 
      }
      setSelectedImages([...selectedImages, imageId]);
    }
  };
  

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };
  

  const handleDeleteLastImage = () => {
    setSelectedImages(selectedImages.slice(0, -1));
  };

  const handleClearImages = () => {
    setSelectedImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    if (!formData.name || !formData.parentName || !formData.age || !formData.address) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
  

    if (selectedImages.length < 4) {
      setErrorMessage('Please select at least 4 images for the pattern.');
      return;
    }
  
    setLoading(true);
    try {
      await axios.post('/api/children', {
        ...formData,
        picturePasscode: selectedImages,
      });
      history.push('/AdminControls'); 
    } catch (error) {
      console.error('Error adding child:', error);
      setErrorMessage("Failed to add child.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="login-container">
      <h1 className='title'>Add Attendee</h1>
      
      <form onSubmit={handleSubmit}>
  <div className="form-field">
    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Attendee Name" required />
  </div>
  <div className="form-field">
    <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} placeholder="Caregiver Name" required />
  </div>
  <div className="form-field">
    <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="Allergies" />
  </div>
  <div className="form-field">
    <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" required />
  </div>
  <div className="form-field">
    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" required />
  </div>
</form>
      
      <div className="calculator-container">
 <div className="selected-images-display">
  {selectedImages.length > 0 ? (
    selectedImages.map((imageId, index) => {
      const image = imageList.find(img => img.id === imageId);
      return <img key={index} src={image.src} alt={`Selected ${index + 1}`} className="selected-image" />;
    })
  ) : (
    <span className="placeholder-text">Insert your image pattern</span>
  )}
      <button type='button' onClick={handleDeleteLastImage} className="action-button delete-button">&#x2190;</button>
    <button type='button' onClick={handleClearImages} className="action-button">Clear</button>
</div>
          <div className="image-grid">
            {imageList.map((img, index) => (
              <button key={index} onClick={() => handleImageSelect(img.id)} disabled={loading || selectedImages.includes(img.id)} className="image-button">
                <img src={img.src} alt={`Select ${index + 1}`} className="login-image" />
              </button>
            ))}
          </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <button type="submit" className="action-buttons" disabled={loading}>Submit</button>
      </form>
      
      {errorMessage && <p className="login-message error">{errorMessage}</p>}
    </div>
  );
};

export default AddChild;
