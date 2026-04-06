import { CSV_COLUMNS } from '../utils/csvGenerator';

export default function PreviewTable({ rows, totalRows }) {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="preview-section">
      <h4 className="preview-heading">Preview</h4>
      <div className="table-wrapper">
        <table className="preview-table">
          <thead>
            <tr>
              {CSV_COLUMNS.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {CSV_COLUMNS.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalRows > rows.length && (
        <p className="preview-caption">
          Showing {rows.length} of {totalRows.toLocaleString()} rows
        </p>
      )}
    </div>
  );
}
