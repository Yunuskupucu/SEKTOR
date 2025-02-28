import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/SearchInput.module.scss';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Kanal Ara..."
          className={styles.input}
          value={search}
          onChange={handleChange}
        />
        <button type="submit" className={styles.button}>
          <FaSearch className={styles.icon} />
        </button>
      </div>
    </form>
  );
};

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchInput;
