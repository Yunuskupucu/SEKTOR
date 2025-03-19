import { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import styles from '../../styles/MessageInput.module.scss';
import { useTheme } from '../../context/useTheme';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Mesaj gönderme işlemi burada yapılacak
      console.log('Gönderilen mesaj:', message);
      setMessage('');
    }
  };

  return (
    <div
      className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}
    >
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

export default MessageInput;
