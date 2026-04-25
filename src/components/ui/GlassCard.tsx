import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: string;
  delay?: number;
}

export function GlassCard({ children, className = '', hover = false, onClick, glow, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-panel rounded-2xl border border-white/10 ${hover ? 'cursor-pointer' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      onClick={onClick}
      style={glow ? { boxShadow: `0 0 20px ${glow}22, 0 0 40px ${glow}11` } : undefined}
    >
      {children}
    </motion.div>
  );
}
