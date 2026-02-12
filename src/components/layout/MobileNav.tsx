import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Film, Tv } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: 'الرئيسية' },
  { to: '/search?type=movie', icon: Film, label: 'أفلام' },
  { to: '/search?type=tv', icon: Tv, label: 'مسلسلات' },
  { to: '/search', icon: Search, label: 'بحث' },
];

const MobileNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 glass-strong md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const isActive = pathname === tab.to || (tab.to === '/' && pathname === '/');
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
