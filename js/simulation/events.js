/**
 * events.js
 * Système de gestion des événements de la simulation
 * - Mutations, catastrophes, découvertes
 * - Guerres, traités, révolutions
 * - Extinctions, épidémies
 */

class EventSystem {
    constructor() {
        this.listeners = [];
        this.eventHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Enregistre un écouteur d'événements
     */
    on(callback) {
        this.listeners.push(callback);
    }

    /**
     * Déclenche un événement
     */
    trigger(eventType, message, data = {}) {
        const event = {
            type: eventType,
            message: message,
            data: data,
            timestamp: Date.now()
        };

        this.eventHistory.unshift(event);

        // Limite la taille de l'historique
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.pop();
        }

        // Notifie tous les écouteurs
        this.listeners.forEach(callback => callback(event));
    }

    /**
     * Récupère l'historique des événements
     */
    getHistory(limit = 20) {
        return this.eventHistory.slice(0, limit);
    }

    /**
     * Nettoie les anciens événements
     */
    clear() {
        this.eventHistory = [];
    }
}

/**
 * Générateur d'événements aléatoires selon l'ère
 */
class RandomEventGenerator {
    constructor(eventSystem) {
        this.eventSystem = eventSystem;
        this.lastDisaster = 0;
        this.lastDiscovery = 0;
    }

    /**
     * Génère des événements aléatoires pour l'ère 1 (Particules & Atomes)
     */
    generateEra1Events(entities, simulatedTime) {
        // Formation d'atomes
        if (Math.random() < 0.001) {
            this.eventSystem.trigger('evolution', 'Formation spontanée d\'atomes complexes', {
                era: 1,
                time: simulatedTime
            });
        }

        // Fusion atomique
        if (Math.random() < 0.0005) {
            this.eventSystem.trigger('birth', 'Fusion atomique détectée : nouvelles particules créées', {
                era: 1,
                time: simulatedTime
            });
        }
    }

    /**
     * Génère des événements pour l'ère 2 (Chimie & Vie)
     */
    generateEra2Events(entities, simulatedTime) {
        const cells = entities.cells || [];

        // Mutation majeure
        if (Math.random() < 0.002 && cells.length > 0) {
            this.eventSystem.trigger('evolution', `Mutation génétique majeure : ${cells.length} cellules affectées`, {
                era: 2,
                time: simulatedTime
            });
        }

        // Première réplication
        if (cells.length === 1) {
            this.eventSystem.trigger('birth', 'Première cellule auto-réplicante créée !', {
                era: 2,
                time: simulatedTime
            });
        }

        // Explosion de vie
        if (cells.length > 100 && cells.length < 105) {
            this.eventSystem.trigger('evolution', 'Explosion de biodiversité cellulaire', {
                era: 2,
                time: simulatedTime
            });
        }
    }

    /**
     * Génère des événements pour l'ère 3 (Organismes)
     */
    generateEra3Events(entities, simulatedTime) {
        const organisms = entities.organisms || [];

        // Apparition d'intelligence
        if (organisms.length > 0) {
            const smartOnes = organisms.filter(o => o.intelligence > 8);
            if (smartOnes.length > 0 && Math.random() < 0.001) {
                this.eventSystem.trigger('evolution', `Émergence d'organismes hautement intelligents (${smartOnes.length})`, {
                    era: 3,
                    time: simulatedTime
                });
            }
        }

        // Extinction partielle
        if (Math.random() < 0.0005 && organisms.length > 10) {
            this.eventSystem.trigger('disaster', 'Événement d\'extinction : perte de biodiversité', {
                era: 3,
                time: simulatedTime
            });
        }

        // Comportement social
        if (organisms.length > 50 && Math.random() < 0.001) {
            this.eventSystem.trigger('evolution', 'Développement de comportements sociaux complexes', {
                era: 3,
                time: simulatedTime
            });
        }
    }

    /**
     * Génère des événements pour l'ère 4 (Tribus)
     */
    generateEra4Events(entities, simulatedTime) {
        const tribes = entities.tribes || [];

        // Nouvelle tribu
        if (tribes.length > 0 && tribes[tribes.length - 1].age < 5) {
            this.eventSystem.trigger('birth', `Nouvelle tribu fondée (${tribes.length} tribus actives)`, {
                era: 4,
                time: simulatedTime
            });
        }

        // Conflit entre tribus
        if (tribes.length > 1 && Math.random() < 0.001) {
            const t1 = tribes[Math.floor(Math.random() * tribes.length)];
            const t2 = tribes[Math.floor(Math.random() * tribes.length)];
            if (t1 !== t2) {
                this.eventSystem.trigger('war', `Conflit territorial entre deux tribus`, {
                    era: 4,
                    time: simulatedTime
                });
            }
        }

        // Famine
        tribes.forEach(tribe => {
            if (tribe.food < 10 && Math.random() < 0.01) {
                this.eventSystem.trigger('disaster', `Une tribu souffre de famine (${tribe.getPopulation()} membres)`, {
                    era: 4,
                    time: simulatedTime,
                    tribeId: tribe.id
                });
            }
        });

        // Découverte (agriculture, outils)
        if (Math.random() < 0.0005) {
            const discoveries = ['l\'agriculture', 'les outils en pierre', 'le feu', 'la roue', 'l\'écriture primitive'];
            const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
            this.eventSystem.trigger('evolution', `Une tribu découvre ${discovery}`, {
                era: 4,
                time: simulatedTime
            });
        }
    }

    /**
     * Génère des événements pour l'ère 5 (Civilisations)
     */
    generateEra5Events(entities, simulatedTime) {
        const cities = entities.cities || [];
        const civilizations = entities.civilizations || [];
        const wars = entities.wars || [];

        // Fondation de ville
        if (cities.length > 0 && cities[cities.length - 1].age < 5) {
            this.eventSystem.trigger('birth', `Nouvelle ville fondée : ${cities.length} villes dans le monde`, {
                era: 5,
                time: simulatedTime
            });
        }

        // Fondation de civilisation
        if (civilizations.length > 0 && civilizations[civilizations.length - 1].age < 5) {
            const civ = civilizations[civilizations.length - 1];
            this.eventSystem.trigger('evolution', `Naissance de la civilisation ${civ.name} (${civ.government})`, {
                era: 5,
                time: simulatedTime
            });
        }

        // Guerre déclarée
        if (wars.length > 0 && wars[wars.length - 1].duration < 2) {
            const war = wars[wars.length - 1];
            this.eventSystem.trigger('war', `Guerre ! ${war.attacker.name} attaque ${war.defender.name}`, {
                era: 5,
                time: simulatedTime
            });
        }

        // Fin de guerre
        wars.forEach(war => {
            if (!war.active && war.duration === 100) {
                const winner = war.getWinner();
                if (winner) {
                    this.eventSystem.trigger('evolution', `Fin de la guerre : ${winner.name} est victorieuse`, {
                        era: 5,
                        time: simulatedTime
                    });
                }
            }
        });

        // Découverte technologique
        civilizations.forEach(civ => {
            if (Math.random() < 0.0002) {
                const discoveries = [
                    'la métallurgie',
                    'l\'écriture',
                    'les mathématiques',
                    'l\'astronomie',
                    'la médecine',
                    'l\'architecture avancée',
                    'la navigation'
                ];
                const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
                this.eventSystem.trigger('evolution', `${civ.name} découvre ${discovery}`, {
                    era: 5,
                    time: simulatedTime,
                    civId: civ.id
                });
            }
        });

        // Catastrophe naturelle
        if (Math.random() < 0.0001 && cities.length > 0) {
            const disasters = ['tremblement de terre', 'inondation', 'épidémie', 'sécheresse'];
            const disaster = disasters[Math.floor(Math.random() * disasters.length)];
            const city = cities[Math.floor(Math.random() * cities.length)];

            city.population = Math.floor(city.population * 0.7);
            city.stability -= 20;

            this.eventSystem.trigger('disaster', `${disaster} frappe une ville : pertes massives`, {
                era: 5,
                time: simulatedTime,
                cityId: city.id
            });
        }

        // Révolution/Coup d'état
        civilizations.forEach(civ => {
            if (Math.random() < 0.0001 && civ.cities.length > 0) {
                const city = civ.cities[0];
                if (city.stability < 30) {
                    this.eventSystem.trigger('war', `Révolution dans ${civ.name} : changement de gouvernement`, {
                        era: 5,
                        time: simulatedTime,
                        civId: civ.id
                    });
                    civ.government = civ.chooseGovernment();
                    city.stability += 20;
                }
            }
        });

        // Âge d'or culturel
        civilizations.forEach(civ => {
            if (Math.random() < 0.0001 && civ.cities.reduce((sum, c) => sum + c.stability, 0) / civ.cities.length > 70) {
                this.eventSystem.trigger('evolution', `${civ.name} entre dans un âge d'or culturel`, {
                    era: 5,
                    time: simulatedTime,
                    civId: civ.id
                });
                civ.culture += 10;
            }
        });
    }

    /**
     * Génère des événements pour l'ère 6 (Moderne/Futur)
     */
    generateEra6Events(entities, simulatedTime) {
        const civilizations = entities.civilizations || [];

        // Avancée technologique majeure
        civilizations.forEach(civ => {
            if (civ.technology > 50 && Math.random() < 0.0005) {
                const techs = [
                    'l\'électricité',
                    'le moteur à vapeur',
                    'l\'aviation',
                    'l\'informatique',
                    'l\'intelligence artificielle',
                    'la fusion nucléaire',
                    'le voyage spatial'
                ];
                const tech = techs[Math.min(Math.floor(civ.technology / 10), techs.length - 1)];
                this.eventSystem.trigger('evolution', `${civ.name} maîtrise ${tech}`, {
                    era: 6,
                    time: simulatedTime,
                    civId: civ.id
                });
            }
        });

        // Crise mondiale
        if (Math.random() < 0.00005 && civilizations.length > 1) {
            this.eventSystem.trigger('disaster', 'Crise mondiale : tensions internationales', {
                era: 6,
                time: simulatedTime
            });
        }

        // Traité de paix mondial
        if (Math.random() < 0.00003 && civilizations.length > 2) {
            this.eventSystem.trigger('evolution', 'Traité de paix mondial signé : nouvelle ère de coopération', {
                era: 6,
                time: simulatedTime
            });
        }

        // Singularité technologique
        const avgTech = civilizations.reduce((sum, c) => sum + c.technology, 0) / civilizations.length;
        if (avgTech > 100 && Math.random() < 0.0001) {
            this.eventSystem.trigger('evolution', 'Singularité technologique atteinte : l\'humanité entre dans une nouvelle ère', {
                era: 6,
                time: simulatedTime
            });
        }
    }

    /**
     * Point d'entrée principal pour générer des événements
     */
    generate(era, entities, simulatedTime) {
        switch(era) {
            case 1:
                this.generateEra1Events(entities, simulatedTime);
                break;
            case 2:
                this.generateEra2Events(entities, simulatedTime);
                break;
            case 3:
                this.generateEra3Events(entities, simulatedTime);
                break;
            case 4:
                this.generateEra4Events(entities, simulatedTime);
                break;
            case 5:
                this.generateEra5Events(entities, simulatedTime);
                break;
            case 6:
                this.generateEra6Events(entities, simulatedTime);
                break;
        }
    }
}

// Export global
if (typeof window !== 'undefined') {
    window.EventSystem = EventSystem;
    window.RandomEventGenerator = RandomEventGenerator;
}
