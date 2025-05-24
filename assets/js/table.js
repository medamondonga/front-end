export function renderTable(containerId, columns, rows) {
  fetch('/components/table.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById(containerId).innerHTML = html;

      const thead = document.getElementById('table-head');
      const tbody = document.getElementById('table-body');

      thead.innerHTML = `<tr>${columns.map(col => `<th class="px-6 py-3">${col}</th>`).join('')}</tr>`;
      tbody.innerHTML = rows.map(row =>
        `<tr>${row.map(cell => `<td class="px-6 py-4">${cell}</td>`).join('')}</tr>`
      ).join('');
    });
}
