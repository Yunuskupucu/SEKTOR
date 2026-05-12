import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import styles from '../../styles/MessageContainer.module.scss';
import { useTheme } from '../../context/useTheme';
import axiosInstance from '../../lib/axios';

/** İleride API ile değiştirilecek; şimdilik tüm kanallar için sabit örnek liste */
const STATIC_TREND_TOPICS = [
  'Yapay zekâ destekli geliştirme',
  'Bulut maliyet ve ölçeklenebilirlik',
  'Tip güvenliği ve otomatik test',
];

const ChatHeader = ({ selectedChannel, onClose }) => {
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';

  const [infoOpen, setInfoOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(null);
  const [serverDescription, setServerDescription] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);

  const headerRef = useRef(null);

  const themeClassPopover = theme === 'dark' ? styles.channelInfoPopoverDark : '';

  const loadChannelStats = useCallback(async () => {
    if (!selectedChannel?.id) return;
    setStatsLoading(true);
    setStatsError(false);
    try {
      const res = await axiosInstance.get(`channels/${selectedChannel.id}/stats`);
      const payload = res.data?.data;
      setMessageCount(typeof payload?.messageCount === 'number' ? payload.messageCount : 0);
      setServerDescription(payload?.description ?? null);
    } catch (e) {
      console.error('Kanal istatistikleri alınamadı:', e);
      setStatsError(true);
      setMessageCount(null);
    } finally {
      setStatsLoading(false);
    }
  }, [selectedChannel?.id]);

  useEffect(() => {
    setInfoOpen(false);
    setMessageCount(null);
    setServerDescription(null);
    setStatsError(false);
  }, [selectedChannel?.id]);

  useEffect(() => {
    if (!infoOpen) return;
    loadChannelStats();
  }, [infoOpen, loadChannelStats]);

  useEffect(() => {
    if (!infoOpen) return;

    const onPointerDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setInfoOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [infoOpen]);

  const summaryText =
    (typeof serverDescription === 'string' && serverDescription.trim()) ||
    selectedChannel?.summary ||
    'Bu kanal için kısa bir tanım henüz eklenmedi.';

  return (
    <div ref={headerRef} className={`${styles.chatHeader} ${themeClass}`}>
      <div className={styles.chatHeaderMain}>
        <h1>{selectedChannel?.name}</h1>
        {selectedChannel && (
          <div className={styles.infoAnchor}>
            <button
              type="button"
              className={styles.infoButton}
              onClick={() => setInfoOpen((v) => !v)}
              aria-expanded={infoOpen}
              aria-haspopup="dialog"
              aria-label="Kanal bilgisi"
            >
              <FaInfoCircle />
            </button>
            {infoOpen && (
              <div
                className={`${styles.channelInfoPopover} ${themeClassPopover}`}
                role="dialog"
                aria-label={`${selectedChannel.name} bilgisi`}
              >
                <p className={styles.channelInfoSummary}>{summaryText}</p>

                <div className={styles.channelInfoSection}>
                  <h2 className={styles.channelInfoSectionTitle}>Trend konular</h2>
                  <ul className={styles.channelInfoTrendList}>
                    {STATIC_TREND_TOPICS.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.channelInfoFooter}>
                  <span className={styles.channelInfoFooterLabel}>Toplam mesaj</span>
                  <span className={styles.channelInfoFooterValue}>
                    {statsLoading && '…'}
                    {!statsLoading && statsError && '—'}
                    {!statsLoading &&
                      !statsError &&
                      messageCount !== null &&
                      messageCount.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {selectedChannel && (
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Kanalı kapat">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

ChatHeader.propTypes = {
  selectedChannel: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ChatHeader;
