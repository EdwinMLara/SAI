import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from '@context/Auth.context';
import { Theme } from './context/Theme.context';

/* ------------------ Code ------------------ */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Theme>
          <AppRoutes />
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
