import { useState } from 'react';
import MessageContainer from '../components/messageContainer/MessageContainer';
import Sidebar from '../components/sidebar/Sidebar';
import '../styles/Home.scss';
import '../styles/MessageContainer.scss';
import Header from '../components/Header';

function Home() {
  const [selectedChannel, setSelectedChannel] = useState('null');
  return (
    <>
      <Header />
      <div className="container">
        <div>
          <Sidebar setSelectedChannel={setSelectedChannel} />
        </div>
        <div className="messageContainer">
          <MessageContainer selectedChannel={selectedChannel} />
        </div>
      </div>
    </>
  );
}

export default Home;
