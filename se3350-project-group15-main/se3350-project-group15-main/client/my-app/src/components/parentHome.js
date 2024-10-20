import React from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './profile';
import RegisterChild from './RegisterChild';
import MyCalendar from './ParentCalender';
import logoImage from '../images/logo.png';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';
import image4 from '../images/image4.jpg';
import image5 from '../images/image5.jpg';

const ParentHome = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5200,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
      className={`${className} custom-arrow`} // Add your custom class here
      style={{ ...style, display: "block", color: "#647249" }} // Set color style directly if not using :before pseudo-element
      onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
      className={`${className} custom-arrow`} // Add your custom class here
      style={{ ...style, display: "block", color: "#647249" }} // Set color style directly if not using :before pseudo-element
      onClick={onClick}
      />
    );
  }
  return (
    <div className="parent-home-container container"> {/* Added container class */}
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
      <Slider {...settings}>
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
        <div>
          <img src={image5} alt="Image 5" />
        </div>
      </Slider>
      <p className="paragraph-style">Welcome to the forthcoming digital home of Ongoing Living & Learning Inc.! As we eagerly prepare to unveil our website, we envision it as a dedicated space for parents of adults with disabilities, providing a comprehensive platform that goes beyond mere accessibility. Our goal is to create an inclusive online hub, a dynamic ecosystem where you can effortlessly navigate through an array of essential information, discover valuable resources, and access tailored services.

At Ongoing Living & Learning Inc., we understand the unique challenges and joys that come with parenting adult children with disabilities. Hence, our website is meticulously designed to be a beacon of support and empowerment for you. Whether you are seeking crucial information, exploring resources to enhance your child's well-being, or accessing personalized services that cater to your specific needs, our user-friendly interface aims to simplify the journey.

Stay tuned for an enriching experience that transcends traditional online platforms. Ongoing Living & Learning Inc. is more than just a website; it's a community, a virtual space where your concerns, questions, and aspirations find resonance. Join us as we embark on this journey together, empowering parents to navigate the complexities of supporting their adult children with disabilities. Your well-being is at the heart of what we do, and we can't wait to share this empowering resource with you.





</p>
<p></p>
      <div className="route-content">
        <Route path="/profile" component={Profile} />
        <Route path="/register" component={RegisterChild} />
        <Route path="/calendar" component={MyCalendar} />

      </div>
    </div>
  );
};

export default ParentHome;

