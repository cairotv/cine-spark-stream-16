import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Index from '@/pages/Index';
import MovieDetails from '@/pages/MovieDetails';
import SeriesDetails from '@/pages/SeriesDetails';
import Watch from '@/pages/Watch';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } }
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div dir="rtl">
            <Toaster position="top-center" richColors />
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/series/:id" element={<SeriesDetails />} />
                <Route path="/watch/movie/:id" element={<Watch type="movie" />} />
                <Route path="/watch/tv/:id" element={<Watch type="tv" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNav />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;