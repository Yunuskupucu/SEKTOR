import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import JobBoard from '../job/JobCard';
import AddJobModal from '../job/AddJobModal';
import styles from '../../styles/MessageContainer.module.scss';
import MessageSkeleton from './MessageSkeleton';
import Message from './Message';
import NoSelectedChannel from './NoSelectedChannel';
import { useTheme } from '../../context/useTheme';
import axiosInstance from '../../lib/axios';
import { socket } from '../../lib/socket';
import { useAuthStore } from '../../store/useAuthStore';

const MessageContainer = ({ selectedChannel, onChannelClose }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [reloadSeq, setReloadSeq] = useState(0);
  const [editingMessage, setEditingMessage] = useState(null);
  const [jobListRefreshSeq, setJobListRefreshSeq] = useState(0);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  const { theme } = useTheme();
  const { authUser } = useAuthStore();
  const themeClass = theme === 'dark' ? styles.dark : '';

  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  //  eski → yeni
  const mergeUniqueById = useCallback((arr) => {
    const map = new Map();
    for (const m of arr) map.set(m.id, m);
    return Array.from(map.values()).sort((a, b) => {
        const ta = new Date(a.timestamp || a.created_at || a.createdAt || a.ts).getTime();
        const tb = new Date(b.timestamp || b.created_at || b.createdAt || b.ts).getTime();
      return ta - tb;
    });
  }, []);

  const scrollToBottom = (behavior = 'auto') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const isNearBottom = () => {
    const area = messagesAreaRef.current;
    if (!area) return true;
    const { scrollTop, scrollHeight, clientHeight } = area;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Yeni mesaj eklendiğinde kullanıcı alttaysa otomatik kaydır
  useEffect(() => {
    if (!messagesAreaRef.current || messages.length === 0) return;
    if (isNearBottom()) scrollToBottom('smooth');
  }, [messages]);

  // Eski mesajları yükle (üstten)
  const loadMoreMessages = useCallback(async () => {
    if (!selectedChannel || !hasMore || isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const params = new URLSearchParams({ limit: '20' });
      if (nextCursor) {
        params.append('beforeTs', nextCursor.beforeTs);
        params.append('beforeId', nextCursor.beforeId);
      }

      const res = await axiosInstance.get(`/messages/${selectedChannel.id}?${params.toString()}`);

      const { items, next, hasMore: more } = res.data;

      if (items.length > 0 && messagesAreaRef.current) {
        const area = messagesAreaRef.current;
        const oldScrollHeight = area.scrollHeight;

        // Overlap'ları at, sonra tekilleştir ve sırala
        setMessages((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const fresh = items.filter((m) => !existing.has(m.id));
          return mergeUniqueById([...fresh, ...prev]);
        });

        setNextCursor(next);
        setHasMore(more);

        // Scroll pozisyonunu koru
        requestAnimationFrame(() => {
          const newScrollHeight = area.scrollHeight;
          area.scrollTop = newScrollHeight - oldScrollHeight;
        });
      }
    } catch (err) {
      console.error('❌ [LAZY LOAD] Eski mesajlar yüklenemedi:', err);
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [selectedChannel, hasMore, nextCursor, mergeUniqueById]);

  // Scroll event (üste yaklaşınca lazy load)
  const handleScroll = useCallback(() => {
    const area = messagesAreaRef.current;
    if (!area) return;
    if (area.scrollTop < 100 && hasMore && !isLoadingMoreRef.current) {
      loadMoreMessages();
    }
  }, [hasMore, loadMoreMessages]);

  // İlk mesajları yükle (ve en alta in) — yalnızca chat tipinde
  useEffect(() => {
    const channelType = (selectedChannel?.type || '').toString().trim().toLowerCase();
    if (!selectedChannel || channelType === 'jobs') return;

    const fetchMessages = async () => {
      setLoading(true);
      setMessages([]);
      setHasMore(false);
      setNextCursor(null);

      try {
        const res = await axiosInstance.get(`/messages/${selectedChannel.id}?limit=20`);
        const { items, next, hasMore: more } = res.data;

        setMessages(mergeUniqueById(items));
        setNextCursor(next);
        setHasMore(more);

        // En alta (en yeni) git
        requestAnimationFrame(() => scrollToBottom('auto'));
      } catch (err) {
        console.error('❌ [INIT] Mesajlar alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    const room = String(selectedChannel.id);
    
     const joinRoom = () => {
      console.log('📡 FRONTEND joinChannel:', room, 'socket:', socket.id);
      socket.emit('joinChannel', room);
    };

  fetchMessages();

    if (socket.connected) {
    joinRoom();
  }

  socket.on('connect', joinRoom);

const onNewMessage = (message) => {
  // Number() ile normalize et
  if (Number(message.channel_id) !== Number(selectedChannel.id)) return;
  setMessages((prev) => {
    if (prev.some((m) => m.id === message.id)) return prev;
    return mergeUniqueById([...prev, message]);
  });
};

const onMessageUpdated = (updatedMessage) => {
  if (Number(updatedMessage.channel_id) !== Number(selectedChannel.id)) return;
  setMessages((prev) =>
    prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
  );
};

const onMessageDeleted = (deletedData) => {
  if (Number(deletedData.channel_id) !== Number(selectedChannel.id)) return;
  setMessages((prev) =>
    prev.map((m) =>
      m.id === deletedData.id
        ? {
            ...m,
            status: 'removed',
            content: 'Mesaj kaldırıldı.',
            removal_reason: deletedData.removal_reason || 'user',
          }
        : m
    )
  );
};

    socket.on('newMessage', onNewMessage);
    socket.on('messageUpdated', onMessageUpdated);
    socket.on('messageDeleted', onMessageDeleted);

    return () => {
      socket.emit('leaveChannel', selectedChannel.id);
      socket.off('newMessage', onNewMessage);
      socket.off('messageUpdated', onMessageUpdated);
      socket.off('messageDeleted', onMessageDeleted);
    };
  }, [selectedChannel, mergeUniqueById, reloadSeq]);

  const handleAttachmentUploaded = () => {
    setReloadSeq((prev) => prev + 1);
  };

  return (
    <div className={`${styles.container} ${themeClass}`}>
      {selectedChannel ? (
        <>
          <ChatHeader selectedChannel={selectedChannel} onClose={onChannelClose} />

          <div className={styles.contentWrapper}>
            {(selectedChannel?.type || '').toString().trim().toLowerCase() === 'jobs' ? (
              <div className={styles.jobsChannelRoot}>
                <JobBoard
                  selectedChannel={selectedChannel}
                  listRefreshSeq={jobListRefreshSeq}
                />
                <button
                  type="button"
                  className={styles.jobAddFab}
                  onClick={() => setIsAddJobModalOpen(true)}
                  aria-label="Yeni iş ilanı ekle"
                >
                  <Plus size={26} />
                </button>
                {isAddJobModalOpen && (
                  <AddJobModal
                    onClose={() => setIsAddJobModalOpen(false)}
                    onCreated={() => setJobListRefreshSeq((n) => n + 1)}
                  />
                )}
              </div>
            ) : (
              <>
                <div
                  ref={messagesAreaRef}
                  className={`${styles.messagesArea} ${themeClass}`}
                  onScroll={handleScroll}
                >
                  {loadingMore && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 10,
                        fontSize: 12,
                        color: '#888',
                      }}
                    >
                      Eski mesajlar yükleniyor...
                    </div>
                  )}

                  {loading ? (
                    [1, 2, 3].map((i) => <MessageSkeleton key={i} />)
                  ) : messages.length > 0 ? (
                    <>
                      {hasMore && !loadingMore && (
                        <div
                          style={{
                            textAlign: 'center',
                            padding: 10,
                            fontSize: 12,
                            color: '#888',
                          }}
                        >
                          ↑ Daha eski mesajlar için yukarı kaydırın
                        </div>
                      )}

                      {messages.map((msg) => (
                        <Message
                          key={msg.id}
                          message={msg}
                          currentUser={authUser}
                          onEdit={(message) => setEditingMessage(message)}
                          onMessageDelete={(messageId) => {
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === messageId
                                  ? {
                                      ...m,
                                      status: 'removed',
                                      content: 'Mesaj kaldırıldı.',
                                      removal_reason: 'user',
                                    }
                                  : m
                              )
                            );
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <p>Henüz mesaj yok.</p>
                  )}

                  {/* En alta konumlandırma hedefi (en yeni) */}
                  <div ref={messagesEndRef} />
                </div>

                <div className={`${styles.messageInput} ${themeClass}`}>
                  <MessageInput
                    selectedChannel={selectedChannel}
                    onAttachmentUploaded={handleAttachmentUploaded}
                    editingMessage={editingMessage}
                    onEditCancel={() => setEditingMessage(null)}
                    onEditComplete={(updatedMessage) => {
                      setMessages((prev) =>
                        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
                      );
                      setEditingMessage(null);
                    }}
                  />
                </div>
              </>
            )}
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
