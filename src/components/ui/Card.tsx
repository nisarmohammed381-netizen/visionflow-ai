import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, glow = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`glass-card p-6 ${glow ? 'glow-border' : ''} ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'green';
}

export function StatCard({ icon, label, value, change, positive = true, color = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: 'from-primary-600/20 to-primary-500/10 border-primary-500/20',
    secondary: 'from-secondary-600/20 to-secondary-500/10 border-secondary-500/20',
    accent: 'from-accent-600/20 to-accent-500/10 border-accent-500/20',
    green: 'from-green-600/20 to-green-500/10 border-green-500/20',
  };

  const iconColorMap = {
    primary: 'bg-primary-500/20 text-primary-400',
    secondary: 'bg-secondary-500/20 text-secondary-400',
    accent: 'bg-accent-500/20 text-accent-400',
    green: 'bg-green-500/20 text-green-400',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-card p-5 bg-gradient-to-br ${colorMap[color]} border`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {positive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white font-poppins">{value}</p>
      <p className="text-dark-400 text-sm mt-1">{label}</p>
    </motion.div>
  );
}
