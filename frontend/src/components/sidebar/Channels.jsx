import '../../styles/Channels.scss';

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
              <img src={channel.channelPic} alt="user avatar" />
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

export default Channels;
