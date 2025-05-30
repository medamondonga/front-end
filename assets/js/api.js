export async function getArticles() {
  try {
    const response = await fetch("http://127.0.0.1:8000/stock/articles/", {
      headers: {
        Authorization: "Bearer VOTRE_TOKEN_ICY"
      }
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des articles");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
