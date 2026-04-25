import { useApp } from '../../context/AppContext';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({ value, max = 100, color, height = 6, showLabel = false, animated = true }: ProgressBarProps) {
  const { themeColor } = useApp();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color || themeColor;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full bg-white/10 overflow-hidden"
        style={{ height }}
      >
        <div
          className={`h-full rounded-full ${animated ? 'transition-all duration-700' : ''}`}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}66`,
          }}
        />
      </div>
    </div>
  );
}
