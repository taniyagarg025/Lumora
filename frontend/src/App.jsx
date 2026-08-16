import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { AppRouter } from './router/AppRouter';
import { TrendingPopup } from './components/common/TrendingPopup';
import { DailySparkBee } from './components/spark/DailySparkBee';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen font-sans relative">
              <Navbar />
              <main className="flex-1 overflow-x-hidden pt-[53px]">
                <AppRouter />
              </main>
              
              {/* Bottom-Right Top 10 Trending Headlines Popup */}
              <TrendingPopup />
              
              {/* Daily Spark Honeybee Feature */}
              <DailySparkBee />

              <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="font-medium">© {new Date().getFullYear()} ReadWise AI. All rights reserved.</p>
                  <p className="flex items-center gap-1 font-medium">
                    Built with Spring Boot 3, React, Tailwind CSS & Google Gemini AI
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
