import { useState } from 'react';
import PropTypes from 'prop-types';
import Channels from './Channels';
import SearchInput from './SearchInput';
import styles from '../../styles/Sidebar.module.scss';
import JSPng from '../../assets/channels/javascript.png';
import PythonPng from '../../assets/channels/python.png';
import JavaPng from '../../assets/channels/java.png';
import AiPng from '../../assets/channels/ai.png';
import SwiftPng from '../../assets/channels/swift.png';
import SqlPng from '../../assets/channels/database.svg';
import CppPng from '../../assets/channels/cpp.png';
import CsPng from '../../assets/channels/cs.png';
import HtmlSvg from '../../assets/channels/html.svg';
import JobPng from '../../assets/channels/job.png';
import DevOpsPng from '../../assets/channels/devops.png';
import HomeSvg from '../../assets/channels/home.svg';
import { useTheme } from '../../context/useTheme';

const channelsData = [
  {
    id: 1,
    name: 'JavaScript',
    channelPic: JSPng,
    type: 'chat',
    summary:
      'Modern web ve Node.js ekosisteminde JS/TS, çerçeveler ve araçlar hakkında paylaşım ve soru-cevap.',
  },
  {
    id: 2,
    name: 'HTML / CSS',
    channelPic: HtmlSvg,
    type: 'chat',
    summary:
      'Arayüz yapısı, stiller, erişilebilirlik ve duyarlı tasarım konularında pratik tartışmalar.',
  },
  {
    id: 3,
    name: 'Python',
    channelPic: PythonPng,
    type: 'chat',
    summary: 'Veri bilimi, otomasyon, backend ve genel Python geliştirme ipuçları için ortak alan.',
  },
  {
    id: 4,
    name: 'Java',
    channelPic: JavaPng,
    type: 'chat',
    summary: 'JVM, Spring benzeri ekosistem ve kurumsal uygulama geliştirme ile ilgili kanal.',
  },
  {
    id: 5,
    name: 'Swift',
    channelPic: SwiftPng,
    type: 'chat',
    summary: 'iOS, macOS ve Swift diline dair sorular, haberler ve kod örnekleri.',
  },
  {
    id: 6,
    name: 'C#',
    channelPic: CsPng,
    type: 'chat',
    summary: '.NET ve C# ile masaüstü, web ve oyun tarafı geliştirme konuşmaları.',
  },
  {
    id: 7,
    name: 'C++',
    channelPic: CppPng,
    type: 'chat',
    summary: 'Performans, bellek yönetimi ve sistem programlama odaklı C++ tartışmaları.',
  },
  {
    id: 8,
    name: 'SQL',
    channelPic: SqlPng,
    type: 'chat',
    summary: 'Sorgular, şema tasarımı ve veritabanı motorları hakkında teknik paylaşımlar.',
  },
  {
    id: 10,
    name: 'Yapay Zekâ',
    channelPic: AiPng,
    type: 'chat',
    summary:
      'LLM’ler, modelleme ve üretken yapay zekâ araçlarının geliştirici perspektifinden kullanımı.',
  },
  {
    id: 21,
    name: 'DevOps',
    channelPic: DevOpsPng,
    type: 'chat',
    imageClassName: 'avatarImageContainSmall',
    summary: 'CI/CD, konteynerler, gözlemlenebilirlik ve altyapı otomasyonu pratikleri.',
  },
  {
    id: 9,
    name: 'İş İlanları',
    channelPic: JobPng,
    type: 'jobs',
    summary:
      'Yazılım ve teknoloji alanındaki ilanların listelendiği kanal; ilan detayları kartlarda yer alır.',
  },
  {
    id: 22,
    name: 'Genel',
    channelPic: HomeSvg,
    type: 'chat',
    summary: 'Platform üzerindeki genel sohbet ve tartışma kanalı.',
  },
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
