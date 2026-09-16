
import React from'react';
import ReactDOM from'react-dom/client';
import App from'./App.jsx';
import'./index.css';
import'./i18n';
import { QueryClient, QueryClientProvider } from'@tanstack/react-query';
import { ErrorBoundary } from'./components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Prevents refetching on window focus
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);