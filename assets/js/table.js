export function renderTable(containerId, columns, rows, onRowClick = null) {
  fetch('/components/table.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById(containerId).innerHTML = html;

      const thead = document.getElementById('table-head');
      const tbody = document.getElementById('table-body');

      // Ajout colonne action
      thead.innerHTML = `
        <tr>
          ${columns.map(col => `<th class="px-6 py-3">${col}</th>`).join('')}
          <th class="px-6 py-3 text-right">...</th>
        </tr>
      `;

      // Lignes cliquables
      tbody.innerHTML = rows.map((row, index) => `
        <tr class="hover:bg-gray-100 cursor-pointer transition group" data-index="${index}">
          ${row.map(cell => `<td class="px-6 py-4">${cell}</td>`).join('')}
          <td class="px-6 py-4 text-right">
            <button class="text-xl text-gray-500 group-hover:text-primary" data-action="more">
              ⋮
            </button>
          </td>
        </tr>
      `).join('');

      if (onRowClick) {
        tbody.querySelectorAll('tr').forEach(tr => {
          const index = tr.dataset.index;
          const rowData = rows[index];

          // Clique sur la ligne
          tr.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'more') return;
            onRowClick(rowData, index);
          });

          // Clique sur les 3 points
          tr.querySelector('[data-action="more"]').addEventListener('click', (e) => {
            e.stopPropagation();
            onRowClick(rowData, index);
          });
        });
      }
    });
}
