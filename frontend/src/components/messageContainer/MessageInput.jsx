import { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import styles from '../../styles/MessageInput.module.scss';
import { useTheme } from '../../context/useTheme';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../store/useAuthStore';
import socket from '../../lib/socket';

const MessageInput = ({ selectedChannel }) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const { authUser } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || !authUser || !selectedChannel) return;

    socket.emit('sendMessage', {
      user_id: authUser.id,
      channel_id: selectedChannel.id,
      content: message,
    });

    setMessage('');
  };

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Mesajınızı yazın..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendButton}>
          <IoSendSharp />
        </button>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default MessageInput;
