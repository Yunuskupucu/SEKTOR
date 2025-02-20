import PropTypes from 'prop-types';
import '../../styles/Sidebar.scss';

const Channels = ({ channels, setSelectedChannel, selectedChannel }) => {
  return (
    <div className="channels-container">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`channel-item ${
            selectedChannel?.id === channel.id ? 'selected' : ''
          }`}
          onClick={() => setSelectedChannel(channel.id)}
        >
          <div className="avatar">
            <img src={channel.channelPic} alt={`${channel.name} avatar`} />
          </div>
          <div className="channel-info">
            <p className="channel-name">{channel.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// PropTypes güncellendi
Channels.propTypes = {
  channels: PropTypes.array.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  selectedChannel: PropTypes.object,
};

export default Channels;
