// assets/js/notificationModal.js

let isModalLoaded = false; // Pour s'assurer que la modale n'est chargée qu'une fois

/**
 * Initialise la modale de notification en chargeant son HTML et en l'insérant dans le DOM.
 * Cette fonction devrait être appelée une seule fois au chargement initial de la page.
 */
async function loadNotificationModal() {
    if (isModalLoaded) {
        return; // La modale est déjà chargée, ne rien faire
    }

    try {
        const response = await fetch('/components/notification-modal.html'); // Chemin vers votre composant HTML
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const modalHtml = await response.text();
        
        // Crée un conteneur temporaire pour analyser le HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        const modalElement = tempDiv.firstElementChild; // Récupère le premier enfant (la modale)

        if (modalElement) {
            document.body.appendChild(modalElement);
            isModalLoaded = true;
            console.log("Modale de notification chargée avec succès.");
        } else {
            console.error("Impossible de trouver l'élément de la modale dans le HTML chargé.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la modale de notification:", error);
        // Fallback si le chargement échoue
        isModalLoaded = false; // Réinitialiser pour une nouvelle tentative ou un fallback
    }
}

/**
 * Affiche une modale de notification personnalisée.
 * Le message est affiché et un bouton 'OK' permet de fermer la modale.
 * Cette fonction appellera automatiquement loadNotificationModal si ce n'est pas déjà fait.
 * @param {string} message - Le message à afficher dans la modale.
 * @param {function} [callback=null] - Une fonction optionnelle à exécuter lorsque l'utilisateur clique sur 'OK'.
 */
export async function showNotification(message, callback = null) {
    if (!isModalLoaded) {
        await loadNotificationModal(); // Assurez-vous que la modale est chargée avant de l'afficher
        if (!isModalLoaded) { // Si le chargement a échoué
            alert(message); // Fallback to native alert
            if (callback) callback();
            return;
        }
    }

    const notificationModal = document.getElementById("notification-modal");
    const notificationMessage = document.getElementById("notification-message");
    const notificationOkBtn = document.getElementById("notification-ok-btn");

    if (!notificationModal || !notificationMessage || !notificationOkBtn) {
        console.error("Les éléments de la modale de notification sont manquants après le chargement. Fallback sur alert().");
        alert(message);
        if (callback) callback();
        return;
    }

    notificationMessage.textContent = message;
    notificationModal.classList.remove("hidden");

    // Nettoyer les écouteurs précédents pour éviter les exécutions multiples
    const oldClickHandler = notificationOkBtn._clickHandler;
    if (oldClickHandler) {
        notificationOkBtn.removeEventListener("click", oldClickHandler);
    }

    const newClickHandler = () => {
        notificationModal.classList.add("hidden");
        if (callback && typeof callback === 'function') {
            callback();
        }
    };
    notificationOkBtn.addEventListener("click", newClickHandler);
    notificationOkBtn._clickHandler = newClickHandler;
}

/**
 * Cache la modale de notification.
 */
export function hideNotification() {
    const notificationModal = document.getElementById("notification-modal");
    if (notificationModal) {
        notificationModal.classList.add("hidden");
    }
}

// Optionnel: Appeler loadNotificationModal dès que ce script est importé
// Cela garantit que la modale est prête avant même le premier appel à showNotification
// Si vous préférez un chargement "juste à temps" (lazy loading), retirez cette ligne.
loadNotificationModal();