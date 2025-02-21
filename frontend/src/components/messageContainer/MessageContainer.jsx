import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import styles from '../../styles/MessageContainer.module.scss';

const MessageContainer = ({ selectedChannel }) => {
  return (
    <div className={styles.container}>
      <ChatHeader selectedChannel={selectedChannel} />
      <div className={styles.messagesArea}>{/* Mesajlar buraya gelecek */}</div>
      <MessageInput />
    </div>
  );
};

MessageContainer.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default MessageContainer;
