import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { USER } from '../types';
import { CONSTANT } from '../constant';

interface AdminPageProps {
  authUser: USER | null;
  setAuthUser: (user: USER | null) => void;
}

function AdminPage({ authUser, setAuthUser }: AdminPageProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [updatedSubject, setUpdatedSubject] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user’s messages from Firestore
    if (authUser) {
      fetch(`${CONSTANT.baseUrl_local}/messages/user/${authUser.user_id}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [authUser]);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordError('Old and new password are required.');
      return;
    }
    try {
      const response = await fetch(
        `${CONSTANT.baseUrl_local}/users/${authUser?.user_id}/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAuthUser(null);
        navigate('/login'); // Redirect to login page on successful password change
      } else {
        // setPasswordError(result.message || 'The old password is incorrect.');
        setPasswordError('The old password is incorrect.');
      }
    } catch (error) {
      setPasswordError('The old password is incorrect.');
    }
  };

  const handleEditMessage = (message: any) => {
    setEditingMessageId(message.id);
    setUpdatedSubject(message.subject);
    setUpdatedContent(message.content);
    setUpdatedImage(null); // Reset the image
  };

  const handleUpdateMessage = async (messageId: string) => {
    const formData = new FormData();
    formData.append('subject', updatedSubject);
    formData.append('content', updatedContent);
    if (updatedImage) {
      formData.append('image', updatedImage);
    }
    formData.append('user_id', authUser?.user_id || '');
    formData.append('id', messageId);

    try {
      const response = await fetch(`${CONSTANT.baseUrl_local}/messages`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? updatedMessage : msg
          )
        );
        setEditingMessageId(null); // Exit edit mode
        navigate('/');
      } else {
        console.error('Error updating message');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null); // Exit the editing mode without saving
  };

  return (
    <div className="content-container">
      <nav>
        <h1>Admin Page</h1>
        <div>
          <Link to={`/`}>
            <h2>Home</h2>
          </Link>
        </div>
      </nav>

      <div className="message block-container">
        <h2>Update Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Change</button>
        {passwordError && <p className="error">{passwordError}</p>}
      </div>

      <div>
        <h2>View/Update Messages</h2>
        {messages.map((message) => (
          <div key={message.id}>
            {editingMessageId === message.id ? (
              <div className="message block-container">
                <input
                  type="text"
                  value={updatedSubject}
                  onChange={(e) => setUpdatedSubject(e.target.value)}
                />
                <textarea
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                />
                <input
                  type="file"
                  onChange={(e) => setUpdatedImage(e.target.files?.[0] || null)}
                />
                <button onClick={() => handleUpdateMessage(message.id)}>
                  Update
                </button>
                <button className="left-space" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <article className="message">
                <div className="flex-container">
                  <img src={message.image_url} alt="Message" width="100" />
                </div>
                <div>
                  <h3>{message.subject}</h3>
                  <p>{message.content}</p>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditMessage(message)}
                  >
                    Edit
                  </button>
                </div>
              </article>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
