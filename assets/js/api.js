const token = localStorage.getItem("access");
export async function getArticles() {
  try {
    
    const response = await fetch("http://127.0.0.1:8000/stock/articles/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des articles");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCategories() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/stock/categorie/list/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors du chargement des categories");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getClients() {
  try {
    const response = await fetch("http://127.0.0.1:8000/stock/clients/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des clients");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVentes() {
  try {
    const response = await fetch("http://127.0.0.1:8000/stock/ventes/list/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des ventes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getDepenses() {
  try {
    const response = await fetch("http://127.0.0.1:8000/stock/depenses/list/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des depenses");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

