export function PreferencesScript() {
  const script = `
(function() {
  try {
    var theme = localStorage.getItem('cms-theme') || 'system';
    var locale = localStorage.getItem('cms-locale') || 'vi';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
    root.dataset.theme = isDark ? 'dark' : 'light';
    root.lang = locale === 'en' ? 'en' : 'vi';
  } catch (e) {}
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
