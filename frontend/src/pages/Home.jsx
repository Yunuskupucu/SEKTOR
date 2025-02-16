import { useState } from 'react';
import MessageContainer from '../components/messageContainer/MessageContainer';
import Sidebar from '../components/sidebar/Sidebar';
import '../styles/Home.scss';
import '../styles/MessageContainer.scss';

function ChatLayout() {
  const [selectedChannel, setSelectedChannel] = useState({
    id: 1,
    name: 'JavaScript',
  });

  return (
    <div className="container">
      <Sidebar setSelectedChannel={setSelectedChannel} />
      <div className="messageContainer">
        <MessageContainer selectedChannel={selectedChannel} />
      </div>
    </div>
  );
}

export default ChatLayout;
