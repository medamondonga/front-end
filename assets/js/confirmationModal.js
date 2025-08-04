// assets/js/confirmationModal.js

let isConfirmationModalLoaded = false;

/**
 * Charge le HTML de la modale de confirmation et l'ajoute au DOM.
 */
async function loadConfirmationModal() {
    if (isConfirmationModalLoaded) {
        return;
    }

    try {
        const response = await fetch('/components/confirmation-modal.html'); // Chemin vers votre composant HTML
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const modalHtml = await response.text();
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        const modalElement = tempDiv.firstElementChild;

        if (modalElement) {
            document.body.appendChild(modalElement);
            isConfirmationModalLoaded = true;
            console.log("Modale de confirmation chargée avec succès.");
        } else {
            console.error("Impossible de trouver l'élément de la modale de confirmation dans le HTML chargé.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la modale de confirmation:", error);
        isConfirmationModalLoaded = false;
    }
}

/**
 * Affiche une modale de confirmation avec des options Oui/Non.
 * Retourne une promesse qui se résout à true si l'utilisateur clique sur "Confirmer",
 * ou à false s'il clique sur "Annuler".
 * @param {string} message - Le message de confirmation à afficher.
 * @returns {Promise<boolean>} - Une promesse qui résout à true pour confirmer, false pour annuler.
 */
export async function showConfirmation(message) {
    if (!isConfirmationModalLoaded) {
        await loadConfirmationModal();
        if (!isConfirmationModalLoaded) { // Si le chargement a échoué
            console.warn("La modale de confirmation n'a pas pu être chargée. Utilisation de window.confirm().");
            return window.confirm(message); // Fallback to native confirm
        }
    }

    const confirmationModal = document.getElementById("confirmation-modal");
    const confirmationMessage = document.getElementById("confirmation-message");
    const confirmOkBtn = document.getElementById("confirm-ok-btn");
    const confirmCancelBtn = document.getElementById("confirm-cancel-btn");

    if (!confirmationModal || !confirmationMessage || !confirmOkBtn || !confirmCancelBtn) {
        console.error("Les éléments de la modale de confirmation sont manquants après le chargement. Fallback sur window.confirm().");
        return window.confirm(message); // Fallback to native confirm
    }

    confirmationMessage.textContent = message;
    confirmationModal.classList.remove("hidden");

    return new Promise(resolve => {
        const handleConfirm = () => {
            confirmationModal.classList.add("hidden");
            confirmOkBtn.removeEventListener("click", handleConfirm);
            confirmCancelBtn.removeEventListener("click", handleCancel);
            resolve(true); // Résout à true si "Confirmer" est cliqué
        };

        const handleCancel = () => {
            confirmationModal.classList.add("hidden");
            confirmOkBtn.removeEventListener("click", handleConfirm);
            confirmCancelBtn.removeEventListener("click", handleCancel);
            resolve(false); // Résout à false si "Annuler" est cliqué
        };

        confirmOkBtn.addEventListener("click", handleConfirm);
        confirmCancelBtn.addEventListener("click", handleCancel);
    });
}

/**
 * Cache la modale de confirmation. (Peut être appelée si nécessaire, mais gérée par showConfirmation)
 */
export function hideConfirmation() {
    const confirmationModal = document.getElementById("confirmation-modal");
    if (confirmationModal) {
        confirmationModal.classList.add("hidden");
    }
}

// Optionnel: Charge la modale de confirmation dès l'importation du script
loadConfirmationModal();