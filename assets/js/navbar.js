export function loadNavbar() {
  fetch('/components/navbar.html')
    .then(res => res.text())
    .then(html => {
      // Injecte le HTML dans la page
      document.getElementById('navbar').innerHTML = html;

      // Marque automatiquement le lien actif
      const path = window.location.pathname;
      const links = document.querySelectorAll('.nav-link');

      links.forEach(link => {
        if (link.getAttribute('href') === path) {
          link.classList.add('bg-primary', 'text-white', 'font-semibold');
          link.innerHTML = `<span class="text-white">➤</span> ${link.textContent}`;
        } else {
          link.classList.add('hover:bg-primary/70');
        }
      });

      // 🧠 Lier la fonction logout au bouton après chargement de la navbar
      const logoutBtn = document.querySelector('#logout-button');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          alert("Déconnexion réussie.");
          window.location.href = "/pages/login.html";
        });
      }
    });
}
