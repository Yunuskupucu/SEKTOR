import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import '../../styles/MessageInput.scss';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage('');
  // };

  return (
    <div className="message-input-container">
      <input
        type="text"
        className="message-input"
        placeholder="Send a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="send-button">
        <SendIcon />
      </button>
    </div>
  );
};

export default MessageInput;
