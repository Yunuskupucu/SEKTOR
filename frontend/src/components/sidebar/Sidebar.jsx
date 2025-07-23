import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Channels from './Channels';
import SearchInput from './SearchInput';
import styles from '../../styles/Sidebar.module.scss';
import { RiJavascriptFill } from 'react-icons/ri';
import { FaPython } from 'react-icons/fa';
import { FaJava } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import { FaSwift } from 'react-icons/fa';
import { FaDatabase } from 'react-icons/fa6';
import { TbBrandCpp } from 'react-icons/tb';
import { TbBrandCSharp } from 'react-icons/tb';
import { FaCode } from 'react-icons/fa6';
import { MdBusinessCenter } from 'react-icons/md';

import { useTheme } from '../../context/useTheme';

const Sidebar = ({ selectedChannel, setSelectedChannel }) => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetch('http://localhost:5001/api/channels')
      .then((res) => res.json())
      .then((data) => {
        const channelIcons = {
          JavaScript: <RiJavascriptFill className={styles.icon} />,
          Python: <FaPython className={styles.icon} />,
          Java: <FaJava className={styles.icon} />,
          Swift: <FaSwift className={styles.icon} />,
          SQL: <FaDatabase className={styles.icon} />,
          'C++': <TbBrandCpp className={styles.icon} />,
          'C#': <TbBrandCSharp className={styles.icon} />,
          'HTML / CSS': <FaCode className={styles.icon} />,
          'İş İlanları': <MdBusinessCenter className={styles.icon} />,
          Genel: <FaHome className={styles.icon} />,
        };

        const enriched = data.map((ch) => ({
          ...ch,
          channelIcon: channelIcons[ch.name] || (
            <FaHome className={styles.icon} />
          ),
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
