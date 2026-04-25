import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, color = '#00d4ff', size = 'sm' }: BadgeProps) {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${padding}`}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  );
}
