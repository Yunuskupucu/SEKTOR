import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { CgDarkMode } from 'react-icons/cg';
import { FiRefreshCw } from 'react-icons/fi';
import styles from '../styles/Dashboard.module.scss';
import axiosInstance from '../lib/axios';
import { useTheme } from '../context/useTheme';

const PIE_COLORS = ['#5b8def', '#a855f7', '#22c55e', '#f97316', '#06b6d4'];
const BAR_COLORS = ['#5b8def', '#a855f7', '#22c55e', '#f97316', '#e11d48'];

function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [globalStats, setGlobalStats] = useState(null);
  const [messageStats, setMessageStats] = useState(null);
  const [channelStats, setChannelStats] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [globalRes, messageRes, perChannelRes, channelsRes] = await Promise.all([
        axiosInstance.get('/dashboard/global'),
        axiosInstance.get('/dashboard/messages/global'),
        axiosInstance.get('/dashboard/messages/per-channel'),
        axiosInstance.get('/channels'),
      ]);

      setGlobalStats(globalRes.data?.data || {});
      setMessageStats(messageRes.data?.data || {});
      setChannelStats(perChannelRes.data?.data?.messagesPerChannel || []);
      setChannels(channelsRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Veriler alınırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: 'Toplam Kullanıcı', value: globalStats?.totalUsers ?? 0 },
      { label: 'Toplam Kanal', value: globalStats?.totalChannels ?? 0 },
      { label: 'İş İlanı (aktif)', value: globalStats?.activeJobPosts ?? 0 },
      { label: 'Toplam İş İlanı', value: globalStats?.totalJobPosts ?? 0 },
      { label: 'Son 7 günde aktif kanal', value: globalStats?.activeChannelsLast7Days ?? 0 },
    ],
    [globalStats]
  );

  const messageWindowData = useMemo(
    () => [
      { name: 'Son 24 Saat', value: messageStats?.messagesLast24Hours ?? 0 },
      { name: 'Son 7 Gün', value: messageStats?.messagesLast7Days ?? 0 },
      { name: 'Toplam', value: messageStats?.totalMessages ?? 0 },
    ],
    [messageStats]
  );

  const channelsMap = useMemo(() => {
    const map = {};
    channels.forEach((c) => {
      map[c.id] = c.name || c.title || `Kanal ${c.id}`;
    });
    return map;
  }, [channels]);

  const channelChartData = useMemo(
    () =>
      channelStats.map((item) => ({
        name: channelsMap[item.channel_id] || `Kanal ${item.channel_id}`,
        value: Number(item.messageCount) || 0,
      })),
    [channelStats, channelsMap]
  );

  const topChannels = useMemo(
    () =>
      [...channelStats]
        .sort((a, b) => Number(b.messageCount) - Number(a.messageCount))
        .slice(0, 5)
        .map((item) => ({
          id: item.channel_id,
          name: channelsMap[item.channel_id] || `Kanal ${item.channel_id}`,
          messageCount: Number(item.messageCount) || 0,
        })),
    [channelStats, channelsMap]
  );

  const pieData = useMemo(
    () => [
      { name: 'Kullanıcı', value: globalStats?.totalUsers ?? 0 },
      { name: 'Kanal', value: globalStats?.totalChannels ?? 0 },
      { name: 'İş İlanı', value: globalStats?.totalJobPosts ?? 0 },
      { name: 'Aktif İlan', value: globalStats?.activeJobPosts ?? 0 },
    ],
    [globalStats]
  );

  return (
    <div className={`${styles.dashboard} ${theme === 'dark' ? styles.dark : ''}`}>
      <header className={styles.header}>
        <button className={styles.brand} onClick={() => navigate('/app')}>
          <span className={styles.brandMark}>S</span>
          <span className={styles.brandTitle}>SEKTÖR</span>
        </button>

        <div className={styles.actions}>
          <button type="button" className={styles.iconButton} onClick={toggleTheme}>
            <CgDarkMode size={20} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={fetchData}
            disabled={loading}
          >
            <FiRefreshCw size={18} />
          </button>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Veriler yükleniyor...</div>
      ) : (
        <>
          <section className={styles.summary}>
            {summaryCards.map((card, idx) => (
              <div key={card.label} className={styles.card}>
                <p className={styles.cardLabel}>{card.label}</p>
                <p className={styles.cardValue}>{card.value}</p>
                <div
                  className={styles.cardAccent}
                  style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
              </div>
            ))}
          </section>

          <section className={styles.charts}>
            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <h3>Mesaj Aktivitesi</h3>
                <p>24 saat / 7 gün / toplam</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={messageWindowData}>
                  <defs>
                    <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b8def" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#5b8def" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#606060' : '#e5e7eb'}
                  />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#bebebe' : '#6b7280'} />
                  <YAxis allowDecimals={false} stroke={theme === 'dark' ? '#bebebe' : '#6b7280'} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#5b8def"
                    fillOpacity={1}
                    fill="url(#colorMsg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <h3>Kanal Başına Mesaj</h3>
                <p>En aktif kanallar</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#606060' : '#e5e7eb'}
                  />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#bebebe' : '#6b7280'} />
                  <YAxis allowDecimals={false} stroke={theme === 'dark' ? '#bebebe' : '#6b7280'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Mesaj" radius={[6, 6, 0, 0]}>
                    {channelChartData.map((entry, index) => (
                      <Cell key={entry.name} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <h3>Genel Görünüm</h3>
                <p>Kullanıcı, kanal ve ilan dağılımı</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={styles.details}>
            <div className={styles.listBox}>
              <div className={styles.chartHeader}>
                <h3>En Aktif Kanallar</h3>
                <p>Mesaj adetlerine göre ilk 5</p>
              </div>
              <div className={styles.list}>
                {topChannels.map((ch) => (
                  <div key={ch.id} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{ch.name}</p>
                    </div>
                    <span className={styles.badge}>{ch.messageCount} mesaj</span>
                  </div>
                ))}
                {!topChannels.length && <p className={styles.listEmpty}>Henüz mesaj verisi yok.</p>}
              </div>
            </div>

            <div className={styles.miniCards}>
              <div className={styles.miniCard}>
                <p className={styles.miniLabel}>Son 24 Saat</p>
                <p className={styles.miniValue}>{messageStats?.messagesLast24Hours ?? 0}</p>
              </div>
              <div className={styles.miniCard}>
                <p className={styles.miniLabel}>Son 7 Gün</p>
                <p className={styles.miniValue}>{messageStats?.messagesLast7Days ?? 0}</p>
              </div>
              <div className={styles.miniCard}>
                <p className={styles.miniLabel}>Toplam Mesaj</p>
                <p className={styles.miniValue}>{messageStats?.totalMessages ?? 0}</p>
              </div>
            </div>
          </section>

          <section className={styles.cta}>
            <div>
              <p className={styles.ctaTitle}>Topluluğa Katıl</p>
              <p className={styles.ctaText}>
                Sohbet odalarına dahil olup iş ilanlarını görüntülemek için giriş yapın. Gösterge
                paneli, platformdaki en güncel hareketleri özetler.
              </p>
            </div>
            <button type="button" className={styles.ctaButton} onClick={() => navigate('/login')}>
              Devam et
            </button>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
