import PropTypes from 'prop-types';
import '../../styles/Sidebar.scss';

const Channels = ({ channels, selectedChannel, setSelectedChannel }) => {
  return (
    <div className="channels-container">
      {channels.map((channel) => (
        <div key={channel.id}>
          <div
            className={`channel-item ${
              selectedChannel === channel.id ? 'selected' : ''
            }`}
            onClick={() => setSelectedChannel(channel.id)}
          >
            <div className="avatar">
              <img src={channel.channelPic} alt="channel avatar" />
            </div>
            <div className="channel-info">
              <p className="channel-name">{channel.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Channels.propTypes = {
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      channelPic: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedChannel: PropTypes.number,
  setSelectedChannel: PropTypes.func.isRequired,
};

export default Channels;
