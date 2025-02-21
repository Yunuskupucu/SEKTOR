import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import styles from '../../styles/MessageInput.module.scss';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Mesaj gönderme işlemi burada yapılacak
      console.log('Gönderilen mesaj:', message);
      setMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Mesajınızı yazın..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendButton}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
