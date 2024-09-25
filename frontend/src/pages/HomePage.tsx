import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONSTANT, formatDate, sortedMessages } from '../lib';
import { Message, User } from '../types';

function HomePage({ authUser }: { authUser: User }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageImage, setMessageImage] = useState<File | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]); // For storing recent messages

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
      <nav>
        <h1>Welcome to the forum!</h1>
        {authUser && (
          <div>
            <Link to={`/admin`}>
              <h2>Admin</h2>
            </Link>
          </div>
        )}
      </nav>

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

          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>

      {/* Recent Messages Display Area */}
      <div>
        <h2>Recent Messages</h2>
        {recentMessages.map((msg) => (
          <article key={msg.id} className="message">
            <div className="flex-container">
              {' '}
              {msg.image_url && (
                <img src={msg.image_url} alt="Message" width="120" />
              )}
            </div>
            <div>
              <p>
                <strong>Subject:</strong> {msg.subject}
              </p>
              <p>
                <strong>Message:</strong> {msg.content}
              </p>
              <p>
                <strong>Posted at:</strong> {formatDate(msg.posted_date)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
