/**
 * ui.js
 * Gestion de l'interface utilisateur
 * - Mise à jour des panneaux de stats
 * - Affichage des événements
 * - Contrôles (pause, vitesse)
 * - Timeline
 */

class UI {
    constructor(simulation) {
        this.simulation = simulation;

        // Éléments DOM
        this.elements = {
            // Timeline
            eraIndicator: document.getElementById('era-indicator'),
            timeDisplay: document.getElementById('time-display'),

            // Stats
            statEra: document.getElementById('stat-era'),
            statPopulation: document.getElementById('stat-population'),
            statCivilizations: document.getElementById('stat-civilizations'),
            statTech: document.getElementById('stat-tech'),
            statWars: document.getElementById('stat-wars'),
            statTribes: document.getElementById('stat-tribes'),
            statCities: document.getElementById('stat-cities'),

            // Événements
            eventsLog: document.getElementById('events-log'),

            // Contrôles
            btnPause: document.getElementById('btn-pause'),
            btnSpeed1: document.getElementById('btn-speed-1'),
            btnSpeed2: document.getElementById('btn-speed-2'),
            btnSpeed4: document.getElementById('btn-speed-4'),
            fpsCounter: document.getElementById('fps-counter')
        };

        // FPS tracking
        this.lastFrameTime = Date.now();
        this.fps = 60;

        // Événements enregistrés
        this.maxEventsDisplayed = 50;

        // Configuration des contrôles
        this.setupControls();

        // Écouter les événements de simulation
        this.simulation.eventSystem.on((event) => this.onSimulationEvent(event));
    }

    /**
     * Configure les boutons de contrôle
     */
    setupControls() {
        // Bouton Pause/Resume
        this.elements.btnPause.addEventListener('click', () => {
            if (this.simulation.isPaused) {
                this.simulation.resume();
                this.elements.btnPause.textContent = '⏸️ Pause';
            } else {
                this.simulation.pause();
                this.elements.btnPause.textContent = '▶️ Reprendre';
            }
        });

        // Boutons de vitesse
        this.elements.btnSpeed1.addEventListener('click', () => {
            this.setSpeed(1);
        });

        this.elements.btnSpeed2.addEventListener('click', () => {
            this.setSpeed(2);
        });

        this.elements.btnSpeed4.addEventListener('click', () => {
            this.setSpeed(4);
        });
    }

    /**
     * Change la vitesse de simulation
     */
    setSpeed(speed) {
        this.simulation.setSpeed(speed);

        // Mettre à jour l'apparence des boutons
        [this.elements.btnSpeed1, this.elements.btnSpeed2, this.elements.btnSpeed4].forEach(btn => {
            btn.classList.remove('active');
        });

        if (speed === 1) this.elements.btnSpeed1.classList.add('active');
        if (speed === 2) this.elements.btnSpeed2.classList.add('active');
        if (speed === 4) this.elements.btnSpeed4.classList.add('active');
    }

    /**
     * Appelé à chaque événement de simulation
     */
    onSimulationEvent(event) {
        this.addEventToLog(event);
    }

    /**
     * Ajoute un événement au journal
     */
    addEventToLog(event) {
        const eventDiv = document.createElement('div');
        eventDiv.className = `event-entry ${event.type}`;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'event-time';
        timeDiv.textContent = this.simulation.getFormattedTime();

        const textDiv = document.createElement('div');
        textDiv.className = 'event-text';
        textDiv.textContent = event.message;

        eventDiv.appendChild(timeDiv);
        eventDiv.appendChild(textDiv);

        // Ajouter au début du log (plus récent en haut)
        this.elements.eventsLog.insertBefore(eventDiv, this.elements.eventsLog.firstChild);

        // Limiter le nombre d'événements affichés
        while (this.elements.eventsLog.children.length > this.maxEventsDisplayed) {
            this.elements.eventsLog.removeChild(this.elements.eventsLog.lastChild);
        }
    }

    /**
     * Mise à jour de l'interface (appelée chaque frame)
     */
    update() {
        this.updateTimeline();
        this.updateStats();
        this.updateFPS();
    }

    /**
     * Met à jour la timeline (ère et temps)
     */
    updateTimeline() {
        this.elements.eraIndicator.textContent = this.simulation.getEraName();
        this.elements.timeDisplay.textContent = `Temps: ${this.simulation.getFormattedTime()}`;
    }

    /**
     * Met à jour les statistiques
     */
    updateStats() {
        const stats = this.simulation.stats;

        this.elements.statEra.textContent = this.simulation.currentEra;
        this.elements.statPopulation.textContent = this.formatNumber(stats.totalPopulation);
        this.elements.statCivilizations.textContent = stats.totalCivilizations;
        this.elements.statTech.textContent = stats.averageTech;
        this.elements.statWars.textContent = stats.totalWars;
        this.elements.statTribes.textContent = stats.totalTribes;
        this.elements.statCities.textContent = stats.totalCities;
    }

    /**
     * Met à jour le compteur de FPS
     */
    updateFPS() {
        const now = Date.now();
        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;

        // Calcul FPS lissé
        const currentFps = 1000 / delta;
        this.fps = this.fps * 0.9 + currentFps * 0.1;

        this.elements.fpsCounter.textContent = `FPS: ${Math.round(this.fps)}`;
    }

    /**
     * Formate un nombre pour l'affichage
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(2)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        } else {
            return Math.floor(num).toString();
        }
    }

    /**
     * Affiche un message d'alerte temporaire (pour événements majeurs)
     */
    showAlert(message, type = 'info') {
        // Créer une notification temporaire
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(20, 25, 45, 0.95);
            border: 2px solid #ffd700;
            color: #ffd700;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out forwards;
        `;
        alert.textContent = message;

        document.body.appendChild(alert);

        // Supprimer après animation
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 3000);
    }

    /**
     * Affiche un résumé de fin de simulation
     */
    showSummary() {
        const summary = this.generateSummary();

        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 15, 30, 0.95);
            border: 3px solid #ffd700;
            color: #e0e0e0;
            padding: 40px;
            border-radius: 15px;
            max-width: 600px;
            z-index: 1001;
            font-family: 'Segoe UI', sans-serif;
        `;

        summaryDiv.innerHTML = `
            <h2 style="color: #6fb3ff; margin-bottom: 20px;">🌍 Résumé de la Simulation</h2>
            <div style="line-height: 1.8;">
                ${summary}
            </div>
            <button id="close-summary" style="
                margin-top: 20px;
                background: #3a4d8f;
                color: white;
                border: none;
                padding: 10px 30px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            ">Fermer</button>
        `;

        document.body.appendChild(summaryDiv);

        document.getElementById('close-summary').addEventListener('click', () => {
            document.body.removeChild(summaryDiv);
        });
    }

    /**
     * Génère le résumé de la simulation
     */
    generateSummary() {
        const stats = this.simulation.stats;
        const entities = this.simulation.entities;

        let html = '<ul style="list-style: none; padding: 0;">';
        html += `<li>⏱️ <b>Temps total simulé:</b> ${this.simulation.getFormattedTime()}</li>`;
        html += `<li>🌟 <b>Ère atteinte:</b> ${this.simulation.getEraName()}</li>`;
        html += `<li>👥 <b>Population maximale:</b> ${this.formatNumber(stats.totalPopulation)}</li>`;
        html += `<li>🏛️ <b>Civilisations créées:</b> ${stats.totalCivilizations}</li>`;
        html += `<li>🏙️ <b>Villes fondées:</b> ${stats.totalCities}</li>`;
        html += `<li>⚔️ <b>Guerres totales:</b> ${entities.wars.length}</li>`;
        html += `<li>🔬 <b>Niveau technologique moyen:</b> ${stats.averageTech}</li>`;

        if (entities.civilizations.length > 0) {
            const dominantCiv = entities.civilizations.reduce((max, civ) =>
                civ.getTotalPopulation() > max.getTotalPopulation() ? civ : max
            );
            html += `<li>👑 <b>Civilisation dominante:</b> ${dominantCiv.name} (${this.formatNumber(dominantCiv.getTotalPopulation())} habitants)</li>`;
        }

        html += '</ul>';
        return html;
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.UI = UI;
}
