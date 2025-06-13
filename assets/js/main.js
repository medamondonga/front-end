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

        // 🔍 Vérifie que ce log apparaît dans la console
        console.log("Redirection vers le dashboard...");

        // Rediriger
        window.location = "/pages/dashboard.html";
      }

    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Une erreur s'est produite.");
    }
  }

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
        window.location.href = "/pages/welcome.html";
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
