import { useRef } from 'react';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';

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
      <button
        onClick={onDownloadTemplate}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200"
        title="Download Template Excel yang Terkunci"
      >
        <Download className="w-3.5 h-3.5" />
        Template
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors border border-emerald-200"
      >
        <Upload className="w-3.5 h-3.5" />
        Import
      </button>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <button
        onClick={onExportData}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-blue-200"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Export
      </button>
    </div>
  );
};
