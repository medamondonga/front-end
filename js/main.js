document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value;
  
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });
  
      if (response.ok) {
        // Optionnel : stocker le token ou autre info
        const data = await response.json();
        console.log("Connexion réussie :", data);
  
        // ✅ Redirection vers dashboard
        window.location.href = "/pages/dashboard.html";
      } else {
        const errorData = await response.json();
        alert("Échec de la connexion : " + (errorData.detail || "Identifiants invalides."));
      }
  
    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  });