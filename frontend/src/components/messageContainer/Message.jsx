import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/Message.module.scss';
import { useTheme } from '../../context/useTheme';
import UserProfileModal from './UserProfileModal';
import { IoWarning } from 'react-icons/io5';
import axiosInstance from '../../lib/axios';

const Message = ({ message, currentUser, onEdit, onMessageDelete }) => {
  const isOwnMessage = message.User?.id === currentUser.id || message.user_id === currentUser.id;
  const isAiBot = message.User?.email === 'ai-bot@sektor.internal' || 
                message.User?.fullname === 'Sektör AI';
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url || '');

  // Menü dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message);
    }
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      setShowMenu(false);
      return;
    }

    try {
      const response = await axiosInstance.delete(`/messages/${message.id}`);

      if (response.data.success) {
        if (onMessageDelete) {
          onMessageDelete(message.id);
        }
      }
    } catch (error) {
      console.error('❌ Mesaj silinirken hata:', error);
      alert(error.response?.data?.message || 'Mesaj silinirken bir hata oluştu');
    } finally {
      setShowMenu(false);
    }
  };

  const isRemoved = message.status === 'removed';

  return (
    <div
      className={`${styles.messageWrapper} ${isOwnMessage ? styles.ownMessage : ''} ${isRemoved ? styles.removed : ''} ${isAiBot ? styles.aiMessage : ''} ${themeClass}`}
    >
      <div className={`${styles.messageContainer} ${isRemoved ? styles.removedMessage : ''} ${isAiBot ? styles.aiBubble : ''}`}>
        {isOwnMessage && !isRemoved && (
          <div className={styles.messageActions} ref={menuRef}>
            <button
              className={styles.menuButton}
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Mesaj seçenekleri"
            >
              <span className={styles.menuIcon}>⋯</span>
            </button>

            {showMenu && (
              <div className={`${styles.menu} ${themeClass}`}>
                <button className={styles.menuItem} onClick={handleEdit}>
                  Düzenle
                </button>
                <button
                  className={`${styles.menuItem} ${styles.deleteItem}`}
                  onClick={handleDelete}
                >
                  Sil
                </button>
              </div>
            )}
          </div>
        )}

       {!isRemoved && (
  <button
    className={styles.sender}
    onClick={() => {
      if (!isOwnMessage && !isAiBot && (message.User?.id || message.user_id)) {
        setShowProfileModal(true);
      }
    }}
  >
    {!isOwnMessage && (
      <>
        {isAiBot && <span style={{ marginRight: 4 }}>🤖</span>}
        {message.User?.fullname || message.User?.username}
      </>
    )}
  </button>
)}
        {isRemoved ? (
          <div className={styles.removedContent}>
            <IoWarning className={styles.warningIcon} />
            <span>Bu mesaj uygunsuz içerik nedeniyle engellendi.</span>
          </div>
        ) : (
          <div className={styles.content}>{message.content}</div>
        )}

        {!isRemoved && message.attachment_url && (
          <div className={styles.attachment}>
            {isImageUrl(message.attachment_url) ? (
              <img
                src={message.attachment_url}
                alt="ek"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
                onError={(e) => {
                  console.error('IMG LOAD ERROR:', e.currentTarget.src);
                  // istersen fallback ver:
                  // e.currentTarget.src = "/fallback.png";
                }}
              />
            ) : (
              <a
                href={message.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fileLink}
              >
                📎 Dosya indir
              </a>
            )}
          </div>
        )}

        <div className={styles.timestamp}>
          {message.edited_at && <span className={styles.editedLabel}>Düzenlendi</span>}
          {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {showProfileModal && (
        <UserProfileModal
          userId={message.User?.id || message.user_id}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onMessageDelete: PropTypes.func,
};

export default Message;
