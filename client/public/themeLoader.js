// Script para aplicar el tema antes de que se renderice la aplicación
function applyTheme() {
  // Obtener el tema del localStorage
  const storedTheme = localStorage.getItem('theme');

  // Verificar la preferencia del sistema si no hay tema guardado
  if (!storedTheme) {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  } else {
    // Aplicar tema guardado
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }
}

// Ejecutar inmediatamente para aplicar el tema antes de que se renderice la aplicación
applyTheme();
