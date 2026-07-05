import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/cn'; // reusing cn utility

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'neumorph' | 'glass';
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'neumorph', hoverEffect = false, children, ...props }, ref) => {
    const baseStyles = "rounded-3xl p-6 transition-all duration-300";
    
    const variants = {
      neumorph: "neumorph",
      glass: "glass",
      pressed: "neumorph-pressed"
    };

    const hoverStyles = hoverEffect && variant === 'neumorph' ? "hover:shadow-neu-floating hover:-translate-y-1" : "";

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children as React.ReactNode}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
