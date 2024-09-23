import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CONSTANT } from '../constant';

const formatDate = (postedDate: { _seconds: number; _nanoseconds: number }) => {
  const date = new Date(
    postedDate._seconds * 1000 + postedDate._nanoseconds / 1000000
  );
  return date.toLocaleString(); // Formats the date and time based on locale
};

const sortedMessages = (messages: any) =>
  [...messages].sort((a, b) => {
    const dateA =
      a.posted_date._seconds * 1000 + a.posted_date._nanoseconds / 1000000;
    const dateB =
      b.posted_date._seconds * 1000 + b.posted_date._nanoseconds / 1000000;
    return dateB - dateA;
  });

function HomePage({
  authUser,
  setAuthUser,
}: {
  authUser: any;
  setAuthUser: (user: any) => void;
}) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageImage, setMessageImage] = useState<File | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]); // For storing recent messages

  const handleSubmitMessage = async () => {
    if (!subject || !message) {
      alert('Subject and Message Text are required.');
      return;
    }

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('content', message);
    formData.append('user_id', authUser.user_id); // Assuming authUser has an ID field
    if (messageImage) {
      formData.append('image', messageImage);
    }
    // debugger;
    // return;

    try {
      const response = await fetch(`${CONSTANT.baseUrl_local}/messages`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newMessage = await response.json();
        setRecentMessages([newMessage, ...recentMessages].slice(0, 10)); // Update recent messages
        setSubject('');
        setMessage('');
        setMessageImage(null);
      } else {
        console.error('Failed to post message');
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await fetch(
          `${CONSTANT.baseUrl_local}/messages/user/${authUser.user_id}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecentMessages(sortedMessages(data)); // Assuming API returns recent messages
        }
      } catch (error) {
        console.error('Error fetching recent messages:', error);
      }
    };
    fetchRecentMessages();
  }, []);

  return (
    <div className="content-container">
      <h1>Welcome to the forum!</h1>
      {authUser && (
        <div>
          <Link to={`/admin`}>
            <h2>Admin</h2>
          </Link>
        </div>
      )}

      {/* Message Posting Area */}
      <div>
        <h2>Post a Message</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitMessage();
          }}
        >
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter your subject"
            required
          />

          <label htmlFor="message">Message Text:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            required
          />

          <label htmlFor="messageImage">Upload Image:</label>
          <input
            type="file"
            id="messageImage"
            onChange={(e) => setMessageImage(e.target.files?.[0] || null)}
          />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Recent Messages Display Area */}
      <div>
        <h2>Recent Messages</h2>
        {recentMessages.map((msg) => (
          <div key={msg.id} className="message">
            <p>
              <strong>Subject:</strong> {msg.subject}
            </p>
            <p>
              <strong>Message:</strong> {msg.content}
            </p>
            <p>
              <strong>Posted at:</strong> {formatDate(msg.posted_date)}
            </p>
            {msg.image_url && (
              <img src={msg.image_url} alt="Message" width="120" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
