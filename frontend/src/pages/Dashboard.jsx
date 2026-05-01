/* eslint-disable react/prop-types */
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '../styles/dashboard-globals.css';
import { useTheme } from '../context/useTheme';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  Code,
  Terminal,
  Cpu,
  Zap,
  Briefcase,
  TrendingUp,
  Hash,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Brain,
  Activity,
  ArrowUp,
  Flame,
  Moon,
  Sun,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.module.scss';

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

function Card({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

function CardHeader({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

function CardTitle({ className = '', children }) {
  return <h3 className={className}>{children}</h3>;
}

function CardDescription({ className = '', children }) {
  return <p className={className}>{children}</p>;
}

function Button({ className = '', children, variant = 'default', size = 'md', ...props }) {
  return (
    <button
      type="button"
      className={classNames(
        className,
        variant === 'outline' ? 'dashboard__button-outline' : 'dashboard__button-primary',
        size === 'lg' ? 'dashboard__button-lg' : ''
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ className = '', children }) {
  return <span className={classNames('dashboard__badge', className)}>{children}</span>;
}

function Progress({ value = 0, className = '' }) {
  return (
    <div className={classNames('dashboard-progress', className)}>
      <div
        className="dashboard-progress__value"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={classNames(
        'dashboard__icon-btn',
        'dashboard__theme-btn',
        isDark ? 'dashboard__theme-btn--dark' : ''
      )}
      onClick={toggleTheme}
      aria-label="Temayi degistir"
      title="Temayi degistir"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', decimals = 0, duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString()
  );
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: 'easeOut' });
      const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [count, value, duration, rounded, isInView]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

// Animated Progress Component
function AnimatedProgress({ value, delay = 0 }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setProgress(value), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [value, delay, isInView]);

  return (
    <div ref={ref}>
      <Progress value={progress} className="dashboard-progress" />
    </div>
  );
}

// Data
const floatingIcons = [
  { icon: Code, delay: 0, x: '65%', y: '40%', tone: 1 },
  { icon: Terminal, delay: 0.5, x: '80%', y: '15%', tone: 2 },
  { icon: Cpu, delay: 1, x: '85%', y: '60%', tone: 3 },
];

const stats = [
  {
    title: 'Aktif Kullanıcı',
    value: 12847,
    change: '+23%',
    icon: Users,
    description: 'Son 30 gun',
    color: 'primary',
  },
  {
    title: 'Günlük Mesaj',
    value: 45621,
    change: '+18%',
    icon: MessageSquare,
    description: 'Ortalama',
    color: 'accent',
  },
  {
    title: 'İş İlanları',
    value: 324,
    change: '+12%',
    icon: Briefcase,
    description: 'Aktif ilanlar',
    color: 'warning',
  },
  {
    title: 'Trend Konular',
    value: 58,
    change: '+45%',
    icon: TrendingUp,
    description: 'Bu hafta',
    color: 'info',
  },
];

const features = [
  {
    title: 'Gerçek Zamanlı Sohbet',
    description: 'Socket.IO tabanlı düşük gecikme süreli mesajlaşma altyapısı ile anlık iletişim',
    icon: MessageSquare,
    highlight: true,
    tone: 1,
  },
  {
    title: 'AI Moderasyon',
    description: 'LLM destekli otonom moderasyon sistemi ile güvenli içerik filtreleme',
    icon: Shield,
    highlight: true,
    tone: 2,
  },
  {
    title: 'Trend Radar',
    description: 'Semantik analiz ve konu modelleme ile haftalık trend içgörüleri',
    icon: TrendingUp,
    highlight: true,
    tone: 3,
  },
  {
    title: 'E-Mentorluk',
    description: 'Deneyimli geliştiricilerden bire bir mentorluk desteği alın',
    icon: Users,
    highlight: false,
    tone: 4,
  },
  {
    title: 'Kariyer Fırsatları',
    description: 'İş ve staj ilanlarına hızlı erişim ile kariyerinizi ilerletin',
    icon: Briefcase,
    highlight: false,
    tone: 5,
  },
  {
    title: 'Programlama Kanalları',
    description: 'Dil ve teknoloji bazlı özelleştirilmiş sohbet kanalları',
    icon: Zap,
    highlight: false,
    tone: 6,
  },
];

const activityData = [
  { name: 'Pzt', mesajlar: 4200, kullanicilar: 1200 },
  { name: 'Sal', mesajlar: 3800, kullanicilar: 1100 },
  { name: 'Car', mesajlar: 5100, kullanicilar: 1450 },
  { name: 'Per', mesajlar: 4700, kullanicilar: 1350 },
  { name: 'Cum', mesajlar: 5800, kullanicilar: 1600 },
  { name: 'Cmt', mesajlar: 3200, kullanicilar: 980 },
  { name: 'Paz', mesajlar: 2900, kullanicilar: 850 },
];

const trends = [
  {
    topic: 'React Server Components',
    category: 'Frontend',
    mentions: 1247,
    growth: 34,
    summary: 'Server-side rendering optimizasyonları ve streaming SSR tartışmaları yoğunlandı',
    hot: true,
  },
  {
    topic: 'AI Kod Asistanları',
    category: 'AI/ML',
    mentions: 982,
    growth: 67,
    summary: 'GitHub Copilot alternatifleri ve yerel LLM entegrasyonları gündemde',
    hot: true,
  },
  {
    topic: 'TypeScript 5.4',
    category: 'Dil',
    mentions: 756,
    growth: 28,
    summary: 'NoInfer tipi ve closure type narrowing özellikleri tartışılıyor',
    hot: false,
  },
  {
    topic: 'Edge Computing',
    category: 'Altyapi',
    mentions: 623,
    growth: 45,
    summary: 'Cloudflare Workers ve Vercel Edge Functions karşılaştırmaları',
    hot: false,
  },
  {
    topic: 'Rust Web Framework',
    category: 'Backend',
    mentions: 489,
    growth: 52,
    summary: 'Axum ve Actix performans testleri toplulukta ilgi görüyor',
    hot: false,
  },
];

const channels = [
  { name: 'react', messages: 12400, active: true },
  { name: 'typescript', messages: 9800, active: true },
  { name: 'python', messages: 8700, active: true },
  { name: 'javascript', messages: 11200, active: false },
  { name: 'rust', messages: 4500, active: true },
  { name: 'go', messages: 6200, active: false },
  { name: 'devops', messages: 5100, active: true },
  { name: 'kariyer', messages: 3400, active: true },
];

const moderationData = {
  totalScanned: 45621,
  approved: 44890,
  flagged: 687,
  blocked: 44,
  accuracy: 99.2,
  avgResponseTime: 12,
};

const categoryColors = {
  Frontend: 'category-frontend',
  'AI/ML': 'category-ai',
  Dil: 'category-lang',
  Altyapı: 'category-infra',
  Backend: 'category-backend',
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const approvedPercent = (moderationData.approved / moderationData.totalScanned) * 100;
  const flaggedPercent = (moderationData.flagged / moderationData.totalScanned) * 100;
  const blockedPercent = (moderationData.blocked / moderationData.totalScanned) * 100;

  return (
    <div className="dashboard">
      {/* Animated Background */}
      <div className="dashboard__background">
        <motion.div
          className="dashboard__background-orb dashboard__background-orb--primary"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="dashboard__background-orb dashboard__background-orb--accent"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="dashboard__header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="dashboard__header-container">
          <motion.button
            type="button"
            className="dashboard__brand"
            onClick={() => navigate('/app')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="dashboard__brand-mark">S</span>
            <span className="dashboard__brand-title">SEKTÖR</span>
          </motion.button>

          <motion.button
            className="dashboard__mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>

          <div className="dashboard__actions">
            <ThemeToggle />

            <motion.button
              type="button"
              className="dashboard__login-btn"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="dashboard__login-btn-shine" />
              Giriş Yap
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="dashboard__mobile-menu"
            >
              <div className="dashboard__mobile-menu-content">
                {['Dashboard', 'Kanallar', 'Mentorluk', 'Kariyer', 'Trendler'].map((item, i) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="dashboard__mobile-menu-link"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="dashboard__mobile-menu-theme">
                  <span>Tema</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Hero Section */}
        <motion.section
          className="dashboard__hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="dashboard__hero-gradient"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className={`dashboard__hero-floating-icon dashboard__hero-floating-icon--tone-${item.tone}`}
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1], y: [0, -10, 0] }}
              transition={{ delay: item.delay, duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <item.icon className="h-5 w-5" />
            </motion.div>
          ))}

          <motion.div
            className="dashboard__hero-orb dashboard__hero-orb--top"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="dashboard__hero-orb dashboard__hero-orb--bottom"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="dashboard__hero-content">
            <motion.div
              className="dashboard__hero-badge"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
              <span>Yapay Zeka Destekli Platform</span>
            </motion.div>

            <motion.h1
              className="dashboard__hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Yazılım Geliştiriciler İçin{' '}
              <span className="dashboard__hero-title-highlight">Akıllı Topluluk</span> Platformu
            </motion.h1>

            <motion.p
              className="dashboard__hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Gerçek zamanlı iletişim, AI destekli moderasyon, trend analizi ve kariyer fırsatları
              ile yazılım ekosisteminde bilgi paylaşımını güçlendirin.
            </motion.p>

            <motion.div
              className="dashboard__hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="dashboard__hero-btn-primary"
                  onClick={() => navigate('/login')}
                >
                  <span className="dashboard__hero-btn-shine" />
                  Topluluğa Katıl
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="dashboard__hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="dashboard__hero-stat dashboard__hero-stat--users"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="h-5 w-5" />
                <div>
                  <p className="dashboard__hero-stat-value">
                    <AnimatedCounter value={12847} suffix="+" />
                  </p>
                  <p className="dashboard__hero-stat-label">Aktif Geliştirici</p>
                </div>
              </motion.div>
              <motion.div
                className="dashboard__hero-stat dashboard__hero-stat--messages"
                whileHover={{ scale: 1.05 }}
              >
                <MessageSquare className="h-5 w-5" />
                <div>
                  <p className="dashboard__hero-stat-value">
                    <AnimatedCounter value={45621} />
                  </p>
                  <p className="dashboard__hero-stat-label">Günlük Mesaj</p>
                </div>
              </motion.div>
              <div className="dashboard__hero-avatars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="dashboard__hero-avatar"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
                <motion.div
                  className="dashboard__hero-avatar dashboard__hero-avatar--more"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  +
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="dashboard__section-title"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="dashboard__section-title-bar dashboard__section-title-bar--primary" />
            Platform İstatistikleri
          </motion.h2>
          <motion.div
            className="dashboard__stats"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Card className={`dashboard__stat-card dashboard__stat-card--${stat.color}`}>
                    <motion.div
                      className="dashboard__stat-shimmer"
                      animate={{ translateX: ['calc(-100%)', 'calc(200%)'] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        delay: index * 0.5,
                      }}
                    />
                    <CardContent className="dashboard__stat-content">
                      <div className="dashboard__stat-info">
                        <p className="dashboard__stat-title">{stat.title}</p>
                        <p className="dashboard__stat-value">
                          <AnimatedCounter value={stat.value} />
                        </p>
                        <div className="dashboard__stat-change">
                          <span className="dashboard__stat-change-value">{stat.change}</span>
                          <span className="dashboard__stat-change-label">{stat.description}</span>
                        </div>
                      </div>
                      <motion.div
                        className="dashboard__stat-icon"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon className="h-6 w-6" />
                      </motion.div>
                    </CardContent>
                    <motion.div
                      className="dashboard__stat-pulse"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="dashboard__section-title"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="dashboard__section-title-bar dashboard__section-title-bar--primary" />
            Temel Özellikler
          </motion.h2>
          <motion.div
            className="dashboard__features"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.03, y: -8 }} className="h-full">
                  <Card
                    className={`dashboard__feature-card ${feature.highlight ? 'dashboard__feature-card--highlight' : ''}`}
                  >
                    <motion.div className="dashboard__feature-glow" />
                    <CardHeader className="dashboard__feature-header">
                      <div className="dashboard__feature-header-content">
                        <div
                          className={`dashboard__feature-icon dashboard__feature-icon--tone-${feature.tone}`}
                        >
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="dashboard__feature-title">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="dashboard__feature-content">
                      <CardDescription className="dashboard__feature-description">
                        {feature.description}
                      </CardDescription>
                      <motion.div
                        className="dashboard__feature-more"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <span>Daha fazla</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          &rarr;
                        </motion.span>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Charts Row */}
        <div className="dashboard__charts-row">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="dashboard__chart-card">
              <CardHeader className="dashboard__card-head">
                <div className="dashboard__chart-header">
                  <div className="dashboard__chart-title-wrapper">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="h-5 w-5 dashboard-icon--c1" />
                    </motion.div>
                    <CardTitle>Haftalik Aktivite</CardTitle>
                  </div>
                  <motion.div
                    className="dashboard__chart-badge"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <TrendingUp className="h-4 w-4 dashboard-icon--c2" />
                    <span>+12%</span>
                  </motion.div>
                </div>
                <CardDescription>Mesaj ve aktif kullanici sayilari</CardDescription>
              </CardHeader>
              <CardContent className="dashboard__card-body">
                <motion.div
                  className="dashboard__chart-legend"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="dashboard__chart-legend-item">
                    <motion.div
                      className="dashboard__chart-legend-dot dashboard__chart-legend-dot--primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>Mesajlar</span>
                  </div>
                  <div className="dashboard__chart-legend-item">
                    <motion.div
                      className="dashboard__chart-legend-dot dashboard__chart-legend-dot--accent"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <span>Kullanicilar</span>
                  </div>
                </motion.div>
                <motion.div
                  className="dashboard__chart-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorMesajlar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorKullanicilar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          color: 'var(--foreground)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="mesajlar"
                        stroke="var(--chart-1)"
                        fillOpacity={1}
                        fill="url(#colorMesajlar)"
                        strokeWidth={3}
                        name="Mesajlar"
                      />
                      <Area
                        type="monotone"
                        dataKey="kullanicilar"
                        stroke="var(--chart-2)"
                        fillOpacity={1}
                        fill="url(#colorKullanicilar)"
                        strokeWidth={3}
                        name="Kullanicilar"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Moderation Stats */}
          <Card className="dashboard__moderation-card">
            <CardHeader className="dashboard__card-head">
              <div className="dashboard__moderation-header">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Shield className="h-5 w-5 dashboard-icon--c3" />
                </motion.div>
                <CardTitle>AI Moderasyon Sistemi</CardTitle>
              </div>
              <CardDescription>
                LLM destekli otonom icerik moderasyonu (son 24 saat)
              </CardDescription>
            </CardHeader>
            <CardContent className="dashboard__card-body">
              <div className="dashboard__moderation-content">
                <motion.div
                  className="dashboard__moderation-stats"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="dashboard__moderation-stat dashboard__moderation-stat--primary"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="dashboard__moderation-pulse"
                      animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="dashboard__moderation-icon"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    >
                      <Brain className="h-4 w-4" />
                    </motion.div>
                    <p className="dashboard__moderation-value">
                      <AnimatedCounter value={moderationData.accuracy} decimals={1} suffix="%" />
                    </p>
                    <p className="dashboard__moderation-label">Dogruluk Orani</p>
                  </motion.div>
                  <motion.div
                    className="dashboard__moderation-stat dashboard__moderation-stat--accent"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="dashboard__moderation-icon"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    <p className="dashboard__moderation-value">
                      <AnimatedCounter value={moderationData.avgResponseTime} suffix="ms" />
                    </p>
                    <p className="dashboard__moderation-label">Ort. Yanit Suresi</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="dashboard__moderation-bars"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="dashboard__moderation-bar">
                    <div className="dashboard__moderation-bar-header">
                      <motion.div className="dashboard__moderation-bar-label" whileHover={{ x: 5 }}>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <CheckCircle className="h-4 w-4 dashboard-icon--c2" />
                        </motion.div>
                        <span>Onaylanan</span>
                      </motion.div>
                      <span className="dashboard__moderation-bar-value">
                        {moderationData.approved.toLocaleString()} ({approvedPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <AnimatedProgress value={approvedPercent} delay={0.2} />
                  </div>

                  <div className="dashboard__moderation-bar">
                    <div className="dashboard__moderation-bar-header">
                      <motion.div className="dashboard__moderation-bar-label" whileHover={{ x: 5 }}>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <AlertTriangle className="h-4 w-4 dashboard-icon--c4" />
                        </motion.div>
                        <span>Isaretlenen</span>
                      </motion.div>
                      <span className="dashboard__moderation-bar-value">
                        {moderationData.flagged.toLocaleString()} ({flaggedPercent.toFixed(2)}%)
                      </span>
                    </div>
                    <AnimatedProgress value={flaggedPercent * 10} delay={0.4} />
                  </div>

                  <div className="dashboard__moderation-bar">
                    <div className="dashboard__moderation-bar-header">
                      <motion.div className="dashboard__moderation-bar-label" whileHover={{ x: 5 }}>
                        <XCircle className="h-4 w-4 dashboard-icon--destructive" />
                        <span>Engellenen</span>
                      </motion.div>
                      <span className="dashboard__moderation-bar-value">
                        {moderationData.blocked.toLocaleString()} ({blockedPercent.toFixed(3)}%)
                      </span>
                    </div>
                    <AnimatedProgress value={blockedPercent * 100} delay={0.6} />
                  </div>
                </motion.div>

                <motion.div
                  className="dashboard__moderation-info"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div
                    className="dashboard__moderation-info-shine"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <p>
                    <span className="dashboard-text-emphasis">Prompt Engineering</span> ve{' '}
                    <span className="dashboard-text-emphasis">Behavioral Prompting</span> teknikleri
                    ile optimize edilmis guvenli AI moderasyon sistemi
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends and Channels Row */}
        <div className="dashboard__trends-channels-row">
          {/* Trends Panel */}
          <Card className="dashboard__trends-card">
            <CardHeader className="dashboard__card-head">
              <div className="dashboard__trends-header">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <TrendingUp className="h-5 w-5 dashboard-icon--c1" />
                </motion.div>
                <CardTitle>Trend Radar & Icgoru Haritasi</CardTitle>
              </div>
              <CardDescription>
                LLM destekli semantik analiz ile haftalik trend konular
              </CardDescription>
            </CardHeader>
            <CardContent className="dashboard__card-body">
              <motion.div
                className="dashboard__trends-list"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {trends.map((trend, index) => (
                  <motion.div key={trend.topic} variants={itemVariants}>
                    <motion.div className="dashboard__trend-item" whileHover={{ scale: 1.01 }}>
                      <motion.div
                        className="dashboard__trend-progress"
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${Math.min(trend.growth * 1.5, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                      <div className="dashboard__trend-content">
                        <div className="dashboard__trend-info">
                          <div className="dashboard__trend-title-row">
                            <span className="dashboard__trend-rank">#{index + 1}</span>
                            <h4 className="dashboard__trend-title">{trend.topic}</h4>
                            {trend.hot && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Flame className="h-4 w-4 dashboard-icon--destructive" />
                              </motion.div>
                            )}
                            <Badge
                              className={`dashboard__trend-badge ${categoryColors[trend.category]}`}
                            >
                              {trend.category}
                            </Badge>
                          </div>
                          <p className="dashboard__trend-summary">{trend.summary}</p>
                        </div>
                        <div className="dashboard__trend-stats">
                          <motion.div
                            className="dashboard__trend-growth"
                            whileHover={{ scale: 1.1 }}
                          >
                            <motion.div
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ArrowUp className="h-4 w-4 dashboard-icon--c2" />
                            </motion.div>
                            <span>%{trend.growth}</span>
                          </motion.div>
                          <div className="dashboard__trend-mentions">
                            <MessageSquare className="h-3 w-3 dashboard-icon--c3" />
                            <span>
                              <AnimatedCounter value={trend.mentions} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          {/* Channels List */}
          <Card className="dashboard__channels-card">
            <CardHeader className="dashboard__card-head">
              <div className="dashboard__channels-header">
                <div>
                  <CardTitle>Populer Kanallar</CardTitle>
                  <CardDescription>En aktif programlama kanallari</CardDescription>
                </div>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-5 w-5 dashboard-icon--c5" />
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="dashboard__card-body">
              <motion.div
                className="dashboard__channels-list"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {channels.map((channel, index) => (
                  <motion.div key={channel.name} variants={itemVariants}>
                    <motion.div
                      className="dashboard__channel-item"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div className="dashboard__channel-hover-glow" />
                      <div className="dashboard__channel-info">
                        <motion.div
                          className={`dashboard__channel-icon dashboard__channel-icon--tone-${(index % 5) + 1}`}
                          whileHover={{ rotate: 10 }}
                        >
                          <Hash className="h-4 w-4" />
                        </motion.div>
                        <div>
                          <div className="dashboard__channel-name">
                            <span>{channel.name}</span>
                            {channel.active && (
                              <motion.span
                                className="dashboard__channel-active"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        <Badge variant="secondary" className="dashboard__channel-badge">
                          {(channel.messages / 1000).toFixed(1)}k mesaj
                        </Badge>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="dashboard__footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="dashboard__footer-content">
          <motion.button
            type="button"
            className="dashboard__brand"
            onClick={() => navigate('/app')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="dashboard__brand-mark">S</span>
            <span className="dashboard__brand-title">SEKTÖR</span>
          </motion.button>
          <p className="dashboard__footer-tagline">
            Yapay zeka destekli yazılım topluluğu platformu
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
