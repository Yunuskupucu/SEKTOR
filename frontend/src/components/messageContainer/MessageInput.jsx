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
  };

  // const formData = new FormData();
  //   formData.append('file', file);      file -> backendde tutulacak ad

  // try {
  //     const response = await fetch('https://your-api-endpoint/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error('Yükleme başarısız');
  //     }

  //     const data = await response.json();
  //     setUploadStatus('success');
  //     console.log('Dosya yükleme başarılı:', data);
  //   } catch (error) {
  //     setUploadStatus('error');
  //     console.error('Dosya yükleme hatası:', error);
  //   }
  // };

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
    <div
      className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}
    >
      <div onSubmit={handleSubmit} className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Mesajınızı yazın..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className={styles.buttonGroup}>
          <button
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
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default MessageInput;
