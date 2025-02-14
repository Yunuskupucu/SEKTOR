import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

const MessageContainer = () => {
  return (
    <div className="messageContainer">
      <ChatHeader />
      <div>Mesajlar</div>
      <MessageInput />
    </div>
  );
};

export default MessageContainer;
