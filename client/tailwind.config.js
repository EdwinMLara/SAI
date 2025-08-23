/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   darkMode: 'class',
   theme: {
      extend: {
         colors: {
            // === SISTEMA DE COLORES PRINCIPALES ===
            // Fondos y superficies (jerarquía)
            background: {
               primary: '#ffffff', // Fondo principal - muy claro
               secondary: '#f8fafc', // Fondo secundario - gris muy claro
               tertiary: '#f1f5f9', // Fondo terciario - gris claro
               accent: '#e2e8f0', // Fondo de acento - gris medio
               dark: {
                  primary: '#0f172a', // Fondo principal oscuro
                  secondary: '#1e293b', // Fondo secundario oscuro
                  tertiary: '#334155', // Fondo terciario oscuro
                  accent: '#475569', // Fondo de acento oscuro
               },
            },

            // Textos (jerarquía)
            text: {
               primary: '#0f172a', // Texto principal - muy oscuro
               secondary: '#475569', // Texto secundario - gris oscuro
               tertiary: '#64748b', // Texto terciario - gris medio
               muted: '#94a3b8', // Texto apagado - gris claro

               dark: {
                  primary: '#f8fafc', // Texto principal claro
                  secondary: '#cbd5e1', // Texto secundario claro
                  tertiary: '#94a3b8', // Texto terciario claro
                  muted: '#64748b', // Texto apagado claro
               },
            },

            // Bordes
            border: {
               light: '#e2e8f0', // Borde claro
               medium: '#cbd5e1', // Borde medio
               strong: '#94a3b8', // Borde fuerte
               dark: {
                  light: '#334155', // Borde claro oscuro
                  medium: '#475569', // Borde medio oscuro
                  strong: '#64748b', // Borde fuerte oscuro
               },
            },

            // Color de marca/brand
            brand: {
               50: '#eff6ff',
               100: '#dbeafe',
               200: '#bfdbfe',
               300: '#93c5fd',
               400: '#60a5fa',
               500: '#3b82f6', // Color principal
               600: '#2563eb',
               700: '#1d4ed8',
               800: '#1e40af',
               900: '#1e3a8a',
               dark: {
                  50: '#1e3a8a',
                  100: '#1e40af',
                  200: '#1d4ed8',
                  300: '#2563eb',
                  400: '#3b82f6',
                  500: '#4f89fc', // Color principal oscuro (más opaco)
                  600: '#60a5fa',
                  700: '#93c5fd',
                  800: '#bfdbfe',
                  900: '#dbeafe',
               },
            },

            // Estados
            success: {
               light: '#dcfce7', // Fondo success claro
               DEFAULT: '#16a34a', // Success principal
               dark: '#14532d', // Success oscuro
               'dark-light': '#1a2e05',
               'dark-DEFAULT': '#22c55e',
               'dark-dark': '#16a34a',
            },

            warning: {
               light: '#fef3c7',
               DEFAULT: '#f59e0b',
               dark: '#92400e',
               'dark-light': '#451a03',
               'dark-DEFAULT': '#fbbf24',
               'dark-dark': '#f59e0b',
            },

            error: {
               light: '#fee2e2',
               DEFAULT: '#dc2626',
               dark: '#991b1b',
               'dark-light': '#450a0a',
               'dark-DEFAULT': '#ef4444',
               'dark-dark': '#dc2626',
            },

            info: {
               light: '#dbeafe',
               DEFAULT: '#2563eb',
               dark: '#1e40af',
               'dark-light': '#1e3a8a',
               'dark-DEFAULT': '#3b82f6',
               'dark-dark': '#2563eb',
            },

            // === COLORES LLAMATIVOS PARA CARDS ESPECIALES ===
            vibrant: {
               purple: {
                  light: '#f3e8ff',
                  DEFAULT: '#8b5cf6',
                  dark: '#5b21b6',
                  'dark-light': '#2d1065',
                  'dark-DEFAULT': '#a855f7',
                  'dark-dark': '#7c3aed',
               },
               pink: {
                  light: '#fdf2f8',
                  DEFAULT: '#ec4899',
                  dark: '#be185d',
                  'dark-light': '#500724',
                  'dark-DEFAULT': '#f472b6',
                  'dark-dark': '#ec4899',
               },
               orange: {
                  light: '#fed7aa',
                  DEFAULT: '#f97316',
                  dark: '#c2410c',
                  'dark-light': '#431407',
                  'dark-DEFAULT': '#fb923c',
                  'dark-dark': '#f97316',
               },
               teal: {
                  light: '#ccfbf1',
                  DEFAULT: '#14b8a6',
                  dark: '#0f766e',
                  'dark-light': '#042f2e',
                  'dark-DEFAULT': '#2dd4bf',
                  'dark-dark': '#14b8a6',
               },
               indigo: {
                  light: '#e0e7ff',
                  DEFAULT: '#6366f1',
                  dark: '#4338ca',
                  'dark-light': '#1e1b4b',
                  'dark-DEFAULT': '#818cf8',
                  'dark-dark': '#6366f1',
               },
               emerald: {
                  light: '#d1fae5',
                  DEFAULT: '#10b981',
                  dark: '#047857',
                  'dark-light': '#022c22',
                  'dark-DEFAULT': '#34d399',
                  'dark-dark': '#10b981',
               },
               cyan: {
                  light: '#cffafe',
                  DEFAULT: '#06b6d4',
                  dark: '#0e7490',
                  'dark-light': '#083344',
                  'dark-DEFAULT': '#22d3ee',
                  'dark-dark': '#06b6d4',
               },
               rose: {
                  light: '#ffe4e6',
                  DEFAULT: '#f43f5e',
                  dark: '#be123c',
                  'dark-light': '#4c0519',
                  'dark-DEFAULT': '#fb7185',
                  'dark-dark': '#f43f5e',
               },
               amber: {
                  light: '#fef3c7',
                  DEFAULT: '#f59e0b',
                  dark: '#b45309',
                  'dark-light': '#451a03',
                  'dark-DEFAULT': '#fbbf24',
                  'dark-dark': '#f59e0b',
               },
               lime: {
                  light: '#ecfccb',
                  DEFAULT: '#65a30d',
                  dark: '#365314',
                  'dark-light': '#1a2e05',
                  'dark-DEFAULT': '#84cc16',
                  'dark-dark': '#65a30d',
               },
            },
         },

         // === TIPOGRAFÍAS ===
         fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            mono: [
               'JetBrains Mono',
               'Menlo',
               'Monaco',
               'Consolas',
               'Liberation Mono',
               'Courier New',
               'monospace',
            ], // Para números y códigos
            display: ['Inter', 'ui-sans-serif', 'system-ui'], // Para títulos
         },

         // === ESPACIADO Y DIMENSIONES ===
         spacing: {
            18: '4.5rem',
            88: '22rem',
            128: '32rem',
         },

         // === BORDES ===
         borderRadius: {
            sm: '0.25rem',
            DEFAULT: '0.375rem',
            md: '0.5rem',
            lg: '0.75rem',
            xl: '1rem',
            '2xl': '1.5rem',
            '3xl': '2rem',
            full: '9999px',
         },

         // === SOMBRAS ===
         boxShadow: {
            soft: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            medium:
               '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            strong:
               '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            intense: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            'dark-soft':
               '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
            'dark-medium':
               '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            'dark-strong':
               '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
            'dark-intense': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
         },

         // === ANIMACIONES ===
         transitionDuration: {
            400: '400ms',
            600: '600ms',
         },

         // === ANCHOS Y ALTURAS PERSONALIZADAS ===
         maxWidth: {
            '8xl': '88rem',
            '9xl': '96rem',
         },
      },
   },
   plugins: [],
};
