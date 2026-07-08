import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

export interface ExcelColumnConfig {
  key: string;
  header: string;
  width?: number;
  type?: 'text' | 'number' | 'date' | 'boolean';
  required?: boolean;
  example?: string;
  note?: string;
}

/**
 * Generate a locked Excel template for importing data.
 * Adheres strictly to project rules (locked header row, comments/notes for instructions).
 */
export const generateExcelTemplate = async (
  columns: ExcelColumnConfig[],
  fileName: string,
  sheetName: string = 'Template'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Set columns
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 25
  }));

  // Protect the worksheet
  await worksheet.protect('mubtadiat-template', {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    insertRows: true,
    deleteRows: true,
  });

  // Lock and style header row (row 1)
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  
  headerRow.eachCell((cell, colNumber) => {
    const config = columns[colNumber - 1];
    
    cell.protection = { locked: true };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add note/comment based on column config
    let noteText = '';
    noteText += `Tipe: ${config.type === 'number' ? 'Angka' : config.type === 'date' ? 'Tanggal' : 'Teks'} | Wajib: ${config.required ? 'Ya' : 'Tidak'}\n`;
    if (config.example) noteText += `Contoh: ${config.example}\n`;
    if (config.note) noteText += `Catatan: ${config.note}`;

    cell.note = {
      texts: [
        { font: { bold: true, size: 10 }, text: `${config.header}\n` },
        { font: { size: 9 }, text: noteText }
      ]
    };
  });

  // Unlock data cells (row 2 to 1000)
  for (let rowNum = 2; rowNum <= 1000; rowNum++) {
    const row = worksheet.getRow(rowNum);
    columns.forEach((_, index) => {
      const cell = row.getCell(index + 1);
      cell.protection = { locked: false };
    });
  }

  // Generate file and download
  const buffer = await workbook.xlsx.writeBuffer();
  downloadFile(buffer, fileName);
};

/**
 * Export existing data to Excel
 */
export const exportToExcel = async (
  data: any[],
  columns: ExcelColumnConfig[],
  fileName: string,
  sheetName: string = 'Data'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 25
  }));

  // Style header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Add data
  data.forEach(item => {
    const rowData: any = {};
    columns.forEach(col => {
      rowData[col.key] = item[col.key];
    });
    worksheet.addRow(rowData);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadFile(buffer, fileName);
};

/**
 * Parse uploaded Excel file to JSON using xlsx for speed
 */
export const parseExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const json = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

const downloadFile = (buffer: ArrayBuffer, fileName: string) => {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
