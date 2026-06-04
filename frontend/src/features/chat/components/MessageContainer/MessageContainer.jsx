import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageInput from '../MessageInput/MessageInput';
import JobBoard from '@/features/jobs/components/JobCard/JobCard';
import AddJobModal from '@/features/jobs/components/AddJobModal/AddJobModal';
import styles from './MessageContainer.module.scss';
import MessageSkeleton from '../MessageSkeleton/MessageSkeleton';
import Message from '../Message/Message';
import NoSelectedChannel from '../NoSelectedChannel/NoSelectedChannel';
import { useTheme } from '@/hooks/useTheme';
import axiosInstance from '@/services/api/axios';
import { socket } from '@/services/socket/socket';
import { useAuthStore } from '@/store/useAuthStore';

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

  const messagesAreaRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  /** Üstten eski mesaj yüklenirken listeyi en alta zorlamayı atla */
  const skipNextBottomScrollRef = useRef(false);
  /** Önceki mesaj sayısı — tek adet eklemeyi (yeni mesaj) smooth kaydırmak için */
  const prevMessageCountRef = useRef(0);

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
    const area = messagesAreaRef.current;
    if (!area) return;
    const top = area.scrollHeight;
    if (behavior === 'smooth' && typeof area.scrollTo === 'function') {
      area.scrollTo({ top, behavior: 'smooth' });
    } else {
      area.scrollTop = top;
    }
  };

  // Mesaj listesi değişince en alta: kanal açılışında anında (auto) + sonradan büyüyen layout için tekrar;
  // ardışık tek mesaj eklemelerinde smooth.
  useLayoutEffect(() => {
    const area = messagesAreaRef.current;
    if (!area || messages.length === 0) {
      prevMessageCountRef.current = 0;
      return;
    }
    if (skipNextBottomScrollRef.current) return;

    const prev = prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    const appendedOne = prev > 0 && messages.length === prev + 1;
    const behavior = appendedOne ? 'smooth' : 'auto';
    scrollToBottom(behavior);

    if (!appendedOne) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!messagesAreaRef.current || skipNextBottomScrollRef.current) return;
          scrollToBottom('auto');
        });
      });
    }
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

        skipNextBottomScrollRef.current = true;

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
          skipNextBottomScrollRef.current = false;
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
      skipNextBottomScrollRef.current = false;
      prevMessageCountRef.current = 0;
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
