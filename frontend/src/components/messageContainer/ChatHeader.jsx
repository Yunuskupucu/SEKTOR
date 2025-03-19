import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import styles from '../../styles/MessageContainer.module.scss';
import { useTheme } from '../../context/useTheme';

const ChatHeader = ({ selectedChannel, onClose }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`${styles.chatHeader} ${theme === 'dark' ? styles.dark : ''}`}
    >
      <h1>{selectedChannel?.name}</h1>
      {selectedChannel && (
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
      )}
    </div>
  );
};

ChatHeader.propTypes = {
  selectedChannel: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ChatHeader;
