export function hideFormModal() {
  const overlay = document.getElementById('form-modal-overlay');
  overlay.classList.add('hidden');
  document.getElementById('form-modal-content').innerHTML = '';
}
window.hideFormModal = hideFormModal;

export function showFormModal(fields, onSubmit) {
  const overlay = document.getElementById('form-modal-overlay');
  const container = document.getElementById('form-modal-content');

  overlay.classList.remove('hidden');

  fetch('/components/form.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      const fieldsContainer = document.getElementById('form-fields');
      const form = document.getElementById('dynamic-form');

      fieldsContainer.innerHTML = fields.map(field => {
        if (field.type === 'select') {
          return `
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">${field.label}</label>
              <select name="${field.name}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:outline-none">
                ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
              </select>
            </div>`;
        } else {
          return `
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">${field.label}</label>
              <input name="${field.name}" type="${field.type}" placeholder="${field.placeholder || ''}"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:outline-none" />
            </div>`;
        }
      }).join('');

      form.onsubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        onSubmit(data); // envoie les données
        hideFormModal(); // ferme le modal
      };
    });
}
