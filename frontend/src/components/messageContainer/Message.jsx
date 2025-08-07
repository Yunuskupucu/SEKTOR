import PropTypes from 'prop-types';
import styles from '../../styles/Message.module.scss';
import { useTheme } from '../../context/useTheme';

//Moderated section
const Message = ({ message, currentUser }) => {
  const isOwnMessage =
    message.User?.id === currentUser.id || message.user_id === currentUser.id;
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';

  // Dosya görsel mi?
  const isImage = (filename) => {
    const lowered = filename.toLowerCase();
    return (
      lowered.endsWith('.jpg') ||
      lowered.endsWith('.jpeg') ||
      lowered.endsWith('.png') ||
      lowered.endsWith('.gif') ||
      lowered.endsWith('.webp')
    );
  };

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

        {/* Mesaj içeriği */}
        <div className={styles.content}>{message.content}</div>

        {/* ✅ Dosya eki bölümü */}
        {message.attachment && (
          <div className={styles.attachment}>
            {isImage(message.attachment) ? (
              <img
                src={`http://localhost:5001${message.attachment}`}
                alt="ek"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
              />
            ) : (
              <a
                href={`http://localhost:5001${message.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fileLink}
              >
                📎 Dosya indir
              </a>
            )}
          </div>
        )}

        <div className={styles.timestamp}>
          {new Date(message.timestamp || message.createdAt).toLocaleTimeString(
            [],
            { hour: '2-digit', minute: '2-digit' }
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
