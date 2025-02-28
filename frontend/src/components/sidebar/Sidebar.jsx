import { useState } from 'react';
import PropTypes from 'prop-types';
import Channels from './Channels';
import SearchInput from './SearchInput';
import '../../styles/SearchInput.module.scss';
import styles from '../../styles/Sidebar.module.scss';
import JSPng from '../../assets/channels/javascript.png';
import PythonPng from '../../assets/channels/python.png';
import JavaPng from '../../assets/channels/java.png';
import HomePng from '../../assets/channels/home.png';
import SwiftPng from '../../assets/channels/swift.png';
import SqlPng from '../../assets/channels/sql.png';
import CppPng from '../../assets/channels/cpp.png';
import CsPng from '../../assets/channels/cs.png';
import CodePng from '../../assets/channels/code.png';
import JobPng from '../../assets/channels/job.png';

const channelsData = [
  { id: 1, name: 'JavaScript', channelPic: JSPng },
  { id: 2, name: 'HTML / CSS', channelPic: CodePng },
  { id: 3, name: 'Python', channelPic: PythonPng },
  { id: 4, name: 'Java', channelPic: JavaPng },
  { id: 5, name: 'Swift', channelPic: SwiftPng },
  { id: 6, name: 'C#', channelPic: CsPng },
  { id: 7, name: 'C++', channelPic: CppPng },
  { id: 8, name: 'SQL', channelPic: SqlPng },
  { id: 9, name: 'İş İlanları', channelPic: JobPng },
  { id: 10, name: 'Genel', channelPic: HomePng },
];

const Sidebar = ({ selectedChannel, setSelectedChannel }) => {
  const [filteredChannels, setFilteredChannels] = useState(channelsData);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredChannels(channelsData);
      return;
    }

    const filtered = channelsData.filter((channel) => {
      const channelNameSorted = channel.name
        .toLowerCase()
        .split('')
        .sort()
        .join('');
      const searchTermSorted = searchTerm
        .toLowerCase()
        .split('')
        .sort()
        .join('');

      return channelNameSorted.includes(searchTermSorted);
    });

    setFilteredChannels(filtered);
  };

  return (
    <div className={styles.sidebar}>
      <SearchInput onSearch={handleSearch} />
      <Channels
        channels={filteredChannels}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />
    </div>
  );
};

Sidebar.propTypes = {
  selectedChannel: PropTypes.object,
  setSelectedChannel: PropTypes.func.isRequired,
};

export default Sidebar;
