/**
 * Utility to export JavaScript arrays of objects to downloadable CSV files.
 */
export const exportToCSV = (filename, rows, columns) => {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = columns ? columns.map((col) => col.key) : Object.keys(rows[0]);
  const headers = columns ? columns.map((col) => `"${col.label || col.key}"`) : keys.map((k) => `"${k}"`);

  const csvRows = [headers.join(separator)];

  for (const row of rows) {
    const values = keys.map((key) => {
      let val = row[key];
      if (val === undefined || val === null) val = '';
      if (typeof val === 'object') {
        if (val instanceof Date) {
          val = val.toISOString();
        } else {
          val = JSON.stringify(val);
        }
      }
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(separator));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
