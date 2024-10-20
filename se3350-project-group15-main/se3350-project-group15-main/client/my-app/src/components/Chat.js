// src/components/Chat.js

import React, { useState, useEffect } from 'react';
import '../styles/chat.css';

const Chat = ({ friend, currentUserId }) => {
  console.log('chat triggered')
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: friend, // Use last name for receiver
          content: messageInput,
        }),
      });

      const data = await response.json();
      console.log(data.message);

      // Refresh messages after sending
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${currentUserId}/${friend}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Fetch initial messages when component mounts
    fetchMessages();
  }, [friend, currentUserId]);

  return (
    <div className="chat-containerr">
      <h2>Chat with {friend.firstName} {friend}</h2>
      <div className="chat-messagess">
        {messages.map((message) => (
          <div key={message._id} className={message.sender === currentUserId ? 'sentt' : 'receivedd'}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-inputt">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
