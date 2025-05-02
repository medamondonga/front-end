document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  
  if (form.id === "loginForm") {
      const email = form.email.value;
      const password = form.password.value;

      try {
          const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
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
          const response = await fetch("http://127.0.0.1:8000/create/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ first_name, last_name, email, password })
          });

          if (response.ok) {
              const data = await response.json();
              console.log("Inscription réussie :", data);
              window.location.href = "/pages/dashboard.html";
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
