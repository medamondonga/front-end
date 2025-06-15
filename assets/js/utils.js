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

// authGuard.js
export async function guardAccess() {
  const token = localStorage.getItem("access");
  const currentPath = window.location.pathname;

  if (!token) {
    window.location.href = "/pages/login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/accounts/me/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      window.location.href = "/pages/login.html";
      return;
    }

    const user = await res.json();

    // 👮‍♂️ Redirection si vendeur essaie d'accéder à une autre page
    const isVendeur = user.is_seller;
    const isVentePage = currentPath.includes("vendre.html");

    if (isVendeur && !isVentePage) {
      alert("Accès refusé. Cette page est réservée au propriétaire.");
      window.location.href = "/pages/vendre.html";
    }

    // 👮‍♀️ Bloquer accès à `vendre.html` pour les non-vendeurs (optionnel)
    if (!isVendeur && isVentePage) {
      alert("Cette page est réservée aux vendeurs.");
      window.location.href = "/pages/dashboard.html";
    }

  } catch (error) {
    console.error("Erreur d'accès :", error);
    window.location.href = "/pages/login.html";
  }
}
