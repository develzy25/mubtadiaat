import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface PremiumButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = 'primary', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden";
    
    const variants = {
      primary: "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_25px_rgba(37,99,235,0.4)] focus:ring-blue-500 border border-blue-400/50",
      secondary: "neumorph text-slate-700 hover:shadow-neu-floating focus:ring-slate-200",
      danger: "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_25px_rgba(239,68,68,0.4)] focus:ring-red-500 border border-red-400/50",
      ghost: "bg-transparent text-slate-600 hover:neumorph focus:ring-slate-200",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], (disabled || isLoading) && "opacity-70 cursor-not-allowed", className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {!isLoading && leftIcon ? leftIcon : null}
        <span className="truncate">{children as React.ReactNode}</span>
        {!isLoading && rightIcon ? rightIcon : null}
        
        {/* Ripple/Glow effect overlay */}
        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-10 transition-opacity duration-300" />
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';
