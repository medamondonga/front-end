const token = localStorage.getItem("access");

export function authFetch(url, options = {}) {
  const token = localStorage.getItem("access");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function getArticles() {
  const response = await authFetch("http://127.0.0.1:8000/stock/articles/");
  if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
  return await response.json();
}
export async function getClients() {
  const response = await authFetch("http://127.0.0.1:8000/stock/clients/");
  if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
  return await response.json();
}
export async function getVentes() {
  const response = await authFetch("http://127.0.0.1:8000/stock/ventes/list/");
  if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
  return await response.json();
}
export async function getCategories() {
  const response = await authFetch("http://127.0.0.1:8000/stock/categorie/list/");
  if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
  return await response.json();
}
export async function getDepenses() {
  const response = await authFetch("http://127.0.0.1:8000/stock/depenses/list/");
  if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
  return await response.json();
}
