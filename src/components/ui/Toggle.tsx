import { useApp } from '../../context/AppContext';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  const { themeColor } = useApp();
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? 'bg-opacity-100' : 'bg-white/10'}`}
        style={{ backgroundColor: checked ? themeColor : undefined }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
