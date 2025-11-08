/**
 * renderer.js
 * Moteur de rendu pour afficher la simulation
 * - Rendu adapté à chaque ère
 * - Visualisation des particules, cellules, humains, villes, civilisations
 */

class Renderer {
    constructor(canvas, simulation) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.simulation = simulation;

        // Paramètres de vue
        this.cameraX = 0;
        this.cameraY = 0;
        this.zoom = 1;

        // Configuration du canvas
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Ajuste la taille du canvas à la zone disponible
     */
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    /**
     * Dessine un frame complet de la simulation
     */
    render() {
        // Effacer le canvas
        this.ctx.fillStyle = '#050a15';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner selon l'ère actuelle
        switch(this.simulation.currentEra) {
            case 1:
                this.renderEra1();
                break;
            case 2:
                this.renderEra2();
                break;
            case 3:
                this.renderEra3();
                break;
            case 4:
                this.renderEra4();
                break;
            case 5:
            case 6:
                this.renderEra5And6();
                break;
        }

        // Afficher les infos de debug
        this.renderDebugInfo();
    }

    // ========== RENDU ÈRE 1 : PARTICULES & ATOMES ==========

    renderEra1() {
        const entities = this.simulation.entities;

        // Dessiner les particules
        entities.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(100, 150, 255, ${particle.energy / 100})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Dessiner les atomes (plus gros, colorés)
        const atomColors = {
            'H': '#ff6b6b',
            'He': '#ffd93d',
            'C': '#6bcf7f',
            'O': '#4ecdc4',
            'N': '#a78bfa'
        };

        entities.atoms.forEach(atom => {
            this.ctx.fillStyle = atomColors[atom.element] || '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(atom.x, atom.y, 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Nom de l'élément
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(atom.element, atom.x + 6, atom.y);
        });

        // Dessiner les molécules
        entities.molecules.forEach(molecule => {
            const radius = 3 + molecule.complexity;
            this.ctx.fillStyle = `rgba(255, 200, 100, ${molecule.energy / (molecule.complexity * 50)})`;
            this.ctx.beginPath();
            this.ctx.arc(molecule.x, molecule.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Contour si complexe
            if (molecule.complexity > 5) {
                this.ctx.strokeStyle = '#ffd700';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    // ========== RENDU ÈRE 2 : VIE PRIMITIVE ==========

    renderEra2() {
        const entities = this.simulation.entities;

        // Dessiner les molécules (plus petites)
        entities.molecules.forEach(molecule => {
            const radius = 2 + molecule.complexity / 2;
            this.ctx.fillStyle = `rgba(100, 200, 150, ${molecule.energy / (molecule.complexity * 50)})`;
            this.ctx.beginPath();
            this.ctx.arc(molecule.x, molecule.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Dessiner les cellules (vertes, pulsantes)
        entities.cells.forEach(cell => {
            const pulse = Math.sin(cell.age * 0.1) * 2;
            const radius = 5 + pulse;

            // Cellule
            this.ctx.fillStyle = `rgba(100, 255, 150, ${cell.energy / 100})`;
            this.ctx.beginPath();
            this.ctx.arc(cell.x, cell.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Noyau
            this.ctx.fillStyle = 'rgba(50, 200, 100, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(cell.x, cell.y, radius / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // ========== RENDU ÈRE 3 : ORGANISMES ==========

    renderEra3() {
        const entities = this.simulation.entities;

        // Dessiner les organismes
        entities.organisms.forEach(organism => {
            // Couleur basée sur l'intelligence
            const intelligenceColor = Math.floor(organism.intelligence * 25);
            this.ctx.fillStyle = `rgb(${100 + intelligenceColor}, ${150 + intelligenceColor}, 255)`;

            // Taille basée sur la force
            const size = 5 + organism.strength * 0.5;

            // Corps
            this.ctx.beginPath();
            this.ctx.arc(organism.x, organism.y, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Indicateur d'intelligence (yeux)
            if (organism.intelligence > 5) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(organism.x - size/3, organism.y - size/3, 2, 0, Math.PI * 2);
                this.ctx.arc(organism.x + size/3, organism.y - size/3, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    // ========== RENDU ÈRE 4 : TRIBUS ==========

    renderEra4() {
        const entities = this.simulation.entities;

        // Dessiner les territoires des tribus (cercles de fond)
        entities.tribes.forEach(tribe => {
            this.ctx.fillStyle = 'rgba(100, 150, 200, 0.1)';
            this.ctx.beginPath();
            this.ctx.arc(tribe.x, tribe.y, Math.sqrt(tribe.territory), 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Dessiner chaque humain individuellement
        entities.tribes.forEach(tribe => {
            const tribeColor = this.getTribeColor(tribe.id);

            tribe.members.forEach(human => {
                // Humain (petit point)
                this.ctx.fillStyle = tribeColor;
                this.ctx.beginPath();
                this.ctx.arc(human.x, human.y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Centre de la tribu (feu de camp / village primitif)
            this.ctx.fillStyle = '#ff6b00';
            this.ctx.strokeStyle = tribeColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(tribe.x, tribe.y, 8, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fill();

            // Nom/info de la tribu
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px sans-serif';
            this.ctx.fillText(`Tribu ${tribe.id} (${tribe.getPopulation()})`, tribe.x + 15, tribe.y - 10);
        });
    }

    // ========== RENDU ÈRE 5 & 6 : CIVILISATIONS ==========

    renderEra5And6() {
        const entities = this.simulation.entities;

        // Dessiner les territoires des civilisations
        entities.civilizations.forEach(civ => {
            const civColor = this.getCivColor(civ.id);

            civ.cities.forEach(city => {
                // Territoire de la ville
                this.ctx.fillStyle = civColor.replace('rgb', 'rgba').replace(')', ', 0.1)');
                this.ctx.beginPath();
                this.ctx.arc(city.x, city.y, 30 + Math.sqrt(city.population) / 5, 0, Math.PI * 2);
                this.ctx.fill();
            });
        });

        // Dessiner les villes
        entities.cities.forEach(city => {
            const isCivCity = city.civilizationId !== null;
            const cityColor = isCivCity ? this.getCivColor(city.civilizationId) : '#888888';
            const size = 10 + Math.min(city.population / 100, 30);

            // Ville (carré)
            this.ctx.fillStyle = cityColor;
            this.ctx.fillRect(city.x - size/2, city.y - size/2, size, size);

            // Contour
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(city.x - size/2, city.y - size/2, size, size);

            // Bâtiments (petits rectangles)
            const buildingCount = Math.min(Math.floor(city.population / 200), 8);
            for (let i = 0; i < buildingCount; i++) {
                const angle = (i / buildingCount) * Math.PI * 2;
                const bx = city.x + Math.cos(angle) * size;
                const by = city.y + Math.sin(angle) * size;

                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.fillRect(bx - 2, by - 2, 4, 4);
            }

            // Info de la ville
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '11px sans-serif';
            this.ctx.fillText(
                `${Math.floor(city.population)} | Tech: ${Math.floor(city.technology)}`,
                city.x + size/2 + 5,
                city.y
            );

            // Indicateur de capitale
            if (isCivCity) {
                const civ = entities.civilizations.find(c => c.id === city.civilizationId);
                if (civ && civ.capital.id === city.id) {
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.beginPath();
                    this.ctx.arc(city.x, city.y - size/2 - 8, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        });

        // Dessiner les connexions entre villes d'une même civilisation
        entities.civilizations.forEach(civ => {
            if (civ.cities.length > 1) {
                const civColor = this.getCivColor(civ.id);
                this.ctx.strokeStyle = civColor.replace('rgb', 'rgba').replace(')', ', 0.3)');
                this.ctx.lineWidth = 1;

                for (let i = 0; i < civ.cities.length - 1; i++) {
                    const c1 = civ.cities[i];
                    const c2 = civ.cities[i + 1];

                    this.ctx.beginPath();
                    this.ctx.moveTo(c1.x, c1.y);
                    this.ctx.lineTo(c2.x, c2.y);
                    this.ctx.stroke();
                }
            }
        });

        // Dessiner les guerres en cours
        entities.wars.forEach(war => {
            if (war.active && war.attacker.cities.length > 0 && war.defender.cities.length > 0) {
                const city1 = war.attacker.capital || war.attacker.cities[0];
                const city2 = war.defender.capital || war.defender.cities[0];

                // Ligne de guerre (rouge, pulsante)
                const pulse = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
                this.ctx.strokeStyle = `rgba(255, 50, 50, ${0.5 + pulse * 0.5})`;
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([10, 5]);

                this.ctx.beginPath();
                this.ctx.moveTo(city1.x, city1.y);
                this.ctx.lineTo(city2.x, city2.y);
                this.ctx.stroke();

                this.ctx.setLineDash([]);
            }
        });

        // Légende des civilisations
        this.renderCivilizationLegend();
    }

    // ========== LÉGENDE DES CIVILISATIONS ==========

    renderCivilizationLegend() {
        const entities = this.simulation.entities;
        const civs = entities.civilizations;

        if (civs.length === 0) return;

        let y = 10;
        this.ctx.font = '12px sans-serif';

        civs.forEach((civ, index) => {
            const color = this.getCivColor(civ.id);

            // Carré de couleur
            this.ctx.fillStyle = color;
            this.ctx.fillRect(10, y, 15, 15);

            // Nom et info
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(
                `${civ.name} (${civ.government}) - Pop: ${Math.floor(civ.getTotalPopulation())}`,
                30,
                y + 12
            );

            y += 20;
        });
    }

    // ========== DEBUG INFO ==========

    renderDebugInfo() {
        // Afficher les informations de debug en bas à droite
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(this.canvas.width - 200, this.canvas.height - 80, 200, 80);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '11px monospace';
        this.ctx.fillText(`Ère: ${this.simulation.currentEra}`, this.canvas.width - 190, this.canvas.height - 60);
        this.ctx.fillText(`Temps: ${this.simulation.getFormattedTime()}`, this.canvas.width - 190, this.canvas.height - 45);
        this.ctx.fillText(`Vitesse: x${this.simulation.tickSpeed}`, this.canvas.width - 190, this.canvas.height - 30);
        this.ctx.fillText(`Pause: ${this.simulation.isPaused}`, this.canvas.width - 190, this.canvas.height - 15);
    }

    // ========== UTILITAIRES DE COULEURS ==========

    getTribeColor(tribeId) {
        const hue = (tribeId * 137) % 360; // Golden angle pour distribution uniforme
        return `hsl(${hue}, 70%, 60%)`;
    }

    getCivColor(civId) {
        const hue = (civId * 137) % 360;
        return `hsl(${hue}, 80%, 55%)`;
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.Renderer = Renderer;
}
