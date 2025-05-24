import { loadHeader } from './header.js'
import { renderTable } from './table.js'
import { getArticles } from './api.js'

const basic_endpoint = "http://127.0.0.1:8000/"
const accounts_endpoint = "http://127.0.0.1:8000/accounts/"
const stock_endpoint ="http://127.0.0.1:8000/stock/"
const user_endpoint = "http://127.0.0.1:8000/user/"

loadHeader();

getArticles().then(data => {
  const columns = ['Nom', 'Catégorie', 'Stock'];
  const rows = data.map(a => [a.nom, a.categorie, a.stock]);
  renderTable('article-table', columns, rows);
});


document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  
  if (form.id === "loginForm") {
      const email = form.email.value;
      const password = form.password.value;

      try {
          const response = await fetch(`${basic_endpoint}/login`,{
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ email, password })
          });

          if (response.ok) {
              const data = await response.json();
              console.log("Connexion réussie :", data);
              window.location.href = "/pages/dashboard.html";
          } else {
              const errorData = await response.json();
              alert("Échec de la connexion : " + (errorData.detail || "Identifiants invalides."));
          }
      } catch (error) {
          console.error("Erreur de connexion :", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
      }
  }

  if (form.id === "signupForm") {
      const email = form.email.value;
      const password = form.password.value;
      const first_name = form.first_name.value;
      const last_name = form.last_name.value;

      try {
          const response = await fetch(`${accounts_endpoint}/create`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ first_name, last_name, email, password })
          });

          if (response.ok) {
              const data = await response.json();
              console.log("Inscription réussie :", data);
              window.location.href = "/pages/welcome.html";
          } else {
              const errorData = await response.json();
              alert("Échec de l'inscription : " + (errorData.detail || "Identifiants invalides."));
          }
      } catch (error) {
          console.error("Erreur d'inscription :", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
      }
  }
});

// Simulation d’un appel API
document.addEventListener("DOMContentLoaded", async () => {
    try {
      // ⚠️ À remplacer par ton vrai endpoint
      const response = await fetch("https://api.tondomaine.com/user/me", {
        headers: {
          "Authorization": "Bearer VOTRE_TOKEN_ICY"
        }
      });
  
      const data = await response.json();
      document.getElementById("user-name").textContent = data.first_name || "Utilisateur";
      
      // facultatif : charger une vraie photo si dispo
      if (data.profile_photo_url) {
        document.getElementById("user-photo").src = data.profile_photo_url;
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur", error);
    }
  });
  
