import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="glass p-2 rounded-xl hover:scale-105 transition">
      <motion.div initial={{ rotate: 0 }} animate={{ rotate: theme === 'dark' ? 0 : 180 }}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </button>
  );
}