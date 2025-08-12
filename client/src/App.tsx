import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from '@context/Auth.context';
import { Theme } from './context/Theme.context';
import { SidebarProvider } from '@context/Sidebar.context';

/* ------------------ Code ------------------ */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <Theme>
            <AppRoutes />
          </Theme>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
