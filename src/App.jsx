import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import SheetCard from './components/SheetCard';
import SummaryBar from './components/SummaryBar';
import PreviewTable from './components/PreviewTable';
import Loader from './components/Loader';
import { parseExcelFile } from './utils/excelParser';
import { generateCSV, getPreviewRows } from './utils/csvGenerator';

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDT(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  const [y, m, d] = dateStr.split('-');
  const [h, min] = timeStr.split(':');
  return `${m}/${d}/${y} ${h}:${min}`;
}

function defaultEntry() {
  return {
    included: true,
    spoc: '',
    hasDowntime: false,
    downtimeStartDate: todayStr(),
    downtimeStartTime: '00:00',
    downtimeEndDate: todayStr(),
    downtimeEndTime: '04:30',
    downtimeStart: '',
    downtimeEnd: '',
  };
}

export default function App() {
  const [theme, setTheme] = useState('light');

  const [config, setConfig] = useState({
    bcrNumber: '',
    actStartDate: todayStr(),
    actStartTime: '23:00',
    actEndDate: todayStr(),
    actEndTime: '06:30',
  });

  const [parsedFiles, setParsedFiles] = useState([]);
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const handleFilesSelected = useCallback(async (files) => {
    setLoading(true);
    setCsvData(null);
    setPreviewRows([]);

    const allParsed = [];
    const newEntries = {};

    for (const file of files) {
      try {
        const sheets = await parseExcelFile(file);
        for (const sheet of sheets) {
          const key = `${file.name}__${sheet.sheetName}`;
          allParsed.push({ ...sheet, fileName: file.name, key });
          newEntries[key] = defaultEntry();
        }
      } catch {
        // skip unreadable files
      }
    }

    setParsedFiles(allParsed);
    setEntries(newEntries);
    setLoading(false);
  }, []);

  const handleEntryChange = useCallback((key, newEntry) => {
    setEntries((prev) => ({ ...prev, [key]: newEntry }));
    setCsvData(null);
    setPreviewRows([]);
  }, []);

  const activityStart = formatDT(config.actStartDate, config.actStartTime);
  const activityEnd = formatDT(config.actEndDate, config.actEndTime);

  const includedFiles = parsedFiles.filter((pf) => {
    const e = entries[pf.key] || defaultEntry();
    return e.included;
  });

  const allEntries = includedFiles.map((pf) => {
    const e = entries[pf.key] || defaultEntry();
    return {
      ips: pf.ips,
      spoc: e.spoc,
      downtimeStart: e.hasDowntime
        ? formatDT(e.downtimeStartDate, e.downtimeStartTime)
        : '',
      downtimeEnd: e.hasDowntime
        ? formatDT(e.downtimeEndDate, e.downtimeEndTime)
        : '',
    };
  });

  const totalIps = allEntries.reduce((sum, e) => sum + e.ips.length, 0);
  const allSpocsSet = allEntries.every((e) => e.spoc.trim() !== '');
  const canGenerate = config.bcrNumber && includedFiles.length > 0 && allSpocsSet && totalIps > 0;

  const handleGenerate = () => {
    const csv = generateCSV(allEntries, activityStart, activityEnd);
    const rows = getPreviewRows(allEntries, activityStart, activityEnd, 30);
    const total = allEntries.reduce((s, e) => s + e.ips.length, 0);
    setCsvData(csv);
    setPreviewRows(rows);
    setTotalRows(total);
  };

  const handleDownload = () => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bulk CI Template - ${config.bcrNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fileNames = [...new Set(parsedFiles.map((p) => p.fileName))];

  return (
    <div className={`app-layout ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar config={config} onChange={setConfig} />

      <main className="main-content">
        <div className="main-header">
          <div className="header-row">
            <div>
              <h1>Bulk CI CSV Generator</h1>
              <p>Upload MOP Excel files, configure SPOC and downtime per system, download the Bulk CI CSV.</p>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                </svg>
              )}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>

        <div className="step-section">
          <span className="step-badge">Step 1</span>
          <h2 className="step-title">Upload MOP Excel Files</h2>
          <FileUpload onFilesSelected={handleFilesSelected} />
        </div>

        {loading && <Loader text="Scanning files for IP addresses..." />}

        {!loading && parsedFiles.length > 0 && (
          <>
            {parsedFiles.map((pf) => {
              const scanMsg = `${pf.fileName} — found ${pf.ips.length} IP(s) in sheet "${pf.sheetName}"`;
              return (
                <div key={pf.key} className="scan-result">
                  <div className="scan-status scan-ok">{scanMsg}</div>
                  <SheetCard
                    sheet={pf}
                    entry={entries[pf.key] || defaultEntry()}
                    onChange={(newEntry) => handleEntryChange(pf.key, newEntry)}
                  />
                </div>
              );
            })}

            <div className="divider" />

            <div className="step-section">
              <span className="step-badge">Step 2</span>
              <h2 className="step-title">Generate Bulk CI CSV</h2>

              <SummaryBar
                fileCount={fileNames.length}
                sheetCount={parsedFiles.length}
                ipCount={totalIps}
              />

              {!config.bcrNumber && (
                <div className="warning-msg">Enter a BCR Number in the Configurations panel to continue.</div>
              )}

              <button
                className="btn-primary"
                disabled={!canGenerate}
                onClick={handleGenerate}
              >
                Generate CSV
              </button>

              {csvData && (
                <>
                  <PreviewTable rows={previewRows} totalRows={totalRows} />
                  <button className="btn-download" onClick={handleDownload}>
                    Download Bulk CI Template - {config.bcrNumber}.csv
                  </button>
                  <div className="success-msg">
                    Generated {totalRows.toLocaleString()} rows from {parsedFiles.length} sheet(s).
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {!loading && parsedFiles.length === 0 && (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p>Upload one or more MOP Excel files to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
