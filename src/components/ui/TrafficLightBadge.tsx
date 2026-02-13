interface Props {
  color: 'green' | 'yellow' | 'red';
}

export default function TrafficLightBadge({ color }: Props) {
  const config = {
    green: { bg: 'bg-green-500/20', text: 'text-green-400', label: '🟢 مشاهدة عائلية وآمنة' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '🟡 ينصح بإشراف عائلي' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', label: '🔴 دراما للناضجين (قصصي)' }
  };

  const style = config[color] || config.yellow;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}