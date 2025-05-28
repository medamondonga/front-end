export async function injectButton(targetId, templateId, onClick) {
  const res = await fetch('/components/buttons.html');
  const html = await res.text();

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  const template = wrapper.querySelector(`#${templateId}`);
  const btn = template.content.cloneNode(true).children[0];

  if (onClick) {
    btn.addEventListener('click', onClick);
  }

  document.getElementById(targetId).appendChild(btn);
}

export function showDetailComponent(data = null) {
  // 1. Afficher overlay et panneau
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('side-panel').classList.remove('translate-x-full');

  // 2. Charger detail.html dans la zone de contenu
  fetch('/components/detail.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('side-panel-content').innerHTML = html;

      // Optionnel : injecter des données si `data` est passé
      if (data) {
        const title = document.getElementById('detail-title');
        if (title) title.textContent = data[0]; // ex: nom article
        // Tu peux compléter ça plus tard selon les données
      }
    });
}

export function hideSidePanel() {
  document.getElementById('side-panel').classList.add('translate-x-full');
  document.getElementById('overlay').classList.add('hidden');
}
