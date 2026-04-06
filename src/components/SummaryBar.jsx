export default function SummaryBar({ fileCount, sheetCount, ipCount }) {
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <div className="num">{fileCount}</div>
        <div className="label">Files</div>
      </div>
      <div className="summary-item">
        <div className="num">{sheetCount}</div>
        <div className="label">Sheets</div>
      </div>
      <div className="summary-item">
        <div className="num">{ipCount.toLocaleString()}</div>
        <div className="label">Total IPs</div>
      </div>
    </div>
  );
}
