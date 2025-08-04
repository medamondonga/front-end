// assets/js/table.js

export function renderTable(containerId, columns, rows, onRowClick = null) {
    fetch("/components/table.html")
        .then((res) => res.text())
        .then((html) => {
            // Injecter le HTML de table.html dans le conteneur principal de la page
            document.getElementById(containerId).innerHTML = html;

            // Récupérer les éléments pour le tableau traditionnel (desktop)
            const thead = document.getElementById("table-head");
            const tbody = document.getElementById("table-body");
            // Récupérer le conteneur pour les cartes (mobile)
            const cardContainer = document.getElementById("table-cards-mobile");

            // --- Remplir la TABLE traditionnelle (pour desktop) ---
            // Génération des en-têtes de colonnes
            thead.innerHTML = `
                <tr>
                    ${columns.map((col) => `<th class="px-6 py-3">${col}</th>`).join("")}
                    <th class="px-6 py-3 text-right">...</th> </tr>
            `;

            // Génération des lignes de la table
            tbody.innerHTML = rows
                .map(
                    (rowObj, index) => `
                        <tr class="hover:bg-gray-100 cursor-pointer transition group" data-index="${index}">
                            ${rowObj.row
                                .map((cell) => `<td class="px-6 py-4">${cell}</td>`)
                                .join("")}
                            <td class="px-6 py-4 text-right">
                                <button class="text-xl text-gray-500 group-hover:text-primary" data-action="more">
                                    ⋮
                                </button>
                            </td>
                        </tr>
                    `
                )
                .join("");

            // --- Remplir la vue CARD (pour mobile) ---
            // Génération des cartes pour chaque ligne de données
            cardContainer.innerHTML = rows
                .map((rowObj, index) => `
                    <div class="bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition" data-index="${index}">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="font-bold text-darkblue">${rowObj.row[1]}</h4> 
                            <button class="text-xl text-gray-500 hover:text-primary" data-action="more">⋮</button>
                        </div>
                        <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">
                            ${rowObj.row.map((cell, cellIndex) => {
                                // Exclure la colonne N° (index 0) et le Nom (index 1) car déjà utilisé comme titre
                                if (cellIndex === 0 || cellIndex === 1) {
                                    return ''; // Ne pas afficher ces cellules dans le corps de la carte
                                }
                                return `
                                    <div>
                                        <span class="font-semibold text-gray-500">${columns[cellIndex]}:</span> ${cell}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('');


            // --- Logique des événements (s'applique aux deux vues) ---
            if (onRowClick) {
                // 1. Événements pour la table classique (lignes du <tbody>)
                tbody.querySelectorAll("tr").forEach((tr) => {
                    const index = tr.dataset.index;
                    const rowData = rows[index].object;

                    // Gérer le clic sur la ligne entière (sauf le bouton d'action)
                    tr.addEventListener("click", (e) => {
                        // Empêcher l'exécution si le clic vient du bouton "..."
                        if (e.target.dataset.action === "more") {
                            e.stopPropagation(); // Empêche le clic de la ligne de se propager
                            return;
                        }
                        onRowClick(rowData, index);
                    });

                    // Gérer le clic spécifique sur le bouton "..."
                    const moreButton = tr.querySelector('[data-action="more"]');
                    if (moreButton) {
                        moreButton.addEventListener(
                            "click",
                            (e) => {
                                e.stopPropagation(); // Important pour ne pas déclencher le clic de la ligne parente
                                onRowClick(rowData, index); // Appelle onRowClick pour le bouton "..."
                            }
                        );
                    }
                });

                // 2. Événements pour les cartes mobiles (les divs dans le cardContainer)
                cardContainer.querySelectorAll('div[data-index]').forEach(card => {
                    const index = card.dataset.index;
                    const rowData = rows[index].object;

                    // Gérer le clic sur la carte entière (sauf le bouton d'action)
                    card.addEventListener('click', (e) => {
                        if (e.target.dataset.action === "more") {
                            e.stopPropagation();
                            return;
                        }
                        onRowClick(rowData, index);
                    });

                    // Gérer le clic spécifique sur le bouton "..." de la carte
                    const moreButton = card.querySelector('[data-action="more"]');
                    if (moreButton) {
                        moreButton.addEventListener(
                            'click',
                            (e) => {
                                e.stopPropagation();
                                onRowClick(rowData, index);
                            }
                        );
                    }
                });
            }
        });
}