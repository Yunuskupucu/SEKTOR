import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Temayı değiştir"
      title="Temayı değiştir"
    >
      {isDark ? (
        <Sun className="theme-toggle-btn__icon" aria-hidden />
      ) : (
        <Moon className="theme-toggle-btn__icon" aria-hidden />
      )}
    </button>
  );
}

export default ThemeToggleButton;
