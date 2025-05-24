export function loadHeader() {
  fetch('/components/header.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('header').innerHTML = html;

      fetch("https://api.tondomaine.com/user/me", {
        headers: {
          Authorization: "Bearer VOTRE_TOKEN_ICY"
        }
      })
        .then(res => res.json())
        .then(data => {
          document.getElementById("user-name").textContent = data.first_name || "Utilisateur";
          if (data.profile_photo_url) {
            document.getElementById("user-avatar").src = data.profile_photo_url;
          }
        });
    });
}
