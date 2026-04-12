import { useState } from 'react';
import PropTypes from 'prop-types';
import Channels from './Channels';
import SearchInput from './SearchInput';
import styles from '../../styles/Sidebar.module.scss';
import JSPng from '../../assets/channels/javascript.png';
import PythonPng from '../../assets/channels/python.png';
import JavaPng from '../../assets/channels/java.png';
import HomePng from '../../assets/channels/home.png';
import SwiftPng from '../../assets/channels/swift.png';
import SqlPng from '../../assets/channels/database.svg';
import CppPng from '../../assets/channels/cpp.png';
import CsPng from '../../assets/channels/cs.png';
import CodePng from '../../assets/channels/code.png';
import JobPng from '../../assets/channels/job.png';
import { useTheme } from '../../context/useTheme';

const channelsData = [
  { id: 1, name: 'JavaScript', channelPic: JSPng, type: 'chat' },
  { id: 2, name: 'HTML / CSS', channelPic: CodePng, type: 'chat' },
  { id: 3, name: 'Python', channelPic: PythonPng, type: 'chat' },
  { id: 4, name: 'Java', channelPic: JavaPng, type: 'chat' },
  { id: 5, name: 'Swift', channelPic: SwiftPng, type: 'chat' },
  { id: 6, name: 'C#', channelPic: CsPng, type: 'chat' },
  { id: 7, name: 'C++', channelPic: CppPng, type: 'chat' },
  { id: 8, name: 'SQL', channelPic: SqlPng, type: 'chat' },
  { id: 9, name: 'İş İlanları', channelPic: JobPng, type: 'jobs' },
  { id: 10, name: 'Genel', channelPic: HomePng, type: 'chat' },
];

const Sidebar = ({ selectedChannel, setSelectedChannel }) => {
  const [filteredChannels, setFilteredChannels] = useState(channelsData);
  const { theme } = useTheme();

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredChannels(channelsData);
      return;
    }

    const filtered = channelsData.filter((channel) =>
      channel.name.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
    );

    setFilteredChannels(filtered);
  };

  return (
    <div className={`${styles.sidebar} ${theme === 'dark' ? styles.dark : ''}`}>
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
