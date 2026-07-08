import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = ({ children, className = '', ...props }: TableProps) => (
  <div className="overflow-x-auto w-full custom-scrollbar rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-sm">
    <table className={`w-full text-left border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export interface TheadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Thead = ({ children, className = '', ...props }: TheadProps) => (
  <thead className={`bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/80 sticky top-0 z-10 ${className}`} {...props}>
    {children}
  </thead>
);

export interface TbodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Tbody = ({ children, className = '', ...props }: TbodyProps) => (
  <tbody className={`divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white ${className}`} {...props}>
    {children}
  </tbody>
);

export interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  onClick?: () => void;
}

export const Tr = ({ children, className = '', onClick, ...props }: TrProps) => (
  <tr 
    onClick={onClick}
    className={`hover:bg-slate-50/70 transition-colors duration-200 group ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const Th = ({ children, className = '', ...props }: ThProps) => (
  <th className={`px-5 py-3.5 whitespace-nowrap border-b border-slate-200/80 ${className}`} {...props}>
    {children}
  </th>
);

export interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Td = ({ children, className = '', ...props }: TdProps) => (
  <td className={`px-5 py-3 whitespace-nowrap align-middle ${className}`} {...props}>
    {children}
  </td>
);
