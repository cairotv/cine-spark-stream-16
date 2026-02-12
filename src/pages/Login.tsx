import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('بيانات الدخول خاطئة يا ريس!');
    } else {
      navigate('/admin'); // لو صح، حولني للوحة التحكم
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-600/20 rounded-full border border-red-600/50">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-8">غرفة التحكم السرية</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
