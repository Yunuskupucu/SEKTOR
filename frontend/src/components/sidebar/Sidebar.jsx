import PropTypes from 'prop-types';
import Channels from './Channels';
import SearchInput from './SearchInput';
import '../../styles/SearchInput.scss';
import '../../styles/Sidebar.scss';
import JSPng from '../../assets/javascript.png';
import PythonPng from '../../assets/python.png';
import JavaPng from '../../assets/java.png';
import HomePng from '../../assets/home.png';
import SwiftPng from '../../assets/swift.png';
import SqlPng from '../../assets/sql.png';
import CppPng from '../../assets/cpp.png';
import CsPng from '../../assets/cs.png';
import CodePng from '../../assets/code.png';
import JobPng from '../../assets/job.png';

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

const Sidebar = ({ setSelectedChannel }) => {
  return (
    <div className="sidebar">
      <SearchInput />
      <Channels
        channels={channelsData}
        setSelectedChannel={(id) => {
          const channel = channelsData.find((channel) => channel.id === id);
          setSelectedChannel(channel); // Seçilen kanalı nesne olarak güncelledik
        }}
      />
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedChannel: PropTypes.func.isRequired,
};

export default Sidebar;
