/**
 * main.js
 * Point d'entrée principal de l'application
 * - Initialisation de la simulation
 * - Création du renderer et de l'UI
 * - Boucle principale de jeu
 */

// Configuration globale
const CONFIG = {
    simulationWidth: 800,
    simulationHeight: 600,
    tickInterval: 200, // Intervalle en ms entre chaque mise à jour de simulation
    renderFPS: 60 // FPS cible pour le rendu
};

// Instances globales
let simulation = null;
let renderer = null;
let ui = null;

// Boucle principale
let lastTickTime = 0;
let lastRenderTime = 0;

/**
 * Initialisation de l'application
 */
function init() {
    console.log('🌍 Initialisation du Simulateur d\'Évolution...');

    // Récupérer le canvas
    const canvas = document.getElementById('simulation-canvas');
    if (!canvas) {
        console.error('Canvas non trouvé !');
        return;
    }

    // Créer la simulation
    simulation = new SimulationCore(CONFIG.simulationWidth, CONFIG.simulationHeight);
    console.log('✅ Simulation initialisée');

    // Créer le renderer
    renderer = new Renderer(canvas, simulation);
    console.log('✅ Renderer initialisé');

    // Créer l'UI
    ui = new UI(simulation);
    console.log('✅ UI initialisée');

    // Démarrer la boucle principale
    console.log('▶️ Démarrage de la simulation...');
    startMainLoop();

    // Message de bienvenue
    ui.showAlert('🌟 Simulation démarrée ! Observez l\'évolution de l\'univers...', 'info');
}

/**
 * Boucle principale de l'application
 * Sépare la logique de simulation (tick) et le rendu (frame)
 */
function startMainLoop() {
    lastTickTime = Date.now();
    lastRenderTime = Date.now();

    // Démarrer la boucle
    requestAnimationFrame(mainLoop);
}

/**
 * Boucle principale exécutée à chaque frame
 */
function mainLoop(timestamp) {
    const now = Date.now();

    // Mise à jour de la simulation (tick à intervalle fixe)
    if (now - lastTickTime >= CONFIG.tickInterval / simulation.tickSpeed) {
        updateSimulation();
        lastTickTime = now;
    }

    // Rendu (aussi rapide que possible, limité par requestAnimationFrame)
    const renderDelta = now - lastRenderTime;
    if (renderDelta >= 1000 / CONFIG.renderFPS) {
        render();
        lastRenderTime = now;
    }

    // Continuer la boucle
    requestAnimationFrame(mainLoop);
}

/**
 * Mise à jour de la logique de simulation
 */
function updateSimulation() {
    if (!simulation) return;

    simulation.update();

    // Vérifier les transitions d'ères pour afficher des alertes
    checkEraTransitions();
}

/**
 * Rendu visuel
 */
function render() {
    if (!renderer || !ui) return;

    // Dessiner la simulation
    renderer.render();

    // Mettre à jour l'UI
    ui.update();
}

/**
 * Détection des transitions d'ères pour afficher des notifications
 */
let lastEra = 1;
function checkEraTransitions() {
    if (simulation.currentEra !== lastEra) {
        // Nouvelle ère !
        ui.showAlert(`🌟 ${simulation.getEraName()} 🌟`, 'evolution');

        lastEra = simulation.currentEra;

        // Conditions spéciales
        if (simulation.currentEra === 4) {
            ui.showAlert('👥 Les premiers humains apparaissent !', 'birth');
        }

        if (simulation.currentEra === 6) {
            ui.showAlert('🚀 L\'humanité entre dans l\'ère moderne !', 'evolution');
        }
    }
}

/**
 * Gestion des événements spéciaux
 */
function setupSpecialEvents() {
    // Vérifier périodiquement si la simulation atteint des conditions de fin
    setInterval(() => {
        if (!simulation) return;

        // Condition de fin : temps simulé > 10 milliards d'années
        if (simulation.simulatedTime > 10000000000) {
            simulation.pause();
            ui.showAlert('⏹️ Fin de la simulation : 10 milliards d\'années atteintes', 'info');
            setTimeout(() => ui.showSummary(), 1000);
        }

        // Condition de fin : singularité technologique
        if (simulation.currentEra === 6) {
            const avgTech = simulation.stats.averageTech;
            if (avgTech > 150) {
                simulation.pause();
                ui.showAlert('🌌 Singularité technologique atteinte !', 'evolution');
                setTimeout(() => ui.showSummary(), 1000);
            }
        }

        // Condition de fin : extinction totale
        if (simulation.currentEra >= 4) {
            const totalPop = simulation.stats.totalPopulation;
            if (totalPop === 0) {
                simulation.pause();
                ui.showAlert('💀 Extinction totale de l\'humanité...', 'disaster');
                setTimeout(() => ui.showSummary(), 1000);
            }
        }
    }, 5000); // Vérifier toutes les 5 secondes
}

/**
 * Gestion du redimensionnement de la fenêtre
 */
window.addEventListener('resize', () => {
    if (renderer) {
        renderer.resize();
    }
});

/**
 * Démarrage automatique au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM chargé, démarrage de l\'application...');
    init();
    setupSpecialEvents();
});

/**
 * Gestion de la fermeture de la page
 */
window.addEventListener('beforeunload', (e) => {
    // Optionnel : avertir l'utilisateur avant de quitter
    if (simulation && !simulation.isPaused && simulation.currentEra >= 4) {
        e.preventDefault();
        e.returnValue = 'La simulation est en cours. Voulez-vous vraiment quitter ?';
    }
});

/**
 * Exposer certaines fonctions pour le debug dans la console
 */
window.debugSimulation = {
    getSimulation: () => simulation,
    getRenderer: () => renderer,
    getUI: () => ui,
    pause: () => simulation.pause(),
    resume: () => simulation.resume(),
    setSpeed: (speed) => simulation.setSpeed(speed),
    skipToEra: (era) => {
        simulation.currentEra = Math.max(1, Math.min(6, era));
        console.log(`Ère changée à : ${simulation.currentEra}`);
    },
    showSummary: () => ui.showSummary(),
    addPopulation: (amount) => {
        if (simulation.entities.tribes.length > 0) {
            const tribe = simulation.entities.tribes[0];
            for (let i = 0; i < amount; i++) {
                tribe.members.push(new Human(tribe.x, tribe.y, tribe.id));
            }
        }
    }
};

console.log('💡 Fonctions de debug disponibles dans window.debugSimulation');
