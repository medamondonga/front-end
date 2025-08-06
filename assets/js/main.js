import { loadHeader } from './header.js';
import { renderTable } from './table.js';
import { getArticles } from './api.js';

const basic_endpoint = "http://127.0.0.1:8000";
const accounts_endpoint = `${basic_endpoint}/accounts`;
const stock_endpoint = `${basic_endpoint}/stock`;

// Charger le header
loadHeader();

// Charger les articles si la table existe
if (document.getElementById("article-table")) {
  getArticles().then(data => {
    const columns = ['Nom', 'Catégorie', 'Stock'];
    const rows = data.map(a => [a.nom, a.categorie, a.stock]);
    renderTable('article-table', columns, rows);
  });
}

// 🔐 Formulaires LOGIN + SIGNUP
document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

// 🔑 Connexion
if (form.id === "loginForm") {
  const email = form.email.value;
  const password = form.password.value;

  try {
    const response = await fetch(`${basic_endpoint}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Connexion réussie :", data);

      // Enregistrer les tokens
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);


      // Récupérer les infos de l'utilisateur connecté
      const userRes = await fetch(`${accounts_endpoint}/me/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${data.access}` }
      });

      if (userRes.ok) {
        const user = await userRes.json();
        console.log("Utilisateur :", user);

        if (user.is_owner) {
          localStorage.setItem('is_owner', data.is_owner);
          // Redirection pour le propriétaire
          window.location.href = "/pages/dashboard.html";
        } else if (user.is_seller) {
          // Redirection pour le vendeur vers la page de son propriétaire
          const vendeurRes = await fetch(`${accounts_endpoint}/vendeur/owner/`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${data.access}` }
          });

          const lien = await vendeurRes.json();
          const ownerId = lien.proprietaire_id;
          window.location.href = `/pages/vendre.html?owner_id=${ownerId}`;
        } else {
          alert("Rôle non reconnu.");
        }
      }
    } else {
      alert("Identifiants invalides.");
    }

  } catch (error) {
    console.error("Erreur de connexion :", error);
    alert("Une erreur s'est produite.");
  }
}


  // 📝 Inscription
  // 📝 Inscription
  if (form.id === "signupForm") {
    const email = form.email.value;
    const password = form.password.value;
    const first_name = form.first_name.value;
    const last_name = form.last_name.value;

    try {
      const response = await fetch(`${accounts_endpoint}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inscription réussie :", data);

        // 🔑 Auto-login juste après inscription
        const tokenResponse = await fetch(`${basic_endpoint}/api/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          localStorage.setItem("access", tokenData.access);
          localStorage.setItem("refresh", tokenData.refresh);

          console.log("Connexion automatique réussie :", tokenData);
          window.location.href = "/pages/princing.html";
        } else {
          alert("Inscription réussie mais connexion impossible. Veuillez vous connecter manuellement.");
          window.location.href = "/pages/login.html";
        }
      } else {
        const errorData = await response.json();
        alert("Inscription échouée : " + (errorData.detail || "Erreur inconnue."));
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      alert("Une erreur s'est produite.");
    }
  }

});

// ✅ Charger les infos de l'utilisateur connecté
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access");
  const userNameElement = document.getElementById("first_name");

  // S’il n’y a pas de token ou que le span est introuvable
  if (!token || !userNameElement) return;

  try {
    const response = await fetch(`${accounts_endpoint}/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Token invalide ou expiré");

    const data = await response.json();
    userNameElement.textContent = data.first_name || "Utilisateur";

    const userPhoto = document.getElementById("user-photo");
    if (userPhoto && data.profile_photo_url) {
      userPhoto.src = data.profile_photo_url;
    }
  } catch (error) {

  }
});
