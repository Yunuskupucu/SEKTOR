import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import styles from '../../styles/MessageContainer.module.scss';
import MessageSkeleton from './MessageSkeleton';
import Message from './Message';
import NoSelectedChannel from './NoSelectedChannel';

const MessageContainer = ({ selectedChannel, onChannelClose }) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selectedChannel) return;

    setLoading(true);
    const mockMessages = [
      {
        id: 1,
        content: `${selectedChannel?.name} kanalına hoş geldiniz!`,
        sender: 'Ahmet',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        content: 'Test message',
        sender: 'Mehmet',
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        content: 'Test message',
        sender: 'Ahmet',
        timestamp: new Date().toISOString(),
      },
      {
        id: 4,
        content: 'Test message',
        sender: 'Ali',
        timestamp: new Date().toISOString(),
      },
      {
        id: 5,
        content: 'Test message',
        sender: 'Ali',
        timestamp: new Date().toISOString(),
      },
    ];

    const loadMessages = setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(loadMessages);
  }, [selectedChannel]);

  return (
    <div className={styles.container}>
      {selectedChannel ? (
        <div className={styles.channelContent}>
          <ChatHeader
            selectedChannel={selectedChannel}
            onClose={onChannelClose}
          />
          <div className={styles.messagesArea}>
            {loading ? (
              <>
                {[1, 2, 3].map((index) => (
                  <MessageSkeleton key={index} />
                ))}
              </>
            ) : (
              messages.map((message) => (
                <Message key={message.id} message={message} />
              ))
            )}
          </div>
        </div>
      ) : (
        <NoSelectedChannel />
      )}
      {selectedChannel ? <MessageInput /> : null}
    </div>
  );
};

MessageContainer.propTypes = {
  selectedChannel: PropTypes.object,
  onChannelClose: PropTypes.func.isRequired,
};

export default MessageContainer;
