import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login');
      else setUser(data.user);
    });
  }, [navigate]);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: async () => {
      const { data } = await supabase.from('movies').select('*').order('id', { ascending: false });
      return data;
    },
    enabled: !!user
  });

  const updateMovie = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const { error } = await supabase.from('movies').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      toast.success('تم التحديث');
    }
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 rtl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">🚀 God Mode - لوحة التحكم</h1>
      
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="text-sm text-gray-400">إجمالي الأفلام</div>
          <div className="text-2xl font-bold">{movies?.length || 0}</div>
        </div>
        {/* يمكن إضافة المزيد من الإحصائيات */}
      </div>

      {/* جدول المحتوى */}
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">العنوان</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">ملخص AI</th>
                <th className="px-4 py-3">رابط مخصص</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8">جاري التحميل...</td></tr>
              ) : (
                movies?.map((movie: any) => (
                  <tr key={movie.id} className="border-b border-zinc-800">
                    <td className="px-4 py-3">{movie.id}</td>
                    <td className="px-4 py-3">{movie.title}</td>
                    <td className="px-4 py-3">
                      <select
                        value={movie.rating_color || 'yellow'}
                        onChange={(e) => updateMovie.mutate({
                          id: movie.id,
                          updates: { rating_color: e.target.value }
                        })}
                        className={`px-2 py-1 rounded text-sm ${
                          movie.rating_color === 'green' ? 'bg-green-600' :
                          movie.rating_color === 'red' ? 'bg-red-600' : 'bg-yellow-600'
                        }`}
                      >
                        <option value="green">🟢 عائلي</option>
                        <option value="yellow">🟡 إشراف</option>
                        <option value="red">🔴 ناضجين</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={movie.ai_summary || ''}
                        onBlur={(e) => updateMovie.mutate({
                          id: movie.id,
                          updates: { ai_summary: e.target.value }
                        })}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        placeholder="ملخص AI"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={movie.custom_embed_url || ''}
                        onBlur={(e) => updateMovie.mutate({
                          id: movie.id,
                          updates: { custom_embed_url: e.target.value }
                        })}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        placeholder="رابط التضمين المخصص"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {/* حذف */}}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}