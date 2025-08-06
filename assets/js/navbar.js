import { showNotification } from "./notificationModal.js"; // Assurez-vous que le chemin est correct

export function loadNavbar() {
  fetch('/components/navbar.html') // Assurez-vous que le chemin vers navbar.html est correct
    .then(res => res.text())
    .then(html => {
      // Injecte le HTML dans la page
      const navbarContainer = document.getElementById('navbar'); // L'élément où tu injectes la <aside>
      if (!navbarContainer) {
          console.error("Élément #navbar (conteneur pour la sidebar) non trouvé.");
          return;
      }
      navbarContainer.innerHTML = html;

      // Récupérer le statut is_owner
      const isOwner = localStorage.getItem('is_owner') === 'true'; // Convertir en booléen

      // Définir les chemins des liens autorisés pour un non-propriétaire
      // Attention aux chemins absolus/relatifs ici, ils doivent correspondre à ceux de tes <a>
      const allowedPathsForNonOwner = [
        '/pages/dashboard.html',
        '/pages/ventes.html',  // Modifié de 'vente.html' à 'ventes.html'
        'depenses.html',       // Attention: ceci est un chemin relatif ! S'il est absolu, modifie-le.
        '/pages/parametre.html',
        '#', // Pour le lien de déconnexion si son href est '#'
        // Ajoutez d'autres chemins si nécessaire pour qu'ils soient visibles
      ];

      // Sélectionner tous les liens de navigation (hors bouton de déconnexion pour l'instant)
      // On cible les liens qui ont la classe 'nav-link' mais pas l'ID 'logout-button'
      const allNavLinkElements = navbarContainer.querySelectorAll('.nav-link');

      allNavLinkElements.forEach(linkElement => {
        const href = linkElement.getAttribute('href');

        if (!isOwner) {
          // Si l'utilisateur n'est PAS propriétaire
          // Et que le lien n'est PAS dans la liste des liens autorisés
          // Et que ce n'est PAS le bouton de déconnexion (il sera géré séparément si besoin)
          if (!allowedPathsForNonOwner.includes(href) && linkElement.id !== 'logout-button') {
            linkElement.style.display = 'none'; // Masquer l'élément
          }
        }
      });

      // Marque automatiquement le lien actif
      const path = window.location.pathname;
      // Resélectionner les liens après la manipulation de visibilité,
      // pour ne marquer que ceux qui sont encore visibles.
      const visibleLinks = navbarContainer.querySelectorAll('.nav-link:not([style*="display: none"])');

      visibleLinks.forEach(link => {
        if (link.getAttribute('href') === path) {
          link.classList.add('bg-primary', 'text-white', 'font-semibold');
          link.innerHTML = `<span class="text-white">➤</span> ${link.textContent}`;
        } else {
          link.classList.add('hover:bg-primary/70');
        }
      });

      // Lier la fonction logout au bouton après chargement de la navbar
      const logoutBtn = navbarContainer.querySelector('#logout-button');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("is_owner"); // Important: nettoyer aussi is_owner
          showNotification("Déconnexion réussie.");
          window.location.href = "/pages/login.html";
        });
      }
    });
}