import TimePicker from './TimePicker';

export default function Sidebar({ config, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Bulk CI Generator</div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">Configurations</h3>
        <p className="sidebar-caption">Common configuration for all systems</p>

        <label className="field-label">BCR Number</label>
        <input
          type="text"
          className="field-input"
          placeholder="e.g. BCR253544"
          value={config.bcrNumber}
          onChange={(e) => handleChange('bcrNumber', e.target.value)}
        />
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <h3 className="sidebar-heading">Activity Window</h3>
        <p className="sidebar-caption">Common start/end time for all CIs</p>

        <label className="field-label">Start Date</label>
        <input
          type="date"
          className="field-input"
          value={config.actStartDate}
          onChange={(e) => handleChange('actStartDate', e.target.value)}
        />

        <label className="field-label">Start Time</label>
        <TimePicker
          value={config.actStartTime}
          onChange={(v) => handleChange('actStartTime', v)}
        />

        <label className="field-label">End Date</label>
        <input
          type="date"
          className="field-input"
          value={config.actEndDate}
          onChange={(e) => handleChange('actEndDate', e.target.value)}
        />

        <label className="field-label">End Time</label>
        <TimePicker
          value={config.actEndTime}
          onChange={(v) => handleChange('actEndTime', v)}
        />

        <div className="window-card">
          <strong>Window:</strong><br />
          {config.actStartDate && config.actStartTime
            ? formatDT(config.actStartDate, config.actStartTime)
            : '--'}{' '}
          &rarr;{' '}
          {config.actEndDate && config.actEndTime
            ? formatDT(config.actEndDate, config.actEndTime)
            : '--'}
        </div>
      </div>
    </aside>
  );
}

function formatDT(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  const [y, m, d] = dateStr.split('-');
  const [h, min] = timeStr.split(':');
  return `${m}/${d}/${y} ${h}:${min}`;
}
