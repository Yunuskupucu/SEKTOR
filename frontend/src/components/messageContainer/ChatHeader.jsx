import PropTypes from 'prop-types';
import '../../styles/MessageContainer.scss';
const ChatHeader = ({ selectedChannel }) => {
  return (
    <div className="chatHeader">
      <h1>{selectedChannel?.name || 'Kanal Seçilmedi'}</h1>
    </div>
  );
};

ChatHeader.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

export default ChatHeader;
