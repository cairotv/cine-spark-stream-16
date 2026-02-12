import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-strong">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient-gold hidden sm:block">
            أونلاين سينما
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">الرئيسية</Link>
          <Link to="/search?type=movie" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">أفلام</Link>
          <Link to="/search?type=tv" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">مسلسلات</Link>
        </nav>

        {/* Search */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث عن فيلم أو مسلسل..."
                  className="w-full h-9 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none"
                />
              </motion.form>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground/70 hover:text-primary hover:bg-secondary transition-colors"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
