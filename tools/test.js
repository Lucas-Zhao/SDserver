exports.abilities = {
	monsoonsurge: {
		onStart: function(source) {
			this.field.setWeather('raindance');
			this.field.weatherState.duration = 10;
		},
		flags: {},
		name: "Monsoon Surge",
		rating: 4,
		num: -1000,
	},
	blizzardveil: {
		onStart: function(source) {
			this.field.setWeather('snow');
			this.field.weatherState.duration = 10;
		},
		flags: {},
		name: "Blizzard Veil",
		rating: 4,
		num: -1001,
	},
	sandstormrage: {
		onStart: function(source) {
			this.field.setWeather('sandstorm');
			this.field.weatherState.duration = 10;
		},
		flags: {},
		name: "Sandstorm Rage",
		rating: 4,
		num: -1002,
	},
	solarflare: {
		onStart: function(source) {
			this.field.setWeather('sunnyday');
			this.field.weatherState.duration = 10;
		},
		flags: {},
		name: "Solar Flare",
		rating: 4,
		num: -1003,
	},
	"eerieresonance": {
		onStart: function(source) {
			this.field.setTerrain('electricterrain');
			this.field.terrainState.duration = 10;
		},
		flags: {},
		name: "Eerie Resonance",
		rating: 4,
		num: -1004,
	},
	"mindscapedomain": {
		onStart: function(source) {
			this.field.setTerrain('psychicterrain');
			this.field.terrainState.duration = 10;
		},
		flags: {},
		name: "Mindscape Domain",
		rating: 4,
		num: -1005,
	},
	"verdantbloom": {
		onStart: function(source) {
			this.field.setTerrain('grassyterrain');
			this.field.terrainState.duration = 10;
		},
		flags: {},
		name: "Verdant Bloom",
		rating: 4,
		num: -1006,
	},
	"mystichaze": {
		onStart: function(source) {
			this.field.setTerrain('mistyterrain');
			this.field.terrainState.duration = 10;
		},
		flags: {},
		name: "Mystic Haze",
		rating: 4,
		num: -1007,
	},
	"tundrecore": {
		onStart: function(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange: function(pokemon) {
			if(!this.field.isWeather("snow")) return;
			const bestStat = pokemon.getBestStat(true, true);
			this.boost({[bestStat]: 1.5}, pokemon);
		},
		flags: {},
		name: "Tundre Core",
		rating: 4,
		num: -1008,
	},
	"desertheart": {
		onStart: function(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange: function(pokemon) {
			if(!this.field.isWeather("sandstorm")) return;
			const bestStat = pokemon.getBestStat(true, true);
			this.boost({[bestStat]: 1.5}, pokemon);
		},
		flags: {},
		name: "Desert Heart",
		rating: 4,
		num: -1009,
	},
	"aquacircuit": {
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if(!this.field.isWeather("raindance")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "atk") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if(!this.field.isWeather("raindance")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spa") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 5,
		onModifyDef: function(atk, attacker, defender, move) {
			if(!this.field.isWeather("raindance")) return;
			const bestStat = defender.getBestStat(true, true);
			if (bestStat === "def") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD: function(atk, attacker, defender, move) {
			if(!this.field.isWeather("raindance")) return;
			const bestStat = defender.getBestStat(true, true);
			if (bestStat === "spd") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 5,
		onModifySpe: function(atk, attacker, defender, move) {
			if(!this.field.isWeather("raindance")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spe") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifyDef: function(attacker) {
			if(!this.field.isWeather("raindance")) return;
			const bestStat = attacker.getBestStat(true, true);
			this.boost({[bestStat]: 1.5}, attacker);
		},
		flags: {},
		name: "Aqua Circuit",
		rating: 4,
		num: -1010,
	},
	"psychicpulse": {
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("psychicterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "atk") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("psychicterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spa") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 5,
		onModifyDef: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("psychicterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "def") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("psychicterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spd") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 5,
		onModifySpe: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("psychicterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spe") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},

		flags: {},
		name: "Psychic Pulse",
		rating: 4,
		num: -1011,
	},

	"mysticaura": {
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("mistyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "atk") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("mistyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spa") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 5,
		onModifyDef: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("mistyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "def") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("mistyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spd") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 5,
		onModifySpe: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("mistyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spe") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},

		flags: {},
		name: "Mystic Aura",
		rating: 4,
		num: -1012,
	},

	"overgrowthengine": {
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("grassyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "atk") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("grassyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spa") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 5,
		onModifyDef: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("grassyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "def") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("grassyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spd") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 5,
		onModifySpe: function(atk, attacker, defender, move) {
			if(!this.field.isTerrain("grassyterrain")) return;
			const bestStat = attacker.getBestStat(true, true);
			if (bestStat === "spe") {
				this.debug('Weather boost');
				return this.chainModify(1.5);
			}
		},

		flags: {},
		name: "Overgrowth Engine",
		rating: 4,
		num: -1013,
	},

	"arcanemight": {
		onModifySpAPriority: 5,
		onModifySpA: function(spa) {
			return this.chainModify(2);
		},
		flags: {},
		name: "Arcane Might",
		rating: 5,
		num: -1014,
	},
	
	"terrify": {
		onStart: function(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Terrify', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Terrify",
		rating: 3.5,
		num: -1015,
	},

	"charisma": {
		onSourceAfterFaint: function(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa: length}, source);
			}
		},
		flags: {},
		name: "Charisma",
		rating: 3,
		num: -1016,
	},

	"mentalfortitue": {
		onDamagingHit: function(damage, target, source, effect) {
			this.boost({spd: 1});
		},
		flags: {},
		name: "Mental Fortitude",
		rating: 4,
		num: -1017,
	},

	"bootsofruin": {
		onStart: function(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Boots of Ruin');
		},
		onAnyModifySpe: function(spe, target) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Boots of Ruin')) return;
		//	if (!move.ruinedSpe?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
		//	if (move.ruinedDef !== abilityHolder) return;
			this.debug('Boots of Ruin Spe drop');
			return this.chainModify(0.75);
		},
		flags: {},
		name: "Boots of Ruin",
		rating: 4.5,
		num: -1018,
	},

	"prismaticaura": {
		onDamagingHitOrder: 1,
		onDamagingHit: function(damage, target, source, move) {
			if (move.basePower > 0 && !this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		flags: {},
		name: "Prismatic Aura",
		rating: 2.5,
		num: -1019,
	},

	"adaptivemastery": {
		onModifyAtkPriority: 5,
		onModifyAtk: function(atk, attacker, defender, move) {
			if (true) {
				this.debug('Adaptive Mastery boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function(atk, attacker, defender, move) {
			if (true) {
				this.debug('Adaptive Mastery boost');
				return this.chainModify(1.5);
			}
		},
		flags: {},
		name: "Adaptive Mastery",
		rating: 3.5,
		num: -1020,
	},

	"stormbloom": {
		onStart: function(pokemon) {
			this.field.setWeather('raindance');
			this.field.weatherState.duration = 8;

			this.field.setTerrain('grassyterrain');
			this.field.terrainState.duration = 8;
		},
		flags: {},
		name: "Stormbloom",
		rating: 4,
		num: -1021,
	},

	
	"solarmist": {
		onStart: function(pokemon) {
			this.field.setWeather('sunnyday');
			this.field.weatherState.duration = 8;

			this.field.setTerrain('mistyterrain');
			this.field.terrainState.duration = 8;
		},
		flags: {},
		name: "Solar Mist",
		rating: 4,
		num: -1022,
	},
	"desertmind": {
		onStart: function(pokemon) {
			this.field.setWeather('sandstorm');
			this.field.weatherState.duration = 8;

			this.field.setTerrain('psychicterrain');
			this.field.terrainState.duration = 8;
		},
		flags: {},
		name: "Desert Mind",
		rating: 4,
		num: -1023,
	},
	"frostvolt": {
		onStart: function(pokemon) {
			this.field.setWeather('snow');
			this.field.weatherState.duration = 8;

			this.field.setTerrain('electricterrain');
			this.field.terrainState.duration = 8;
		},
		flags: {},
		name: "Frostvolt",
		rating: 4,
		num: -1024,
	},
	"soulharvest": {
		onSourceAfterFaint: function(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				console.log(source)
				source.heal(source.baseMaxhp / 4)
				this.add('-ability', source, 'Soul Harvest');
				this.add('-heal', source, source.getHealth, 'ability: Soul Harvest');
			}
		},
		flags: {},
		name: "Soul Harvest",
		rating: 4,
		num: -1025,
	},


	"entomize": {
		onModifyTypePriority: -1,
		onModifyType: function(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Bug';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower: function(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
		name: "Entomize",
		rating: 4,
		num: -1026,
	},

} 