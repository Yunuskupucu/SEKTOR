import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import styles from '../../styles/MessageContainer.module.scss';
import MessageSkeleton from './MessageSkeleton';
import Message from './Message';
import NoSelectedChannel from './NoSelectedChannel';
import { useTheme } from '../../context/useTheme';
import axiosInstance from '../../lib/axios';
import socket from '../../lib/socket';
import { useAuthStore } from '../../store/useAuthStore';

const MessageContainer = ({ selectedChannel, onChannelClose }) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const { theme } = useTheme();
  const { authUser } = useAuthStore();

  const themeClass = theme === 'dark' ? styles.dark : '';

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/messages/${selectedChannel.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Mesajlar alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    socket.emit('joinChannel', selectedChannel.id);

    socket.on('newMessage', (message) => {
      if (message.channel_id === selectedChannel.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [selectedChannel]);

  return (
    <div className={`${styles.container} ${themeClass}`}>
      {selectedChannel ? (
        <>
          <ChatHeader
            selectedChannel={selectedChannel}
            onClose={onChannelClose}
          />
          <div className={styles.contentWrapper}>
            <div className={`${styles.messagesArea} ${themeClass}`}>
              {loading ? (
                [1, 2, 3].map((i) => <MessageSkeleton key={i} />)
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <Message key={msg.id} message={msg} currentUser={authUser} />
                ))
              ) : (
                <p>Henüz mesaj yok.</p>
              )}

              <div ref={messagesEndRef} />
            </div>
            <div className={`${styles.messageInput} ${themeClass}`}>
              <MessageInput selectedChannel={selectedChannel} />
            </div>
          </div>
        </>
      ) : (
        <NoSelectedChannel />
      )}
    </div>
  );
};

MessageContainer.propTypes = {
  selectedChannel: PropTypes.object,
  onChannelClose: PropTypes.func.isRequired,
};

export default MessageContainer;
