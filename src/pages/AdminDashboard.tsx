import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LogOut, Film, Tv, Users, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // التأكد إن فيه حد مسجل دخول
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
      else setUser(session.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* الشريط العلوي */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-500 flex items-center gap-2">
          <Activity /> Cinema Control Panel
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full text-red-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* كروت الإحصائيات (هنملاها داتا حقيقية بعدين) */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <Film className="mb-4 text-blue-400" />
            <h3 className="text-gray-400 text-sm">عدد الأفلام</h3>
            <p className="text-3xl font-bold">...</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <Tv className="mb-4 text-purple-400" />
            <h3 className="text-gray-400 text-sm">عدد المسلسلات</h3>
            <p className="text-3xl font-bold">...</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <Users className="mb-4 text-green-400" />
            <h3 className="text-gray-400 text-sm">الزوار اليوم</h3>
            <p className="text-3xl font-bold">...</p>
          </div>
        </div>

        {/* منطقة العمليات */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-500">
          هنا ستظهر جداول التحكم (قريباً)...
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
