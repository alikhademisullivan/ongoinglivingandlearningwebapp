
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import star from '../images/star.png';
import { MdContactMail } from 'react-icons/md';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';
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
import { Document, Page, pdfjs } from 'react-pdf';

import '../styles/review.css';

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        rating: 0,
        comment: '',
        anonymous: false,
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/reviews', formData);
            fetchReviews();
            setFormData({
                name: '',
                rating: 0,
                comment: '',
                anonymous: false,
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
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
                    <Link to="/" className="header-button admin-login" >Home</Link>
                    <Link to="/login" className="header-button user-login" >User Login</Link>
                    <Link to="/Adminlogin" className="header-button admin-login" >Caregiver Login</Link>
                    <Link to="/childlogin" className="header-button admin-login" >Attendee Login</Link>
                    <Link to="/Gallery" className="header-button admin-login" >Gallery</Link>

                </div>
            </div>
            <h1>Reviews</h1>
            <h3>Welcome to our Client Reviews page! This space is where the voices of our valued clients come to life,
                sharing their authentic experiences with OLLI. Whether you're contemplating becoming a member
                or simply curious about others' encounters, our review page is your go-to destination.
            </h3>

            <div className="review-form-container" style={{ display: showForm ? 'block' : 'none' }}>
            <div className="review-form-wrapper">
                <div className="review-form">
                    <button className="close-button" onClick={toggleForm}>X</button>
                    <h2>Add a Review</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name (Optional):
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                        </label>
                        <label>
                            Rating:
                            <select name="rating" value={formData.rating} onChange={handleInputChange}>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                        </label>
                        <label>
                            Comment:
                            <textarea name="comment" value={formData.comment} onChange={handleInputChange}></textarea>
                        </label>
                        
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
                </div>
            </div>
            <div>
                <h2>Latest Reviews  </h2><button className="add-review-button" onClick={toggleForm}>
                    Add Review
                </button>
                {reviews.map((review) => (
                    <div key={review._id} className="review-container">
                        <div className="review-header">
                            <h3>{review.name || 'Anonymous'}</h3>
                            <div className="review-rating">
                                {Array.from({ length: review.rating }).map((_, index) => (
                                    <img key={index} src={star} alt="star" className="star" />
                                ))}
                            </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                    </div>
                ))}


            </div>
        </div>
    );
};

export default ReviewPage;
