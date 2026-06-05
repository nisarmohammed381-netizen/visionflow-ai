import { ReactNode } from 'react';
import Sidebar from '../layout/Sidebar';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-w-0 ml-[72px] lg:ml-64 min-h-screen overflow-x-hidden"
      >
        {children}
      </motion.main>
    </div>
  );
}
