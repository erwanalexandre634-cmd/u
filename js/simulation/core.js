/**
 * core.js
 * Cœur de la simulation d'évolution
 * - Gestion du temps simulé
 * - Passage des ères (atomes → molécules → vie → humains → civilisations)
 * - Orchestration de tous les systèmes
 */

class SimulationCore {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        // Temps et ères
        this.simulatedTime = 0; // en "années" simulées
        this.currentEra = 1;
        this.tickSpeed = 1; // Multiplicateur de vitesse
        this.isPaused = false;

        // Compteurs d'ID uniques
        this.nextTribeId = 1;
        this.nextCityId = 1;
        this.nextCivId = 1;
        this.nextWarId = 1;

        // Entités (selon l'ère)
        this.entities = {
            particles: [],
            atoms: [],
            molecules: [],
            cells: [],
            organisms: [],
            humans: [],
            tribes: [],
            cities: [],
            civilizations: [],
            wars: []
        };

        // Systèmes
        this.eventSystem = new EventSystem();
        this.eventGenerator = new RandomEventGenerator(this.eventSystem);

        // Statistiques
        this.stats = {
            totalPopulation: 0,
            totalCivilizations: 0,
            totalWars: 0,
            averageTech: 0,
            totalTribes: 0,
            totalCities: 0
        };

        // Initialiser selon l'ère
        this.initializeEra1();
    }

    // ========== GESTION DU TEMPS ==========

    /**
     * Mise à jour de la simulation (appelée à chaque tick)
     */
    update(deltaTime = 1) {
        if (this.isPaused) return;

        // Avancer le temps (vitesse variable selon l'ère)
        const timeIncrement = this.getTimeIncrement() * this.tickSpeed;
        this.simulatedTime += timeIncrement;

        // Mettre à jour selon l'ère actuelle
        switch(this.currentEra) {
            case 1:
                this.updateEra1();
                break;
            case 2:
                this.updateEra2();
                break;
            case 3:
                this.updateEra3();
                break;
            case 4:
                this.updateEra4();
                break;
            case 5:
                this.updateEra5();
                break;
            case 6:
                this.updateEra6();
                break;
        }

        // Générer des événements aléatoires
        this.eventGenerator.generate(this.currentEra, this.entities, this.simulatedTime);

        // Vérifier les conditions de passage à l'ère suivante
        this.checkEraTransition();

        // Mettre à jour les statistiques
        this.updateStats();
    }

    /**
     * Retourne l'incrément de temps selon l'ère (en années simulées par tick)
     * Les premières ères passent très vite, les dernières sont plus lentes
     */
    getTimeIncrement() {
        switch(this.currentEra) {
            case 1: return 1000000; // 1 million d'années par tick
            case 2: return 100000;  // 100k années
            case 3: return 10000;   // 10k années
            case 4: return 100;     // 100 années
            case 5: return 10;      // 10 années
            case 6: return 1;       // 1 année
            default: return 1;
        }
    }

    // ========== ÈRE 1 : PARTICULES & ATOMES ==========

    initializeEra1() {
        this.eventSystem.trigger('evolution', 'Big Bang ! L\'univers prend forme...', { era: 1 });

        // Créer des particules initiales
        for (let i = 0; i < 200; i++) {
            this.entities.particles.push(new Particle(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }
    }

    updateEra1() {
        // Mise à jour des particules
        this.entities.particles.forEach(p => p.update());

        // Suppression des particules sans énergie
        this.entities.particles = this.entities.particles.filter(p => p.energy > 0);

        // Formation d'atomes (probabilité)
        if (Math.random() < 0.05 && this.entities.particles.length > 2) {
            const p1 = this.entities.particles[0];
            const p2 = this.entities.particles[1];

            const elements = ['H', 'He', 'C', 'O', 'N'];
            const atom = new Atom(
                (p1.x + p2.x) / 2,
                (p1.y + p2.y) / 2,
                elements[Math.floor(Math.random() * elements.length)]
            );

            this.entities.atoms.push(atom);

            // Retirer les particules fusionnées
            this.entities.particles.splice(0, 2);
        }

        // Formation de molécules simples
        if (this.entities.atoms.length > 10 && Math.random() < 0.01) {
            const a1 = this.entities.atoms[0];
            const a2 = this.entities.atoms[1];

            const molecule = new Molecule((a1.x + a2.x) / 2, (a1.y + a2.y) / 2, 1);
            this.entities.molecules.push(molecule);

            this.entities.atoms.splice(0, 2);
        }
    }

    /**
     * Condition de passage à l'ère 2
     * Au moins 50 molécules formées
     */
    checkEra1ToEra2() {
        return this.entities.molecules.length >= 50;
    }

    // ========== ÈRE 2 : CHIMIE → VIE ==========

    transitionToEra2() {
        this.currentEra = 2;
        this.eventSystem.trigger('evolution', 'ÈRE 2 : La chimie donne naissance à la vie primitive', { era: 2 });

        // Nettoyer les particules et atomes
        this.entities.particles = [];
        this.entities.atoms = [];
    }

    updateEra2() {
        // Mise à jour des molécules
        this.entities.molecules.forEach(m => m.update());

        // Suppression des molécules sans énergie
        this.entities.molecules = this.entities.molecules.filter(m => m.energy > 0);

        // Complexification des molécules
        if (Math.random() < 0.02 && this.entities.molecules.length > 10) {
            const m1 = this.entities.molecules[Math.floor(Math.random() * this.entities.molecules.length)];
            const newComplexity = Math.min(m1.complexity + 1, 10);

            const complexMolecule = new Molecule(m1.x, m1.y, newComplexity);
            this.entities.molecules.push(complexMolecule);
        }

        // Apparition de cellules (molécules auto-réplicantes)
        const replicatingMolecules = this.entities.molecules.filter(m => m.canReplicate);
        if (replicatingMolecules.length > 0 && Math.random() < 0.01) {
            const m = replicatingMolecules[0];
            const cell = new Cell(m.x, m.y);
            this.entities.cells.push(cell);
        }

        // Mise à jour des cellules
        this.entities.cells.forEach(c => c.update());

        // Reproduction des cellules
        const newCells = [];
        this.entities.cells.forEach(cell => {
            if (cell.canReproduce()) {
                newCells.push(cell.reproduce());
            }
        });
        this.entities.cells.push(...newCells);

        // Suppression des cellules mortes
        this.entities.cells = this.entities.cells.filter(c => c.alive);
    }

    checkEra2ToEra3() {
        return this.entities.cells.length >= 100;
    }

    // ========== ÈRE 3 : ORGANISMES COMPLEXES ==========

    transitionToEra3() {
        this.currentEra = 3;
        this.eventSystem.trigger('evolution', 'ÈRE 3 : Émergence d\'organismes multicellulaires complexes', { era: 3 });

        // Convertir certaines cellules en organismes
        for (let i = 0; i < 20; i++) {
            this.entities.organisms.push(new Organism(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }

        // Nettoyer les molécules et cellules
        this.entities.molecules = [];
        this.entities.cells = [];
    }

    updateEra3() {
        // Mise à jour des organismes
        this.entities.organisms.forEach(o => {
            o.update();

            // Confinement à la zone
            o.x = Math.max(0, Math.min(this.width, o.x));
            o.y = Math.max(0, Math.min(this.height, o.y));
        });

        // Suppression des organismes morts
        this.entities.organisms = this.entities.organisms.filter(o => o.alive);

        // Reproduction / évolution
        if (Math.random() < 0.05 && this.entities.organisms.length < 100) {
            const parent = this.entities.organisms[Math.floor(Math.random() * this.entities.organisms.length)];
            if (parent) {
                const child = new Organism(parent.x + (Math.random() - 0.5) * 20, parent.y + (Math.random() - 0.5) * 20);
                child.intelligence = parent.intelligence + (Math.random() - 0.5);
                child.strength = parent.strength + (Math.random() - 0.5);
                child.sociability = parent.sociability + (Math.random() - 0.5);
                this.entities.organisms.push(child);
            }
        }

        // Mutations aléatoires
        if (Math.random() < 0.01) {
            this.entities.organisms.forEach(o => {
                if (Math.random() < 0.1) {
                    o.evolve();
                }
            });
        }
    }

    checkEra3ToEra4() {
        // Quand certains organismes deviennent très intelligents et sociables
        const smartSocialOrganisms = this.entities.organisms.filter(
            o => o.intelligence > 7 && o.sociability > 7
        );
        return smartSocialOrganisms.length >= 10;
    }

    // ========== ÈRE 4 : TRIBUS HUMAINES ==========

    transitionToEra4() {
        this.currentEra = 4;
        this.eventSystem.trigger('evolution', 'ÈRE 4 : Une espèce intelligente émerge : les premiers humains', { era: 4 });

        // Créer les premières tribus
        for (let i = 0; i < 3; i++) {
            const tribe = new Tribe(
                Math.random() * this.width,
                Math.random() * this.height,
                this.nextTribeId++
            );
            this.entities.tribes.push(tribe);
        }

        // Nettoyer les organismes
        this.entities.organisms = [];
    }

    updateEra4() {
        // Mise à jour des tribus
        this.entities.tribes.forEach(tribe => {
            tribe.update();

            // Mouvement léger de la tribu
            if (Math.random() < 0.01) {
                tribe.x += (Math.random() - 0.5) * 5;
                tribe.y += (Math.random() - 0.5) * 5;
                tribe.x = Math.max(50, Math.min(this.width - 50, tribe.x));
                tribe.y = Math.max(50, Math.min(this.height - 50, tribe.y));
            }
        });

        // Suppression des tribus éteintes
        this.entities.tribes = this.entities.tribes.filter(t => t.getPopulation() > 0);

        // Fission de tribus (si trop grande)
        const newTribes = [];
        this.entities.tribes.forEach(tribe => {
            if (tribe.getPopulation() > 80 && Math.random() < 0.005) {
                // Créer une nouvelle tribu
                const newTribe = new Tribe(
                    tribe.x + (Math.random() - 0.5) * 50,
                    tribe.y + (Math.random() - 0.5) * 50,
                    this.nextTribeId++
                );
                newTribe.members = tribe.members.splice(0, Math.floor(tribe.members.length / 2));
                newTribes.push(newTribe);

                this.eventSystem.trigger('birth', `Une tribu se scinde en deux groupes`, { era: 4 });
            }
        });
        this.entities.tribes.push(...newTribes);

        // Apparition spontanée de nouvelles tribus (rarement)
        if (this.entities.tribes.length < 10 && Math.random() < 0.001) {
            this.entities.tribes.push(new Tribe(
                Math.random() * this.width,
                Math.random() * this.height,
                this.nextTribeId++
            ));
        }
    }

    checkEra4ToEra5() {
        // Au moins une tribu prête à devenir village
        return this.entities.tribes.some(t => t.canBecomeVillage());
    }

    // ========== ÈRE 5 : CIVILISATIONS ==========

    transitionToEra5() {
        this.currentEra = 5;
        this.eventSystem.trigger('evolution', 'ÈRE 5 : Les tribus deviennent des cités, naissance des civilisations', { era: 5 });

        // Convertir les tribus avancées en villes
        this.entities.tribes.forEach(tribe => {
            if (tribe.canBecomeVillage() || tribe.getPopulation() > 20) {
                const city = new City(tribe.x, tribe.y, this.nextCityId++, tribe);
                this.entities.cities.push(city);
            }
        });

        // Nettoyer les tribus
        this.entities.tribes = [];
    }

    updateEra5() {
        // Mise à jour des villes
        this.entities.cities.forEach(city => city.update());

        // Suppression des villes détruites
        this.entities.cities = this.entities.cities.filter(c => c.population > 0);

        // Création de nouvelles villes (rarement)
        if (this.entities.cities.length < 20 && Math.random() < 0.0005) {
            this.entities.cities.push(new City(
                Math.random() * this.width,
                Math.random() * this.height,
                this.nextCityId++
            ));
        }

        // Formation de civilisations
        this.entities.cities.forEach(city => {
            if (city.canBecomeCivilization() && !city.civilizationId) {
                const civ = new Civilization(this.nextCivId++, city);
                this.entities.civilizations.push(civ);
            }
        });

        // Mise à jour des civilisations
        this.entities.civilizations.forEach(civ => civ.update());

        // Suppression des civilisations sans villes
        this.entities.civilizations = this.entities.civilizations.filter(civ => civ.cities.length > 0);

        // Déclaration de guerres
        this.entities.civilizations.forEach(attacker => {
            if (attacker.canDeclareWar()) {
                // Chercher un adversaire
                const potentialDefenders = this.entities.civilizations.filter(
                    c => c.id !== attacker.id && !c.atWar
                );

                if (potentialDefenders.length > 0) {
                    const defender = potentialDefenders[Math.floor(Math.random() * potentialDefenders.length)];

                    const war = new War(this.nextWarId++, attacker, defender);
                    this.entities.wars.push(war);

                    attacker.atWar = true;
                    defender.atWar = true;
                }
            }
        });

        // Mise à jour des guerres
        this.entities.wars.forEach(war => {
            if (war.active) {
                war.update();
            }
        });

        // Suppression des guerres terminées (après un délai)
        this.entities.wars = this.entities.wars.filter(w => w.active || w.duration < 150);

        // Expansion des civilisations (annexion de villes indépendantes)
        if (Math.random() < 0.001) {
            const independentCities = this.entities.cities.filter(c => !c.civilizationId);
            if (independentCities.length > 0 && this.entities.civilizations.length > 0) {
                const city = independentCities[0];
                const civ = this.entities.civilizations[Math.floor(Math.random() * this.entities.civilizations.length)];
                civ.addCity(city);
            }
        }
    }

    checkEra5ToEra6() {
        // Passage à l'ère moderne quand tech moyenne > 30
        if (this.entities.civilizations.length === 0) return false;

        const avgTech = this.entities.civilizations.reduce((sum, c) => sum + c.technology, 0) / this.entities.civilizations.length;
        return avgTech > 30;
    }

    // ========== ÈRE 6 : MODERNE / FUTUR ==========

    transitionToEra6() {
        this.currentEra = 6;
        this.eventSystem.trigger('evolution', 'ÈRE 6 : L\'humanité entre dans l\'ère moderne et au-delà...', { era: 6 });
    }

    updateEra6() {
        // Même logique que l'ère 5 mais avec progression tech plus rapide
        this.updateEra5();

        // Accélération de la recherche technologique
        this.entities.civilizations.forEach(civ => {
            if (Math.random() < 0.01) {
                civ.technology += 0.5;
            }
        });
    }

    // ========== TRANSITION D'ÈRES ==========

    checkEraTransition() {
        let shouldTransition = false;

        switch(this.currentEra) {
            case 1:
                shouldTransition = this.checkEra1ToEra2();
                if (shouldTransition) this.transitionToEra2();
                break;
            case 2:
                shouldTransition = this.checkEra2ToEra3();
                if (shouldTransition) this.transitionToEra3();
                break;
            case 3:
                shouldTransition = this.checkEra3ToEra4();
                if (shouldTransition) this.transitionToEra4();
                break;
            case 4:
                shouldTransition = this.checkEra4ToEra5();
                if (shouldTransition) this.transitionToEra5();
                break;
            case 5:
                shouldTransition = this.checkEra5ToEra6();
                if (shouldTransition) this.transitionToEra6();
                break;
        }
    }

    // ========== STATISTIQUES ==========

    updateStats() {
        // Population totale
        let totalPop = 0;
        this.entities.tribes.forEach(t => totalPop += t.getPopulation());
        this.entities.cities.forEach(c => totalPop += Math.floor(c.population));

        this.stats.totalPopulation = totalPop;
        this.stats.totalCivilizations = this.entities.civilizations.length;
        this.stats.totalWars = this.entities.wars.filter(w => w.active).length;
        this.stats.totalTribes = this.entities.tribes.length;
        this.stats.totalCities = this.entities.cities.length;

        // Niveau techno moyen
        if (this.entities.civilizations.length > 0) {
            this.stats.averageTech = Math.floor(
                this.entities.civilizations.reduce((sum, c) => sum + c.technology, 0) / this.entities.civilizations.length
            );
        } else if (this.entities.cities.length > 0) {
            this.stats.averageTech = Math.floor(
                this.entities.cities.reduce((sum, c) => sum + c.technology, 0) / this.entities.cities.length
            );
        } else {
            this.stats.averageTech = 0;
        }
    }

    // ========== CONTRÔLES ==========

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    setSpeed(speed) {
        this.tickSpeed = speed;
    }

    // ========== ACCESSEURS ==========

    getEraName() {
        const eraNames = {
            1: 'Ère 1: Particules & Atomes',
            2: 'Ère 2: Chimie & Vie Primitive',
            3: 'Ère 3: Organismes Complexes',
            4: 'Ère 4: Tribus Humaines',
            5: 'Ère 5: Civilisations',
            6: 'Ère 6: Moderne & Futur'
        };
        return eraNames[this.currentEra] || 'Inconnue';
    }

    getFormattedTime() {
        if (this.simulatedTime > 1000000) {
            return `${(this.simulatedTime / 1000000).toFixed(1)} Ma`; // Millions d'années
        } else if (this.simulatedTime > 1000) {
            return `${(this.simulatedTime / 1000).toFixed(1)} ka`; // Milliers d'années
        } else {
            return `${Math.floor(this.simulatedTime)} ans`;
        }
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.SimulationCore = SimulationCore;
}
