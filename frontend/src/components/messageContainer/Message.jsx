import PropTypes from 'prop-types';
import styles from '../../styles/Message.module.scss';
import { useTheme } from '../../context/useTheme';

const Message = ({ message }) => {
  // current user Ahmet olsun
  const currentUser = 'Ahmet';
  const isOwnMessage = message.sender === currentUser;
  const { theme } = useTheme();

  return (
    <div
      className={`${styles.messageWrapper} ${
        isOwnMessage ? styles.ownMessage : ''
      } ${theme === 'dark' ? styles.dark : ''}`}
    >
      <div className={styles.messageContainer}>
        <div className={styles.sender}>{!isOwnMessage && message.sender}</div>
        <div className={styles.content}>{message.content}</div>
        <div className={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
