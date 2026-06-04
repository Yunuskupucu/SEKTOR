import { useState } from 'react';
import MessageContainer from '@/features/chat/components/MessageContainer/MessageContainer';
import Sidebar from '@/features/channels/components/Sidebar/Sidebar';
import styles from './Home.module.scss';
import Header from '@/components/layout/Header/Header';

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
