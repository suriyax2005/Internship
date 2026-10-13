import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';

export const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SocketProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0f172a',
                  color: '#fff',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '13px',
                },
              }}
            />
            <AppRoutes />
          </BrowserRouter>
        </SocketProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
