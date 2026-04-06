import * as XLSX from 'xlsx';

const IP_PATTERN = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

function findIpColumn(headers, rows) {
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i]).trim().toLowerCase();
    if (h.includes('ip') && (h.includes('address') || h === 'ip')) {
      return i;
    }
  }
  for (let i = 0; i < headers.length; i++) {
    const vals = rows.map(r => String(r[i] ?? '').trim()).filter(Boolean);
    if (vals.length === 0) continue;
    const matchCount = vals.filter(v => IP_PATTERN.test(v)).length;
    if (matchCount > 0 && matchCount / vals.length > 0.5) {
      return i;
    }
  }
  return -1;
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const results = [];

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          if (json.length < 2) continue;

          const headers = json[0];
          const rows = json.slice(1);
          const ipColIdx = findIpColumn(headers, rows);

          if (ipColIdx === -1) continue;

          const ips = rows
            .map(r => String(r[ipColIdx] ?? '').trim())
            .filter(ip => ip && ip.toLowerCase() !== 'nan' && ip !== '');

          if (ips.length === 0) continue;

          results.push({
            sheetName,
            columnName: String(headers[ipColIdx]),
            ips,
          });
        }

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
