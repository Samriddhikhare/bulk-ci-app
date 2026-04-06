import { useState } from 'react';
import TimePicker from './TimePicker';

export default function SheetCard({ sheet, entry, onChange }) {
  const [showIps, setShowIps] = useState(false);

  const handleField = (field, value) => {
    onChange({ ...entry, [field]: value });
  };

  const previewIps = sheet.ips.slice(0, 10);

  const excluded = !entry.included;

  return (
    <div className={`sheet-card ${excluded ? 'excluded' : ''}`}>
      <div className="toggle-row include-toggle">
        <label className="toggle-label">Include this sheet</label>
        <button
          className={`toggle-btn ${entry.included ? 'active' : ''}`}
          onClick={() => handleField('included', !entry.included)}
        >
          <span className="toggle-knob" />
        </button>
      </div>

      <div className={excluded ? 'sheet-card-body disabled' : 'sheet-card-body'}>
        <div className="sheet-card-header">
          <span className="sheet-tag">{sheet.sheetName}</span>
          <span className="ip-count">{sheet.ips.length} IPs</span>
        </div>

        <button
          className="btn-text"
          onClick={() => setShowIps(!showIps)}
          disabled={excluded}
        >
          {showIps ? 'Hide' : 'Preview'} IPs
          {sheet.ips.length > 10 ? ` (first 10 of ${sheet.ips.length})` : ''}
        </button>

        {showIps && !excluded && (
          <pre className="ip-preview">{previewIps.join('\n')}</pre>
        )}

        <label className="field-label">Application SPOC</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. Rajkamal1.Pandey"
          value={entry.spoc}
          onChange={(e) => handleField('spoc', e.target.value)}
          disabled={excluded}
        />

        <div className="toggle-row">
          <label className="toggle-label">CI Downtime Required</label>
          <button
            className={`toggle-btn ${entry.hasDowntime ? 'active' : ''}`}
            onClick={() => handleField('hasDowntime', !entry.hasDowntime)}
            disabled={excluded}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        {entry.hasDowntime && !excluded && (
          <div className="downtime-fields">
            <div className="field-row">
              <div className="field-half">
                <label className="field-label">Downtime Start Date</label>
                <input
                  type="date"
                  className="field-input"
                  value={entry.downtimeStartDate}
                  onChange={(e) => handleField('downtimeStartDate', e.target.value)}
                />
              </div>
              <div className="field-half">
                <label className="field-label">Downtime Start Time</label>
                <TimePicker
                  value={entry.downtimeStartTime}
                  onChange={(v) => handleField('downtimeStartTime', v)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-half">
                <label className="field-label">Downtime End Date</label>
                <input
                  type="date"
                  className="field-input"
                  value={entry.downtimeEndDate}
                  onChange={(e) => handleField('downtimeEndDate', e.target.value)}
                />
              </div>
              <div className="field-half">
                <label className="field-label">Downtime End Time</label>
                <TimePicker
                  value={entry.downtimeEndTime}
                  onChange={(v) => handleField('downtimeEndTime', v)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
