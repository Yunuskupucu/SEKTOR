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

export default MessageContainer;
