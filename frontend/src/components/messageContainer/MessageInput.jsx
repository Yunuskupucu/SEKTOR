import { useRef, useState, useEffect } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import { ImAttachment } from 'react-icons/im';
import { IoClose } from 'react-icons/io5';
import styles from '../../styles/MessageInput.module.scss';
import { useTheme } from '../../context/useTheme';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../store/useAuthStore';
import socket from '../../lib/socket';
import axiosInstance from '../../lib/axios';

const AI_TRIGGER = '@ai';

/**
 * Metni ayna katmanı için parçalar: herhangi bir yerde @ ile başlayan @ / @a / @ai önekleri
 * (tam @ai dahil) ayrı segment; geri kalan düz metin.
 */
function segmentMessageForAiMirror(text) {
  const segments = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === '@') {
      let plen = 0;
      while (
        plen < AI_TRIGGER.length &&
        i + plen < text.length &&
        text[i + plen] === AI_TRIGGER[plen]
      ) {
        plen += 1;
      }
      segments.push({ kind: 'trigger', value: text.slice(i, i + plen) });
      i += plen;
    } else {
      const nextAt = text.indexOf('@', i);
      const end = nextAt === -1 ? text.length : nextAt;
      segments.push({ kind: 'plain', value: text.slice(i, end) });
      i = end;
    }
  }
  return segments;
}

const MessageInput = ({ selectedChannel, onAttachmentUploaded, editingMessage, onEditCancel, onEditComplete }) => {
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { theme } = useTheme();
  const { authUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Düzenleme modunda mesaj içeriğini yükle
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content || '');
      // Input'a focus
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    } else {
      setMessage('');
    }
  }, [editingMessage]);

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !authUser || !selectedChannel) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', message);
    formData.append('channel_id', selectedChannel.id);
    formData.append('user_id', authUser.id);

    try {
      const response = await fetch(
        'http://localhost:5001/api/messages/with-attachment',
        {
          method: 'POST',
          body: formData,
        }
      );

      const rawText = await response.text(); // düz metin olarak al

      if (response.ok) {
        const data = JSON.parse(rawText);
        console.log('✅ Dosya gönderildi:', data);
        // Backend zaten newMessage yayınlar; listeyi kesin tazelemek için callback tetikle
        if (typeof onAttachmentUploaded === 'function') onAttachmentUploaded();
        setMessage('');
      } else {
        console.error('❌ Backend dosya hatası:', rawText);
        // İsteğe bağlı: kullanıcıya da gösterebilirsin
        alert(`Sunucu hatası: ${rawText}`);
      }
    } catch (err) {
      console.error('❌ Dosya gönderilirken hata:', err);
      alert(`İstemci hatası: ${err.message}`);
    }

    event.target.value = ''; // aynı dosyayı tekrar seçebilmek için sıfırla
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || !authUser || !selectedChannel) return;

    // Düzenleme modunda
    if (editingMessage) {
      if (message.trim() === editingMessage.content) {
        // Değişiklik yoksa iptal et
        onEditCancel();
        return;
      }

      setIsUpdating(true);
      try {
        const response = await axiosInstance.patch(`/messages/${editingMessage.id}`, {
          content: message.trim(),
        });

        if (onEditComplete) {
          onEditComplete(response.data);
        }

        setMessage('');
      } catch (error) {
        console.error('❌ Mesaj düzenlenirken hata:', error);
        alert(error.response?.data?.message || 'Mesaj düzenlenirken bir hata oluştu');
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    // Yeni mesaj gönderme
    socket.emit('sendMessage', {
      user_id: authUser.id,
      channel_id: selectedChannel.id,
      content: message,
    });

    console.log('📨 Mesaj gönderildi:', message);
    setMessage('');
  };

  const handleCancelEdit = () => {
    if (onEditCancel) {
      onEditCancel();
    }
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && editingMessage) {
      handleCancelEdit();
    }
  };

  const themeClass = theme === 'dark' ? styles.dark : '';
  const mirrorSegments = message ? segmentMessageForAiMirror(message) : [];

  return (
    <div className={`${styles.container} ${themeClass}`}>
      {editingMessage && (
        <div className={styles.editBanner}>
          <span className={styles.editText}>Mesajı düzenliyorsunuz</span>
          <button
            type="button"
            className={styles.cancelEditButton}
            onClick={handleCancelEdit}
            aria-label="Düzenlemeyi iptal et"
          >
            <IoClose />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <div className={styles.inputField}>
          <div className={styles.inputMirror} aria-hidden="true">
            {mirrorSegments.length > 0 ? (
              <span className={styles.mirrorLine}>
                {mirrorSegments.map((seg, idx) =>
                  seg.kind === 'trigger' ? (
                    <span key={idx} className={styles.aiTrigger}>
                      {seg.value}
                    </span>
                  ) : (
                    <span key={idx} className={styles.mirrorRest}>
                      {seg.value}
                    </span>
                  )
                )}
              </span>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={editingMessage ? 'Mesajınızı düzenleyin...' : 'Mesajınızı yazın...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div className={styles.buttonGroup}>
          {!editingMessage && (
            <>
              <button
                type="button"
                className={styles.attachmentButton}
                onClick={handleAttachmentClick}
              >
                <ImAttachment />
              </button>

              <input
                type="file"
                name="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </>
          )}

          <button
            type="submit"
            className={styles.sendButton}
            disabled={isUpdating || !message.trim()}
          >
            {isUpdating ? (
              <span className={styles.loadingText}>Kaydediliyor...</span>
            ) : (
              <IoSendSharp />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
  onAttachmentUploaded: PropTypes.func,
  editingMessage: PropTypes.object,
  onEditCancel: PropTypes.func,
  onEditComplete: PropTypes.func,
};

export default MessageInput;
