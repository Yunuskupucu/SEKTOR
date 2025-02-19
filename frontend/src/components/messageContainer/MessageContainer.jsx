import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import '../../styles/MessageContainer.scss';

const MessageContainer = ({ selectedChannel }) => {
  return (
    <div className="messageContainer">
      <ChatHeader selectedChannel={selectedChannel} />
      <div className="messages-area">{/* Mesajlar buraya gelecek */}</div>
      <MessageInput />
    </div>
  );
};

MessageContainer.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default MessageContainer;
