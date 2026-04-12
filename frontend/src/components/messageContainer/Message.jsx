import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/Message.module.scss';
import { useTheme } from '../../context/useTheme';
import UserProfileModal from './UserProfileModal';
import ConfirmModal from '../common/ConfirmModal';
import { IoInformationCircleOutline, IoTrashOutline, IoWarning } from 'react-icons/io5';
import axiosInstance from '../../lib/axios';
import robotAvatar from '../../assets/ai-avatar.png';

const Message = ({ message, currentUser, onEdit, onMessageDelete }) => {
  const isOwnMessage =
    message.User?.id === currentUser.id || message.user_id === currentUser.id;

  const isAiBot =
    message.User?.email === 'ai-bot@sektor.internal' ||
    message.User?.fullname === 'Sektör AI';

  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const menuRef = useRef(null);

  const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url || '');

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

  const openDeleteModal = () => {
    setShowMenu(false);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    setDeleteError('');
    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(`/messages/${message.id}`);

      if (response.data.success) {
        if (onMessageDelete) {
          onMessageDelete(message.id);
        }
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('❌ Mesaj silinirken hata:', error);
      setDeleteError(error.response?.data?.message || 'Mesaj silinirken bir hata oluştu');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isRemoved = message.status === 'removed';
  const removalReason = message.removal_reason;
  const isUserRemoved = isRemoved && removalReason === 'user';

  /** Kaldırılmış mesajda yalnızca bu üç uyarı tipinden biri gösterilir. */
  const removedNotice = !isRemoved
    ? null
    : removalReason === 'moderation'
      ? {
          Icon: IoWarning,
          iconClass: styles.warningIcon,
          text: 'Bu mesaj uygunsuz içerik nedeniyle engellendi.',
        }
      : removalReason === 'user'
        ? {
            Icon: IoTrashOutline,
            iconClass: styles.removedUserIcon,
            text: isOwnMessage ? 'Mesajı sildiniz.' : 'Mesaj silindi.',
          }
        : {
            Icon: IoInformationCircleOutline,
            iconClass: styles.removedNeutralIcon,
            text: 'Mesaj silindi.',
          };

const senderName = isOwnMessage
  ? currentUser?.fullname || currentUser?.username || 'Kullanıcı'
  : message.User?.fullname || message.User?.username || 'Kullanıcı';

const userAvatar = isOwnMessage
  ? currentUser?.profile_picture_url || null
  : message.User?.profile_picture_url || null;

const avatarSrc = isAiBot ? robotAvatar : userAvatar;

const handleProfileClick = () => {
  if (!isOwnMessage && !isAiBot && (message.User?.id || message.user_id)) {
    setShowProfileModal(true);
  }
};

  return (
    <div
      className={`${styles.messageWrapper} ${isOwnMessage ? styles.ownMessage : ''} ${isRemoved ? styles.removed : ''} ${isUserRemoved ? styles.removedByUser : ''} ${isAiBot ? styles.aiMessage : ''} ${themeClass}`}
    >
      <div className={styles.messageBody}>
        <div 
          className={styles.avatar}
          onClick={handleProfileClick}
          style={{ cursor: (!isOwnMessage && !isAiBot && (message.User?.id || message.user_id)) ? 'pointer' : 'default' }}
          role={(!isOwnMessage && !isAiBot && (message.User?.id || message.user_id)) ? 'button' : undefined}
          tabIndex={(!isOwnMessage && !isAiBot && (message.User?.id || message.user_id)) ? 0 : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleProfileClick();
            }
          }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={isAiBot ? 'AI Bot' : senderName}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {senderName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div
          className={`${styles.messageContainer} ${isRemoved ? styles.removedMessage : ''} ${isAiBot ? styles.aiBubble : ''}`}
        >
          {isOwnMessage && !isRemoved && (
            <div className={styles.messageActions} ref={menuRef}>
              <button
                className={styles.menuButton}
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Mesaj seçenekleri"
                type="button"
              >
                <span className={styles.menuIcon}>⋯</span>
              </button>

              {showMenu && (
                <div className={`${styles.menu} ${themeClass}`}>
                  <button
                    className={styles.menuItem}
                    onClick={handleEdit}
                    type="button"
                  >
                    Düzenle
                  </button>
                  <button
                    className={`${styles.menuItem} ${styles.deleteItem}`}
                    onClick={openDeleteModal}
                    type="button"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          )}

          {!isRemoved && (
            <div className={styles.messageHeader}>
              <button
                className={styles.sender}
                onClick={handleProfileClick}
                type="button"
              >
                {senderName}
              </button>
            </div>
          )}

          {removedNotice ? (
            <div
              className={`${styles.removedContent} ${isUserRemoved ? styles.removedContentUser : ''}`}
            >
              <removedNotice.Icon className={removedNotice.iconClass} aria-hidden />
              <span>{removedNotice.text}</span>
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
            {message.edited_at && (
              <span className={styles.editedLabel}>Düzenlendi</span>
            )}
            {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {showProfileModal && (
        <UserProfileModal
          userId={message.User?.id || message.user_id}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      <ConfirmModal
        open={showDeleteModal}
        title="Mesajı sil"
        description="Bu mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel={deleteLoading ? 'Siliniyor...' : 'Sil'}
        cancelLabel="Vazgeç"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        confirmDisabled={deleteLoading}
        error={deleteError}
      />
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