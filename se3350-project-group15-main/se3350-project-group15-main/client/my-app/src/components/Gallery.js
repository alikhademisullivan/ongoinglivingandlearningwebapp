import React, { useState, useEffect } from 'react';
import '../Gallery.css';
import logoImage from '../images/logo.png'
import { Link } from 'react-router-dom';
import InteractiveIcons from './headerAndFooter';



const Gallery = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/images')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setImages(data);
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                setError(error.toString());
            });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((currentIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(timer); // Clean up on component unmount
    }, [currentIndex, images.length]);

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    };

    return (
        <div>


            <InteractiveIcons hideButton="gallery" />

            <h1>Our Public Gallery: </h1>
            <h2>Please enjoy our public gallery for all users to enjoy and see what we offer!</h2>
            <div className="Gallery">
                {error && <div>Error: {error}</div>}
                {images.length > 0 && (
                    <div>
                        <img src={`/api/images/${images[currentIndex].filename}`} alt="" />
                        <div id='clockinclockout'>
                            <button onClick={handlePrevious}>Previous</button>
                            <button onClick={handleNext}>Next</button>
                        </div>

                    </div>
                )}
            </div>
        </div>

    );
}

export default Gallery;