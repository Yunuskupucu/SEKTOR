import PropTypes from 'prop-types';
import styles from '../../styles/Message.module.scss';
import { useTheme } from '../../context/useTheme';

const Message = ({ message, currentUser }) => {
  const isOwnMessage = message.User?.id === currentUser.id || message.user_id === currentUser.id;
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';

  const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url || '');

  return (
    <div
      className={`${styles.messageWrapper} ${isOwnMessage ? styles.ownMessage : ''} ${themeClass}`}
    >
      <div className={styles.messageContainer}>
        <button
          className={styles.sender}
          onClick={() => {
            console.log('PROFİL BİLGİLERİ GÖSTERİLECEK');
          }}
        >
          {!isOwnMessage && (message.User?.fullname || message.User?.username)}
        </button>

        <div className={styles.content}>{message.content}</div>

        {message.attachment_url && (
          <div className={styles.attachment}>
            {isImageUrl(message.attachment_url) ? (
              <img
                src={message.attachment_url}
                alt="ek"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
                onError={(e) => {
                  console.error('IMG LOAD ERROR:', e.currentTarget.src);
                  // istersen fallback ver:
                  // e.currentTarget.src = "/fallback.png";
                }}
              />
            ) : (
              <a
                href={message.attachment_url}
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
          {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
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
