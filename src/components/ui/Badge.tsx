import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md';
}

const variantMap = {
  primary: 'bg-primary-500/15 text-primary-300 border-primary-500/20',
  secondary: 'bg-secondary-500/15 text-secondary-300 border-secondary-500/20',
  accent: 'bg-accent-500/15 text-accent-300 border-accent-500/20',
  success: 'bg-green-500/15 text-green-300 border-green-500/20',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  error: 'bg-red-500/15 text-red-300 border-red-500/20',
  ghost: 'bg-white/5 text-dark-300 border-white/10',
};

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-3 py-1',
};

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantMap[variant]} ${sizeMap[size]}`}>
      {children}
    </span>
  );
}
