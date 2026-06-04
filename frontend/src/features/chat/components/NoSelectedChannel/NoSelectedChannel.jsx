import styles from './NoSelectedChannel.module.scss';
import { useTheme } from '@/hooks/useTheme';

const NoSelectedChannel = () => {
  const { theme } = useTheme();

  const themeClass = theme === 'dark' ? styles.dark : '';

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <div className={styles.content}>
        <div className={styles.icon}>💬</div>
        <h1 className={styles.title}>Hoş Geldiniz 👋</h1>
        <p className={styles.description}>
          Sohbete başlamak için sol menüden bir kanal seçin.
        </p>
      </div>
    </div>
  );
};

export default NoSelectedChannel;
