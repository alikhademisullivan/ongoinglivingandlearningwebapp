import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chat from './Chat'; // Import the Chat component
import '../styles/profile.css';
import logoImage from '../images/logo.png';
import image9 from '../images/image9.png';

const Profile = ({ userInfo }) => {
  const [parents, setParents] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null); 
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch('/api/parents');
        const data = await response.json();
        setParents(data);
      } catch (error) {
        console.error('Error fetching parent information:', error);
      }
    };

    const fetchReceivedRequests = async () => {
      try {
        const response = await fetch(`/api/parents/received-friend-requests/${userInfo.lastName}`);
        const data = await response.json();
        setReceivedRequests(data);
      } catch (error) {
        console.error('Error fetching received friend requests:', error);
      }
    };

    // Fetch friends on component mount
    const fetchFriends = async () => {
      try {
        const response = await fetch(`/api/parents/friends/${userInfo.lastName}`);
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

    fetchParents();
    fetchReceivedRequests();
    fetchFriends();
  }, [userInfo.lastName]);

  const sendFriendRequest = async (otherParentLastName) => {
    try {
      const response = await fetch(`/api/parents/send-friend-request/${otherParentLastName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestingParentLastName: userInfo.lastName }),
      });

      const data = await response.json();
      console.log(data.message);
      setSentRequests([...sentRequests, otherParentLastName]);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (requestingParentLastName) => {
    try {
      const response = await fetch(`/api/parents/accept-friend-request/${userInfo.lastName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptingParentLastName: requestingParentLastName }),
      });

      const data = await response.json();
      console.log(data.message);
      // Fetch updated friends list
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestingParentLastName) => {
    try {
      const response = await fetch(`/api/parents/reject-friend-request/${userInfo.lastName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectingParentLastName: requestingParentLastName }),
      });

      const data = await response.json();
      console.log(data.message);
      // Fetch updated received requests list
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const startChat = (friend) => {
    setSelectedFriend(friend);
    console.log(selectedFriend);
    console.log(userInfo.lastName)
  };

  return (
    <div className="profile-container">
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

      <div className="profile-content">
        {userInfo ? (
          <div className="profile-details">
          <div className="info-container">
            <h2>
              <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
            </h2>
            <h2>
              <strong>Phone Number:</strong> {userInfo.phoneNumber}
            </h2>
            <h2>
              <strong>Email:</strong> {userInfo.email}
            </h2>
          </div>
          <div>
            <img src={image9} alt="Image 1" />
          </div>
        </div>
        
        ) : (
          <p>Please log in to view your profile.</p>
        )}

        <div className="components-container">
          {/* Other Parents */}
          <div className="other-parents">
            <h3>Parents</h3>
            <ul className="parents-list">
              {parents.map((parent) => (
                <li key={parent._id}>
                  {parent.firstName} {parent.lastName}
                  {!sentRequests.includes(parent.lastName) && (
                    <button onClick={() => sendFriendRequest(parent.lastName)}>
                      Send Friend Request
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Received Friend Requests */}
          <div className="received-requests">
            <h3>Friend Requests</h3>
            <ul className="requests-list">
              {Array.isArray(receivedRequests) &&
                receivedRequests.map((request) => (
                  <li key={request._id}>
                    {request.firstName} {request.lastName}
                    <button onClick={() => acceptFriendRequest(request.lastName)}>Accept</button>
                    <button onClick={() => rejectFriendRequest(request.lastName)}>Reject</button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Friends List */}
          <div className="friends-list">
            <h3>My Friends</h3>
            <ul className="friends-list">
              {Array.isArray(friends) &&
                friends.map((friend) => (
                  <li key={friend._id}>
                    {friend.firstName} {friend.lastName}
                    {/* Add button to send messages to this friend */}
                    <button onClick={() => startChat(friend.lastName)}>Send Message</button>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {selectedFriend && <Chat friend={selectedFriend} currentUserId={userInfo.lastName} />}
      </div>
    </div>
  );
};

export default Profile;
