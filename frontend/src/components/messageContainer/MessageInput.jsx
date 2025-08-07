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
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !authUser || !selectedChannel) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', message);
    formData.append('channel_id', selectedChannel.id);
    formData.append('user_id', authUser.id);

    try {
      const response = await fetch('http://localhost:5001/api/messages/with-attachment', {

        method: 'POST',
        body: formData,
      });

      const rawText = await response.text(); // düz metin olarak al

      if (response.ok) {
        const data = JSON.parse(rawText);
        console.log('✅ Dosya gönderildi:', data);
        socket.emit('newMessage', data);
        setMessage('');
      } else {
        console.error('❌ Backend dosya hatası:', rawText);
        // İsteğe bağlı: kullanıcıya da gösterebilirsin
        alert(`Sunucu hatası: ${rawText}`);
      }
    } catch (err) {
      console.error('❌ Dosya gönderilirken hata:', err);
      alert(`İstemci hatası: ${err.message}`);
    }

    event.target.value = ''; // aynı dosyayı tekrar seçebilmek için sıfırla
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || !authUser || !selectedChannel) return;

    socket.emit('sendMessage', {
      user_id: authUser.id,
      channel_id: selectedChannel.id,
      content: message,
    });

    console.log('📨 Mesaj gönderildi:', message);
    setMessage('');
  };

  const themeClass = theme === 'dark' ? styles.dark : '';

  return (
    <div className={`${styles.container} ${themeClass}`}>
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
            name="file"
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
