import MessageContainer from '../components/messageContainer/MessageContainer';
import Sidebar from '../components/sidebar/Sidebar';
import '../styles/Home.scss';
import '../styles/MessageContainer.scss';

function ChatLayout() {
  return (
    <div className="container">
      <div>
        <Sidebar />
      </div>
      <div className="messageContainer">
        <MessageContainer />
      </div>
    </div>
  );
}

export default ChatLayout;
