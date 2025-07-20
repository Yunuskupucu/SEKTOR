import { useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import { ImAttachment } from 'react-icons/im';
import styles from '../../styles/MessageInput.module.scss';
import { useTheme } from '../../context/useTheme';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../store/useAuthStore';
import socket from '../../lib/socket';

const MessageInput = ({ selectedChannel }) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const { authUser } = useAuthStore();
  const fileInputRef = useRef(null);

  const handleAttachmentClick = () => {
    console.log('Attachment butonuna tıklandı');
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // İleride dosya gönderimi için kullanılabilir.
    console.log("📎 Dosya seçildi:", file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || !authUser || !selectedChannel) return;

    socket.emit('sendMessage', {
      user_id: authUser.id,
      channel_id: selectedChannel.id,
      content: message,
    });

    console.log("📨 Mesaj gönderildi:", message);
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

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.attachmentButton}
            onClick={handleAttachmentClick}
          >
            <ImAttachment />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <button type="submit" className={styles.sendButton}>
            <IoSendSharp />
          </button>
        </div>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default MessageInput;
