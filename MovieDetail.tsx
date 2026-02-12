// دالة لتحديد النصوص والألوان بناءً على لون اللمبة
const getRatingBadge = (color) => {
  switch (color) {
    case 'green':
      return {
        text: 'عائلي',
        style: 'bg-green-500/10 text-green-400 border-green-500/20',
        dot: 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]'
      };
    case 'yellow':
      return {
        text: 'شبابي',
        style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        dot: 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
      };
    case 'red':
      return {
        text: 'للكبار', // وصف محترم جداً
        style: 'bg-red-500/10 text-red-400 border-red-500/20',
        dot: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
      };
    default:
      return {
        text: 'تصنيف عام',
        style: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        dot: 'bg-gray-500'
      };
  }
};

// ... داخل دالة العرض (Render) ...

const badge = getRatingBadge(movie.rating_color);

return (
  <div className="flex items-center gap-4 mb-6">
    
    {/* ... باقي العناصر زي السنة والتقييم ... */}

    {/* 🚦 كبسولة التصنيف الجديدة */}
    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${badge.style} backdrop-blur-md transition-all hover:scale-105 cursor-help`}>
      
      {/* اللمبة المضيئة (Pulse Effect) */}
      <div className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot.split(' ')[0]}`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${badge.dot}`}></span>
      </div>

      {/* النص الدبلوماسي */}
      <span className="text-sm font-bold tracking-wide">
        {badge.text}
      </span>

    </div>
  </div>
);
