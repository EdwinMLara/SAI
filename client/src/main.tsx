import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import App from './App.tsx';
import '@config/axios.config.ts';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <App />
   </StrictMode>
);
