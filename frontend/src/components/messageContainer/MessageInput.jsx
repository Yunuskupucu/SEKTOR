import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import '../../styles/MessageInput.scss';

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
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="input-wrapper">
        <input
          type="text"
          className="message-input"
          placeholder="Mesajınızı yazın..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send-button">
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
