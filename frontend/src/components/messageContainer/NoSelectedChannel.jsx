import styles from '../../styles/NoSelectedChannel.module.scss';
import { useTheme } from '../../context/useTheme';

const NoSelectedChannel = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}
    >
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
