const CSV_COLUMNS = [
  'IP Address',
  'Application SPOC',
  'Activity Phase',
  'CI Downtime Start Time',
  'CI Downtime End Time',
  'KPI to be supressed',
  'Direct/Dependant',
  'Command',
  'File Path',
  'Activity Start Time(Individual CI)',
  'Activity End Time(Individual CI)',
];

function escapeCSV(val) {
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function generateCSV(entries, activityStart, activityEnd) {
  const rows = [];

  for (const entry of entries) {
    for (const ip of entry.ips) {
      rows.push({
        'IP Address': ip.trim(),
        'Application SPOC': (entry.spoc || '').trim(),
        'Activity Phase': 'Activity',
        'CI Downtime Start Time': entry.downtimeStart || '',
        'CI Downtime End Time': entry.downtimeEnd || '',
        'KPI to be supressed': 'NA',
        'Direct/Dependant': 'Direct',
        'Command': 'NA',
        'File Path': 'NA',
        'Activity Start Time(Individual CI)': activityStart,
        'Activity End Time(Individual CI)': activityEnd,
      });
    }
  }

  const header = CSV_COLUMNS.map(escapeCSV).join(',');
  const body = rows.map(row =>
    CSV_COLUMNS.map(col => escapeCSV(row[col])).join(',')
  );

  return [header, ...body].join('\n');
}

export function getPreviewRows(entries, activityStart, activityEnd, limit = 30) {
  const rows = [];
  for (const entry of entries) {
    for (const ip of entry.ips) {
      if (rows.length >= limit) return rows;
      rows.push({
        'IP Address': ip.trim(),
        'Application SPOC': (entry.spoc || '').trim(),
        'Activity Phase': 'Activity',
        'CI Downtime Start Time': entry.downtimeStart || '',
        'CI Downtime End Time': entry.downtimeEnd || '',
        'KPI to be supressed': 'NA',
        'Direct/Dependant': 'Direct',
        'Command': 'NA',
        'File Path': 'NA',
        'Activity Start Time(Individual CI)': activityStart,
        'Activity End Time(Individual CI)': activityEnd,
      });
    }
  }
  return rows;
}

export { CSV_COLUMNS };
