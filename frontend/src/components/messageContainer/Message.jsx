import PropTypes from 'prop-types';
import styles from '../../styles/Message.module.scss';
import { useTheme } from '../../context/useTheme';

//Moderated section
const Message = ({ message, currentUser }) => {
  const isOwnMessage =
    message.User?.id === currentUser.id || message.user_id === currentUser.id;
  const { theme } = useTheme();

  const themeClass = theme === 'dark' ? styles.dark : '';

  return (
    <div
      className={`${styles.messageWrapper} ${
        isOwnMessage ? styles.ownMessage : ''
      } ${themeClass}`}
    >
      <div className={styles.messageContainer}>
        <div className={styles.sender}>
          {!isOwnMessage && (message.User?.fullname || message.User?.username)}
        </div>
        <div className={styles.content}>{message.content}</div>
        <div className={styles.timestamp}>
          {new Date(message.timestamp || message.createdAt).toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          )}
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Message;
