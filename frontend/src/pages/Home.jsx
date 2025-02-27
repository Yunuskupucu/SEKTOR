import { useState } from 'react';
import MessageContainer from '../components/messageContainer/MessageContainer';
import Sidebar from '../components/sidebar/Sidebar';
import styles from '../styles/Home.module.scss';
import Header from '../components/Header';

function Home() {
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleChannelClose = () => {
    setSelectedChannel(null);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div>
          <Sidebar
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
          />
        </div>
        <div className={styles.messageContainer}>
          <MessageContainer
            selectedChannel={selectedChannel}
            onChannelClose={handleChannelClose}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
