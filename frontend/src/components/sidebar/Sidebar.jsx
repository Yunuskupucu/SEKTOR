import { useState, useEffect } from 'react';
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
import { useTheme } from '../../context/useTheme';

const Sidebar = ({ selectedChannel, setSelectedChannel }) => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetch('http://localhost:5001/api/channels')
      .then((res) => res.json())
      .then((data) => {
        const channelImages = {
          JavaScript: JSPng,
          'HTML / CSS': CodePng,
          Python: PythonPng,
          Java: JavaPng,
          Swift: SwiftPng,
          'C#': CsPng,
          'C++': CppPng,
          SQL: SqlPng,
          'İş İlanları': JobPng,
          Genel: HomePng,
        };

        const enriched = data.map((ch) => ({
          ...ch,
          channelPic: channelImages[ch.name] || HomePng,
        }));

        setChannels(enriched);
        setFilteredChannels(enriched);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) return setFilteredChannels(channels);

    const filtered = channels.filter((channel) =>
      channel.name
        .toLocaleLowerCase('tr')
        .includes(searchTerm.toLocaleLowerCase('tr'))
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
