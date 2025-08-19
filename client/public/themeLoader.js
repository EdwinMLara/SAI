function applyTheme() {
  const storedTheme = localStorage.getItem('theme');

  if (!storedTheme) {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }
}

applyTheme();
