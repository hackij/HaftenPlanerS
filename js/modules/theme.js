const STORAGE_KEY = 'haftenverlegeplan-theme';

export function initThemeToggle(toggle) {
  if (!toggle) return;

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ?? (preferredDark ? 'dark' : 'light');

  applyTheme(initialTheme, toggle);

  toggle.addEventListener('change', () => {
    const nextTheme = toggle.checked ? 'dark' : 'light';
    applyTheme(nextTheme, toggle);
  });
}

function applyTheme(theme, toggle) {
  document.body.dataset.theme = theme;
  document.body.classList.toggle('dark-mode', theme === 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
  toggle.checked = theme === 'dark';

  const label = toggle.closest('.theme-toggle')?.querySelector('.theme-toggle__label');
  if (label) {
    label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}
