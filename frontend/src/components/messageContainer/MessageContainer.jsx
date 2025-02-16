import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

const MessageContainer = ({ selectedChannel }) => {
  return (
    <div className="messageContainer">
      <ChatHeader selectedChannel={selectedChannel} />
      <div>Mesajlar</div>
      <MessageInput />
    </div>
  );
};

MessageContainer.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
};

export default MessageContainer;
