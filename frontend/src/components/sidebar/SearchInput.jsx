import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from '../../styles/SearchInput.module.scss';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ conversations, setSelectedConversation }) => {
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      alert('Search query must be at least 3 characters long');
      return;
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch('');
    } else {
      alert('No such channel found!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          <FaSearch className={styles.icon} />
        </button>
      </div>
    </form>
  );
};

SearchInput.propTypes = {
  conversations: PropTypes.array.isRequired,
  setSelectedConversation: PropTypes.func.isRequired,
};

export default SearchInput;
