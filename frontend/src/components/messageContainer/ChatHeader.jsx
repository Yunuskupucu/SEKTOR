import PropTypes from 'prop-types';
import styles from '../../styles/MessageContainer.module.scss';

const ChatHeader = ({ selectedChannel }) => {
  return (
    <div className={styles.chatHeader}>
      <h1>{selectedChannel?.name || 'Kanal Seçilmedi'}</h1>
    </div>
  );
};

ChatHeader.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default ChatHeader;
