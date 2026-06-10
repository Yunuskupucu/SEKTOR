import styles from './MessageSkeleton.module.scss';

const MessageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.contentWrapper}>

        <div className={styles.nameSkeleton}></div>


        <div className={styles.messageContent}>
          <div className={styles.messageLine}></div>
          <div className={`${styles.messageLine} ${styles.shortLine}`}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
