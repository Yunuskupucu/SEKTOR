import styles from '../../styles/MessageSkeleton.module.scss';

const MessageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {/* Avatar placeholder */}
      <div className={styles.avatarSkeleton}></div>

      <div className={styles.contentWrapper}>
        {/* İsim placeholder */}
        <div className={styles.nameSkeleton}></div>

        {/* Mesaj içerik placeholder */}
        <div className={styles.messageContent}>
          <div className={styles.messageLine}></div>
          <div className={`${styles.messageLine} ${styles.shortLine}`}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
