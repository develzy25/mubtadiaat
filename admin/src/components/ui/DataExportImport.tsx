import { useRef, useState, useEffect } from 'react';
import { Download, Upload, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataExportImportProps {
  onDownloadTemplate: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  isLoading?: boolean;
}

export const DataExportImport = ({ 
  onDownloadTemplate, 
  onExportData, 
  onImportData, 
  isLoading 
}: DataExportImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors border border-emerald-200"
        >
          <Upload className="w-3.5 h-3.5" />
          Import
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-1.5 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50"
            >
              <div className="p-1.5">
                <button
                  onClick={() => { setIsOpen(false); onDownloadTemplate(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-lg transition-colors text-left"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
                <button
                  onClick={() => { setIsOpen(false); fileInputRef.current?.click(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/80 rounded-lg transition-colors text-left mt-0.5"
                >
                  <Upload className="w-4 h-4" />
                  Import Data Excel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>

      <button
        onClick={onExportData}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors border border-indigo-200"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Export
      </button>
    </div>
  );
};

