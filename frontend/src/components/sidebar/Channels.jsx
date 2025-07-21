import PropTypes from 'prop-types';
import styles from '../../styles/Sidebar.module.scss';
import { useTheme } from '../../context/useTheme';

const Channels = ({ channels, selectedChannel, setSelectedChannel }) => {
  const { theme } = useTheme();

  const themeClass = theme === 'dark' ? styles.dark : '';

  return (
    <div className={`${styles.channelsContainer} ${themeClass}`}>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`${styles.channelItem} ${
            selectedChannel?.id === channel.id ? styles.selected : ''
          } ${theme === 'dark' ? styles.darkChannelItem : ''}`}
          onClick={() => {
            const selectedChannelData = channels.find(
              (c) => c.id === channel.id
            );
            setSelectedChannel(selectedChannelData);
          }}
        >
          <div className={styles.avatar}>
            <img src={channel.channelPic} alt={channel.name} />
          </div>
          <div className={styles.channelInfo}>
            <div className={styles.channelName}>{channel.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

Channels.propTypes = {
  channels: PropTypes.array.isRequired,
  selectedChannel: PropTypes.object,
  setSelectedChannel: PropTypes.func.isRequired,
};

export default Channels;
