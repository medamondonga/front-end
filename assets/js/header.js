// assets/js/header.js

export function loadHeader() {
    const headerContainer = document.getElementById('header');
    if (!headerContainer) {
        console.warn("❌ Aucun conteneur avec l'id 'header' trouvé.");
        return;
    }

    console.log("✅ Chargement du fichier header.html...");
    fetch('/components/header.html')
        .then(res => res.text())
        .then(async html => {
            headerContainer.innerHTML = html;
            console.log("✅ HTML injecté avec succès.");

            const token = localStorage.getItem('access');
            console.log("🔐 Token récupéré depuis localStorage :", token);

            if (!token) {
                console.warn("❌ Aucun token trouvé. Redirection vers la page de connexion.");
                window.location.href = "/pages/login.html";
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/accounts/me/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("📡 Requête vers /accounts/me/ → statut :", response.status);

                if (!response.ok) {
                    const errData = await response.text();
                    console.error("❌ Erreur API : ", errData);
                    throw new Error("Token invalide ou expiré");
                }

                const data = await response.json();
                console.log("✅ Données utilisateur reçues :", data);

                const userNameElement = document.getElementById("user-name");
                if (userNameElement) {
                    userNameElement.textContent = data.first_name || "Utilisateur";
                }

                const userAvatar = document.getElementById("user-avatar");
                if (userAvatar && data.profile_photo_url) {
                    userAvatar.src = data.profile_photo_url;
                }

                // --- NOUVELLE LOGIQUE POUR LE MENU BURGER ICI ---
                const burgerToggle = document.getElementById('burger-toggle');
                const mobileNav = document.getElementById('mobile-nav'); // La barre latérale

                if (burgerToggle && mobileNav) {
                    burgerToggle.addEventListener('click', () => {
                        // Toggle la classe pour faire glisser la nav in/out
                        mobileNav.classList.toggle('-translate-x-full');
                        mobileNav.classList.toggle('translate-x-0');
                    });

                    // Optionnel : Cacher le menu quand on clique sur un lien (sur mobile)
                    const navLinks = mobileNav.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.addEventListener('click', () => {
                            if (window.innerWidth < 640) { // Si c'est un écran mobile (breakpoint sm est 640px par défaut)
                                mobileNav.classList.add('-translate-x-full');
                                mobileNav.classList.remove('translate-x-0');
                            }
                        });
                    });
                } else {
                    console.warn("❌ Bouton burger ou navigation mobile non trouvé(e).");
                }
                // --- FIN DE LA NOUVELLE LOGIQUE ---


            } catch (error) {
                console.error("❌ Erreur de chargement utilisateur :", error.message);
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/pages/login.html";
            }
        })
        .catch(err => {
            console.error("❌ Erreur lors du chargement du header HTML :", err.message);
        });
}