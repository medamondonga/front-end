export function loadNavbar() {
  fetch('/components/navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;

      // Marque le lien actif automatiquement
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
    });
}
