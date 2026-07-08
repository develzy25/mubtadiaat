import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/cn';

export interface PremiumSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
}

export const PremiumSelect = React.forwardRef<HTMLSelectElement, PremiumSelectProps>(
  ({ className, label, error, children, id, value, onChange, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
    
    // Parse children to options
    const options = React.Children.toArray(children)
      .filter((child): child is React.ReactElement => React.isValidElement(child) && child.type === 'option')
      .map(child => ({
        value: (child as React.ReactElement<any>).props.value,
        label: (child as React.ReactElement<any>).props.children,
        disabled: (child as React.ReactElement<any>).props.disabled
      }));

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    const updateDropdownPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate whether to drop down or drop up based on screen space
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = Math.min(options.length * 40 + 20, 250); // estimate height
        
        let top = rect.bottom + 8;
        // If not enough space below AND enough space above, drop UP
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          top = rect.top - dropdownHeight - 8;
        }

        setDropdownStyles({
          position: 'fixed',
          top: top,
          left: rect.left,
          width: rect.width,
          zIndex: 99999
        });
      }
    };

    useEffect(() => {
      if (isOpen) {
        updateDropdownPosition();
        window.addEventListener('scroll', updateDropdownPosition, true);
        window.addEventListener('resize', updateDropdownPosition);
      }
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          const target = e.target as Element;
          if (!target.closest('[data-select-dropdown]')) {
            setIsOpen(false);
          }
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string | number | readonly string[] | undefined) => {
      if (onChange) {
        const fakeEvent = {
          target: { name: props.name, value: val },
          currentTarget: { name: props.name, value: val }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(fakeEvent);
      }
      setIsOpen(false);
    };
    
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substring(7));

    return (
      <div className="w-full relative flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              isOpen ? "text-blue-600" : "text-slate-600",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        
        <select 
          ref={ref} 
          id={inputId} 
          className="hidden" 
          value={value} 
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full neumorph-pressed rounded-xl px-4 py-3 flex items-center justify-between text-left",
            "transition-all duration-300 outline-none",
            isOpen && "ring-2 ring-blue-300/30",
            disabled && "opacity-60 cursor-not-allowed",
            error && "border-red-300 focus:border-red-400 ring-red-100",
            className
          )}
        >
          <span className={cn("truncate text-sm", !selectedOption && "text-slate-400", selectedOption && "text-slate-800")}>
            {selectedOption ? selectedOption.label : 'Select...'}
          </span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>

        {error && (
          <span className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}

        {createPortal(
          <AnimatePresence>
            {isOpen && (
              <div 
                data-select-dropdown 
                style={dropdownStyles} 
                className="z-99999 pointer-events-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{ maxHeight: Math.min(options.length * 40 + 20, 250) }}
                  className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
                    {options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => handleSelect(opt.value)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between group",
                          opt.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50/80 cursor-pointer",
                          String(opt.value) === String(value) ? "bg-blue-100/50 text-blue-700 font-bold shadow-sm" : "text-slate-700"
                        )}
                      >
                        <span className="truncate pr-2">{opt.label}</span>
                        {String(opt.value) === String(value) && (
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    );
  }
);
PremiumSelect.displayName = 'PremiumSelect';
