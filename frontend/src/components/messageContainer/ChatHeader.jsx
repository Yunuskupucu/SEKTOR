import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import styles from '../../styles/MessageContainer.module.scss';
import { useTheme } from '../../context/useTheme';
import axiosInstance from '../../lib/axios';



const ChatHeader = ({ selectedChannel, onClose }) => {
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';


  const [infoOpen, setInfoOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(null);
  const [serverDescription, setServerDescription] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);

  // Trend konuları için state
  const [trendTopics, setTrendTopics] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState(false);
  // Kanal trendlerini yükle
  const loadChannelTrends = useCallback(async () => {
    if (!selectedChannel?.id) return;
    setTrendLoading(true);
    setTrendError(false);
    try {
      const res = await axiosInstance.get(`channels/${selectedChannel.id}/weekly-trends`);
      const payload = res.data?.data;
      setTrendTopics(Array.isArray(payload?.trends) ? payload.trends : []);
    } catch (e) {
      console.error('Kanal trendleri alınamadı:', e);
      setTrendError(true);
      setTrendTopics([]);
    } finally {
      setTrendLoading(false);
    }
  }, [selectedChannel?.id]);

  /** Bilgi butonu + popover; dışına tıklanınca pencere kapanır */
  const infoPanelRef = useRef(null);

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
    setTrendTopics([]);
    setTrendError(false);
    setTrendLoading(false);
  }, [selectedChannel?.id]);


  useEffect(() => {
    if (!infoOpen) return;
    loadChannelStats();
    loadChannelTrends();
  }, [infoOpen, loadChannelStats, loadChannelTrends]);

  useEffect(() => {
    if (!infoOpen) return;

    const onPointerDown = (e) => {
      const panel = infoPanelRef.current;
      if (panel && !panel.contains(e.target)) {
        setInfoOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown, true);
      document.removeEventListener('touchstart', onPointerDown, true);
    };
  }, [infoOpen]);

  const summaryText =
    (typeof serverDescription === 'string' && serverDescription.trim()) ||
    selectedChannel?.summary ||
    'Bu kanal için kısa bir tanım henüz eklenmedi.';

  return (
    <div className={`${styles.chatHeader} ${themeClass}`}>
      <div className={styles.chatHeaderMain}>
        <h1>{selectedChannel?.name}</h1>
        {selectedChannel && (
          <div ref={infoPanelRef} className={styles.infoAnchor}>
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
                <button
                  type="button"
                  className={styles.channelInfoPopoverClose}
                  onClick={() => setInfoOpen(false)}
                  aria-label="Bilgi penceresini kapat"
                >
                  <FaTimes aria-hidden />
                </button>
                <p className={styles.channelInfoSummary}>{summaryText}</p>

                <div className={styles.channelInfoSection}>
                  <h2 className={styles.channelInfoSectionTitle}>Trend konular</h2>
                  <ul className={styles.channelInfoTrendList}>
                    {trendLoading && <li>Yükleniyor…</li>}
                    {trendError && <li>Trend konular alınamadı.</li>}
                    {!trendLoading && !trendError && trendTopics.length === 0 && (
                      <li>Bu gün için trend konu bulunamadı.</li>
                    )}
                    {!trendLoading && !trendError && trendTopics.map((trend, idx) => (
                      <li key={`${trend?.topic || 'trend'}-${idx}`}>
                        <strong>{trend?.topic || 'Bilinmeyen konu'}</strong>
                        {trend?.summary && (
                          <p>{trend.summary}</p>
                        )}
                      </li>
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
