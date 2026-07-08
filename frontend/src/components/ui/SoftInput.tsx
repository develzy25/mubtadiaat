import React, { useState } from 'react';
import { cn } from '../../lib/cn';

export interface SoftInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const SoftInput = React.forwardRef<HTMLInputElement, SoftInputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substring(7));

    return (
      <div className="w-full relative flex flex-col gap-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              isFocused ? "text-blue-600" : "text-slate-600",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full neumorph-pressed rounded-xl px-4 py-3 text-slate-800",
              "transition-all duration-300 outline-none",
              "focus:ring-2 focus:ring-blue-300/30",
              "placeholder:text-slate-400 text-sm",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 focus:border-red-400 focus:ring-red-100",
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <span className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

SoftInput.displayName = 'SoftInput';
