import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import styles from '../../styles/MessageContainer.module.scss';
import MessageSkeleton from './MessageSkeleton';
import Message from './Message';

const MessageContainer = ({ selectedChannel }) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Yeni kanal seçildiğinde önce loading'i true yap
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

    // Mesajları temizle ve yeni mesajları yükle
    const loadMessages = setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(loadMessages);
  }, [selectedChannel]); // kanal değiştiğinde gerçekleşecek

  return (
    <div className={styles.container}>
      <ChatHeader selectedChannel={selectedChannel} />
      <div className={styles.messagesArea}>
        {loading ? (
          <>
            {[1, 2, 3].map((index) => (
              <MessageSkeleton key={index} />
            ))}
          </>
        ) : (
          // Message komponenti ile mesajları göster
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
      </div>
      <MessageInput />
    </div>
  );
};

MessageContainer.propTypes = {
  selectedChannel: PropTypes.object,
};

export default MessageContainer;
