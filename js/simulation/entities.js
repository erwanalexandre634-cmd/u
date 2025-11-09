/**
 * entities.js
 * Définition de toutes les entités du simulateur d'évolution
 * - Particules et atomes
 * - Molécules et cellules
 * - Organismes et humains
 * - Tribus, villes, civilisations
 */

// ========== PARTICULES & ATOMES (ÈRE 1) ==========

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.energy = 100 + Math.random() * 200; // Plus d'énergie initiale
        this.type = 'particle';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.energy -= 0.005; // Perte d'énergie réduite
    }
}

class Atom {
    constructor(x, y, element = 'H') {
        this.x = x;
        this.y = y;
        this.element = element; // H, C, O, N, etc.
        this.bonds = [];
        this.stability = Math.random() * 100;
        this.type = 'atom';
    }

    canBond(other) {
        return this.bonds.length < 4 && other.bonds.length < 4;
    }
}

// ========== MOLÉCULES & CELLULES (ÈRE 2) ==========

class Molecule {
    constructor(x, y, complexity = 1) {
        this.x = x;
        this.y = y;
        this.complexity = complexity; // 1-10
        this.energy = complexity * 100; // Plus d'énergie
        this.type = 'molecule';
        this.canReplicate = complexity > 5;
    }

    update() {
        this.energy -= 0.02; // Perte réduite
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = 100;
        this.age = 0;
        this.reproduction = 0;
        this.mutations = 0;
        this.type = 'cell';
        this.alive = true;
    }

    update() {
        this.age++;
        this.energy -= 0.5;
        this.reproduction += 0.1;

        // Mort naturelle
        if (this.energy <= 0 || this.age > 1000) {
            this.alive = false;
        }
    }

    canReproduce() {
        return this.alive && this.energy > 50 && this.reproduction > 10;
    }

    reproduce() {
        this.reproduction = 0;
        this.energy -= 30;
        return new Cell(
            this.x + (Math.random() - 0.5) * 10,
            this.y + (Math.random() - 0.5) * 10
        );
    }
}

// ========== ORGANISMES (ÈRE 3) ==========

class Organism {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = 150;
        this.age = 0;
        this.intelligence = Math.random() * 10;
        this.strength = Math.random() * 10;
        this.sociability = Math.random() * 10;
        this.type = 'organism';
        this.alive = true;
        this.species = 'basic';
    }

    update() {
        this.age++;
        this.energy -= 0.8;

        // Mort
        if (this.energy <= 0 || this.age > 500) {
            this.alive = false;
        }

        // Mouvement aléatoire
        this.x += (Math.random() - 0.5) * 2;
        this.y += (Math.random() - 0.5) * 2;
    }

    evolve() {
        // Mutation génétique
        this.intelligence += (Math.random() - 0.4) * 0.5;
        this.strength += (Math.random() - 0.4) * 0.5;
        this.sociability += (Math.random() - 0.4) * 0.5;
    }
}

// ========== HUMAINS & TRIBUS (ÈRE 4) ==========

class Human {
    constructor(x, y, tribeId = null) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.alive = true;
        this.tribeId = tribeId;
        this.type = 'human';
        this.gender = Math.random() > 0.5 ? 'male' : 'female';
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        this.age++;

        // Mort naturelle (espérance de vie ~70 ans simulés)
        if (this.age > 70 * 365 || Math.random() < 0.0001) {
            this.alive = false;
        }
    }

    moveTo(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.vx = (dx / dist) * 0.5;
            this.vy = (dy / dist) * 0.5;
        }

        this.x += this.vx;
        this.y += this.vy;
    }
}

class Tribe {
    constructor(x, y, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.members = [];
        this.food = 100;
        this.stability = 50;
        this.territory = 100;
        this.type = 'tribe';
        this.age = 0;
        this.culture = Math.random() * 10;

        // Créer population initiale
        for (let i = 0; i < 10; i++) {
            this.members.push(new Human(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                id
            ));
        }
    }

    update() {
        this.age++;

        // Mise à jour des membres
        this.members = this.members.filter(m => m.alive);
        this.members.forEach(m => m.update());

        // Ressources
        this.food += Math.random() * 2; // Collecte de nourriture
        this.food -= this.members.length * 0.1; // Consommation

        // Natalité (probabilité augmentée)
        if (this.food > 30 && this.members.length < 100 && Math.random() < 0.05) {
            this.members.push(new Human(
                this.x + (Math.random() - 0.5) * 20,
                this.y + (Math.random() - 0.5) * 20,
                this.id
            ));
        }

        // Mortalité si famine
        if (this.food < 0) {
            if (Math.random() < 0.1 && this.members.length > 0) {
                this.members[0].alive = false;
            }
        }
    }

    getPopulation() {
        return this.members.length;
    }

    canBecomeVillage() {
        return this.getPopulation() > 20 && this.stability > 40 && this.age > 50; // Conditions réduites
    }
}

// ========== VILLES & CIVILISATIONS (ÈRE 5) ==========

class City {
    constructor(x, y, id, fromTribe = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.population = fromTribe ? fromTribe.getPopulation() : 50;
        this.technology = 1;
        this.military = 10;
        this.culture = fromTribe ? fromTribe.culture : 5;
        this.stability = 70;
        this.type = 'city';
        this.civilizationId = null;
        this.age = 0;
        this.buildings = {
            houses: 10,
            farms: 5,
            workshops: 0,
            barracks: 0
        };
    }

    update() {
        this.age++;

        // Croissance de la population
        if (this.stability > 50 && this.population < 10000) {
            this.population += Math.random() * this.population * 0.001;
        }

        // Progression technologique (probabilité et gain augmentés)
        if (Math.random() < 0.01) {
            this.technology += 0.3;
        }

        // Développement militaire
        this.military = Math.floor(this.population * 0.1 * (1 + this.technology * 0.1));

        // Stabilité fluctue
        this.stability += (Math.random() - 0.5) * 2;
        this.stability = Math.max(0, Math.min(100, this.stability));

        // Construction automatique
        if (Math.random() < 0.005) {
            const buildingTypes = Object.keys(this.buildings);
            const randomBuilding = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
            this.buildings[randomBuilding]++;
        }
    }

    canBecomeCivilization() {
        return this.population > 500 && this.technology > 3 && this.age > 200; // Conditions réduites
    }

    getMilitaryPower() {
        return this.military * (1 + this.technology * 0.2);
    }
}

class Civilization {
    constructor(id, capital) {
        this.id = id;
        this.name = this.generateName();
        this.capital = capital;
        this.cities = [capital];
        this.technology = capital.technology;
        this.culture = capital.culture;
        this.government = this.chooseGovernment();
        this.aggressiveness = Math.random() * 100;
        this.type = 'civilization';
        this.age = 0;
        this.territory = 0;
        this.atWar = false;
    }

    generateName() {
        const prefixes = ['Neo', 'Alta', 'Prima', 'Magna', 'Terra', 'Astra', 'Nova'];
        const suffixes = ['polis', 'land', 'ium', 'ia', 'um', 'terra', 'reich'];
        return prefixes[Math.floor(Math.random() * prefixes.length)] +
               suffixes[Math.floor(Math.random() * suffixes.length)];
    }

    chooseGovernment() {
        const types = ['Monarchie', 'République', 'Empire', 'Démocratie', 'Théocratie'];
        return types[Math.floor(Math.random() * types.length)];
    }

    update() {
        this.age++;

        // Mise à jour des villes
        this.cities.forEach(city => {
            city.update();
            city.civilizationId = this.id;
        });

        // Calcul moyennes
        const totalPop = this.getTotalPopulation();
        const avgTech = this.cities.reduce((sum, c) => sum + c.technology, 0) / this.cities.length;

        this.technology = avgTech;
        this.territory = this.cities.length * 100;

        // Progression technologique civilisationnelle (probabilité augmentée)
        if (Math.random() < 0.01 * this.cities.length) {
            this.technology += 0.8;
            this.cities.forEach(c => c.technology = this.technology);
        }
    }

    getTotalPopulation() {
        return this.cities.reduce((sum, city) => sum + city.population, 0);
    }

    getTotalMilitary() {
        return this.cities.reduce((sum, city) => sum + city.getMilitaryPower(), 0);
    }

    canDeclareWar() {
        return !this.atWar && this.getTotalMilitary() > 100 && Math.random() < this.aggressiveness / 10000;
    }

    addCity(city) {
        city.civilizationId = this.id;
        this.cities.push(city);
    }

    removeCity(city) {
        this.cities = this.cities.filter(c => c.id !== city.id);
    }
}

// ========== GUERRE ==========

class War {
    constructor(id, attacker, defender) {
        this.id = id;
        this.attacker = attacker; // Civilization
        this.defender = defender; // Civilization
        this.duration = 0;
        this.intensity = Math.random() * 100;
        this.type = 'war';
        this.active = true;
    }

    update() {
        this.duration++;

        // Combat : comparaison des forces
        const attackerPower = this.attacker.getTotalMilitary();
        const defenderPower = this.defender.getTotalMilitary();

        // Pertes de population
        const casualties = Math.floor(Math.random() * 100 * this.intensity / 10);

        if (this.attacker.cities.length > 0) {
            const city = this.attacker.cities[Math.floor(Math.random() * this.attacker.cities.length)];
            city.population = Math.max(0, city.population - casualties);
        }

        if (this.defender.cities.length > 0) {
            const city = this.defender.cities[Math.floor(Math.random() * this.defender.cities.length)];
            city.population = Math.max(0, city.population - casualties);
        }

        // Condition de fin
        if (this.duration > 100 || Math.random() < 0.01) {
            this.resolve();
        }
    }

    resolve() {
        this.active = false;
        this.attacker.atWar = false;
        this.defender.atWar = false;

        const attackerPower = this.attacker.getTotalMilitary();
        const defenderPower = this.defender.getTotalMilitary();

        // Détermine le vainqueur
        const attackerWins = attackerPower > defenderPower * (0.8 + Math.random() * 0.4);

        if (attackerWins && this.defender.cities.length > 1) {
            // L'attaquant annexe une ville
            const cityToAnnex = this.defender.cities[Math.floor(Math.random() * this.defender.cities.length)];
            this.defender.removeCity(cityToAnnex);
            this.attacker.addCity(cityToAnnex);
            this.winner = this.attacker;
        } else {
            this.winner = this.defender;
        }
    }

    getWinner() {
        return this.winner || null;
    }
}

// Export pour utilisation globale
if (typeof window !== 'undefined') {
    window.Particle = Particle;
    window.Atom = Atom;
    window.Molecule = Molecule;
    window.Cell = Cell;
    window.Organism = Organism;
    window.Human = Human;
    window.Tribe = Tribe;
    window.City = City;
    window.Civilization = Civilization;
    window.War = War;
}
