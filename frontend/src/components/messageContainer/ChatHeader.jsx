import '../../styles/MessageContainer.scss';

const ChatHeader = ({ selectedChannel }) => {
  return (
    <div className="chatHeader">
      <h1>{selectedChannel?.name || 'Kanal Seçilmedi'}</h1>
    </div>
  );
};

export default ChatHeader;
