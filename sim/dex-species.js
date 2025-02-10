"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexSpecies = exports.Learnset = exports.Species = void 0;
var dex_data_1 = require("./dex-data");
var utils_1 = require("../lib/utils");
var node_util_1 = require("node:util");
var Species = /** @class */ (function (_super) {
    __extends(Species, _super);
    function Species(data) {
        var _this = _super.call(this, data) || this;
        _this.fullname = "pokemon: ".concat(data.name);
        _this.effectType = 'Pokemon';
        _this.baseSpecies = data.baseSpecies || _this.name;
        _this.forme = data.forme || '';
        _this.baseForme = data.baseForme || '';
        _this.cosmeticFormes = data.cosmeticFormes || undefined;
        _this.otherFormes = data.otherFormes || undefined;
        _this.formeOrder = data.formeOrder || undefined;
        _this.spriteid = data.spriteid ||
            ((0, dex_data_1.toID)(_this.baseSpecies) + (_this.baseSpecies !== _this.name ? "-".concat((0, dex_data_1.toID)(_this.forme)) : ''));
        _this.abilities = data.abilities || { 0: "" };
        _this.types = data.types || ['???'];
        _this.addedType = data.addedType || undefined;
        _this.prevo = data.prevo || '';
        _this.tier = data.tier || '';
        _this.doublesTier = data.doublesTier || '';
        _this.natDexTier = data.natDexTier || '';
        _this.evos = data.evos || [];
        _this.evoType = data.evoType || undefined;
        _this.evoMove = data.evoMove || undefined;
        _this.evoLevel = data.evoLevel || undefined;
        _this.nfe = data.nfe || false;
        _this.eggGroups = data.eggGroups || [];
        _this.canHatch = data.canHatch || false;
        _this.gender = data.gender || '';
        _this.genderRatio = data.genderRatio || (_this.gender === 'M' ? { M: 1, F: 0 } :
            _this.gender === 'F' ? { M: 0, F: 1 } :
                _this.gender === 'N' ? { M: 0, F: 0 } :
                    { M: 0.5, F: 0.5 });
        _this.requiredItem = data.requiredItem || undefined;
        _this.requiredItems = data.requiredItems || (_this.requiredItem ? [_this.requiredItem] : undefined);
        _this.baseStats = data.baseStats || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        _this.bst = _this.baseStats.hp + _this.baseStats.atk + _this.baseStats.def +
            _this.baseStats.spa + _this.baseStats.spd + _this.baseStats.spe;
        _this.weightkg = data.weightkg || 0;
        _this.weighthg = _this.weightkg * 10;
        _this.heightm = data.heightm || 0;
        _this.color = data.color || '';
        _this.tags = data.tags || [];
        _this.unreleasedHidden = data.unreleasedHidden || false;
        _this.maleOnlyHidden = !!data.maleOnlyHidden;
        _this.maxHP = data.maxHP || undefined;
        _this.isMega = !!(_this.forme && ['Mega', 'Mega-X', 'Mega-Y'].includes(_this.forme)) || undefined;
        _this.canGigantamax = data.canGigantamax || undefined;
        _this.gmaxUnreleased = !!data.gmaxUnreleased;
        _this.cannotDynamax = !!data.cannotDynamax;
        _this.battleOnly = data.battleOnly || (_this.isMega ? _this.baseSpecies : undefined);
        _this.changesFrom = data.changesFrom ||
            (_this.battleOnly !== _this.baseSpecies ? _this.battleOnly : _this.baseSpecies);
        if (Array.isArray(_this.changesFrom))
            _this.changesFrom = _this.changesFrom[0];
        _this.pokemonGoData = data.pokemonGoData || undefined;
        if (!_this.gen && _this.num >= 1) {
            if (_this.num >= 906 || _this.forme.includes('Paldea')) {
                _this.gen = 9;
            }
            else if (_this.num >= 810 || ['Gmax', 'Galar', 'Galar-Zen', 'Hisui'].includes(_this.forme)) {
                _this.gen = 8;
            }
            else if (_this.num >= 722 || _this.forme.startsWith('Alola') || _this.forme === 'Starter') {
                _this.gen = 7;
            }
            else if (_this.forme === 'Primal') {
                _this.gen = 6;
                _this.isPrimal = true;
                _this.battleOnly = _this.baseSpecies;
            }
            else if (_this.num >= 650 || _this.isMega) {
                _this.gen = 6;
            }
            else if (_this.num >= 494) {
                _this.gen = 5;
            }
            else if (_this.num >= 387) {
                _this.gen = 4;
            }
            else if (_this.num >= 252) {
                _this.gen = 3;
            }
            else if (_this.num >= 152) {
                _this.gen = 2;
            }
            else {
                _this.gen = 1;
            }
        }
        (0, dex_data_1.assignMissingFields)(_this, data);
        return _this;
    }
    return Species;
}(dex_data_1.BasicEffect));
exports.Species = Species;
var EMPTY_SPECIES = utils_1.Utils.deepFreeze(new Species({
    id: '', name: '', exists: false,
    tier: 'Illegal', doublesTier: 'Illegal',
    natDexTier: 'Illegal', isNonstandard: 'Custom',
}));
var Learnset = /** @class */ (function () {
    function Learnset(data, species) {
        this.exists = true;
        this.effectType = 'Learnset';
        this.learnset = data.learnset || undefined;
        this.eventOnly = !!data.eventOnly;
        this.eventData = data.eventData || undefined;
        this.encounters = data.encounters || undefined;
        this.species = species;
    }
    return Learnset;
}());
exports.Learnset = Learnset;
var DexSpecies = /** @class */ (function () {
    function DexSpecies(dex) {
        this.speciesCache = new Map();
        this.learnsetCache = new Map();
        this.allCache = null;
        this.dex = dex;
    }
    DexSpecies.prototype.get = function (name) {
        if (name && typeof name !== 'string')
            return name;
        var id = '';
        if (name) {
            name = name.trim();
            id = (0, dex_data_1.toID)(name);
            if (id === 'nidoran' && name.endsWith('♀')) {
                id = 'nidoranf';
            }
            else if (id === 'nidoran' && name.endsWith('♂')) {
                id = 'nidoranm';
            }
        }
        return this.getByID(id);
    };
    DexSpecies.prototype.getByID = function (id) {
        var _this = this;
        if (id === '')
            return EMPTY_SPECIES;
        var species = this.speciesCache.get(id);
        if (species)
            return species;
        if (this.dex.data.Aliases.hasOwnProperty(id)) {
            if (this.dex.data.FormatsData.hasOwnProperty(id)) {
                // special event ID, like Rockruff-Dusk
                var baseId = (0, dex_data_1.toID)(this.dex.data.Aliases[id]);
                species = new Species(__assign(__assign(__assign({}, this.dex.data.Pokedex[baseId]), this.dex.data.FormatsData[id]), { name: id }));
                species.abilities = { 0: species.abilities['S'] };
            }
            else {
                species = this.get(this.dex.data.Aliases[id]);
                if (species.cosmeticFormes) {
                    for (var _i = 0, _a = species.cosmeticFormes; _i < _a.length; _i++) {
                        var forme = _a[_i];
                        if ((0, dex_data_1.toID)(forme) === id) {
                            species = new Species(__assign(__assign({}, species), { name: forme, forme: forme.slice(species.name.length + 1), baseForme: "", baseSpecies: species.name, otherFormes: null, cosmeticFormes: null }));
                            break;
                        }
                    }
                }
            }
            this.speciesCache.set(id, this.dex.deepFreeze(species));
            return species;
        }
        if (!this.dex.data.Pokedex.hasOwnProperty(id)) {
            var aliasTo = '';
            var formeNames = {
                alola: ['a', 'alola', 'alolan'],
                galar: ['g', 'galar', 'galarian'],
                hisui: ['h', 'hisui', 'hisuian'],
                paldea: ['p', 'paldea', 'paldean'],
                mega: ['m', 'mega'],
                primal: ['p', 'primal'],
            };
            for (var forme in formeNames) {
                var pokeName = '';
                for (var _b = 0, _c = formeNames[forme]; _b < _c.length; _b++) {
                    var i = _c[_b];
                    if (id.startsWith(i)) {
                        pokeName = id.slice(i.length);
                    }
                    else if (id.endsWith(i)) {
                        pokeName = id.slice(0, -i.length);
                    }
                }
                if (this.dex.data.Aliases.hasOwnProperty(pokeName))
                    pokeName = (0, dex_data_1.toID)(this.dex.data.Aliases[pokeName]);
                if (this.dex.data.Pokedex[pokeName + forme]) {
                    aliasTo = pokeName + forme;
                    break;
                }
            }
            if (aliasTo) {
                species = this.get(aliasTo);
                if (species.exists) {
                    this.speciesCache.set(id, species);
                    return species;
                }
            }
        }
        if (id && this.dex.data.Pokedex.hasOwnProperty(id)) {
            var pokedexData = this.dex.data.Pokedex[id];
            var baseSpeciesTags = pokedexData.baseSpecies && this.dex.data.Pokedex[(0, dex_data_1.toID)(pokedexData.baseSpecies)].tags;
            species = new Species(__assign(__assign({ tags: baseSpeciesTags }, pokedexData), this.dex.data.FormatsData[id]));
            // Inherit any statuses from the base species (Arceus, Silvally).
            var baseSpeciesStatuses = this.dex.data.Conditions[(0, dex_data_1.toID)(species.baseSpecies)];
            if (baseSpeciesStatuses !== undefined) {
                for (var key in baseSpeciesStatuses) {
                    if (!(key in species)) {
                        species[key] = baseSpeciesStatuses[key];
                    }
                }
            }
            if (!species.tier && !species.doublesTier && !species.natDexTier && species.baseSpecies !== species.name) {
                if (species.baseSpecies === 'Mimikyu') {
                    species.tier = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.baseSpecies)].tier || 'Illegal';
                    species.doublesTier = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.baseSpecies)].doublesTier || 'Illegal';
                    species.natDexTier = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.baseSpecies)].natDexTier || 'Illegal';
                }
                else if (species.id.endsWith('totem')) {
                    species.tier = this.dex.data.FormatsData[species.id.slice(0, -5)].tier || 'Illegal';
                    species.doublesTier = this.dex.data.FormatsData[species.id.slice(0, -5)].doublesTier || 'Illegal';
                    species.natDexTier = this.dex.data.FormatsData[species.id.slice(0, -5)].natDexTier || 'Illegal';
                }
                else if (species.battleOnly) {
                    species.tier = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.battleOnly)].tier || 'Illegal';
                    species.doublesTier = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.battleOnly)].doublesTier || 'Illegal';
                    species.natDexTier = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.battleOnly)].natDexTier || 'Illegal';
                }
                else {
                    var baseFormatsData = this.dex.data.FormatsData[(0, dex_data_1.toID)(species.baseSpecies)];
                    if (!baseFormatsData) {
                        throw new Error("".concat(species.baseSpecies, " has no formats-data entry"));
                    }
                    species.tier = baseFormatsData.tier || 'Illegal';
                    species.doublesTier = baseFormatsData.doublesTier || 'Illegal';
                    species.natDexTier = baseFormatsData.natDexTier || 'Illegal';
                }
            }
            if (!species.tier)
                species.tier = 'Illegal';
            if (!species.doublesTier)
                species.doublesTier = species.tier;
            if (!species.natDexTier)
                species.natDexTier = species.tier;
            if (species.gen > this.dex.gen) {
                species.tier = 'Illegal';
                species.doublesTier = 'Illegal';
                species.natDexTier = 'Illegal';
                species.isNonstandard = 'Future';
            }
            if (this.dex.currentMod === 'gen7letsgo' && !species.isNonstandard) {
                var isLetsGo = ((species.num <= 151 || ['Meltan', 'Melmetal'].includes(species.name)) &&
                    (!species.forme || (['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(species.forme) &&
                        species.name !== 'Pikachu-Alola')));
                if (!isLetsGo)
                    species.isNonstandard = 'Past';
            }
            if (this.dex.currentMod === 'gen8bdsp' &&
                (!species.isNonstandard || ["Gigantamax", "CAP"].includes(species.isNonstandard))) {
                if (species.gen > 4 || (species.num < 1 && species.isNonstandard !== 'CAP') ||
                    species.id === 'pichuspikyeared') {
                    species.isNonstandard = 'Future';
                    species.tier = species.doublesTier = species.natDexTier = 'Illegal';
                }
            }
            species.nfe = species.evos.some(function (evo) {
                var evoSpecies = _this.get(evo);
                return !evoSpecies.isNonstandard ||
                    evoSpecies.isNonstandard === (species === null || species === void 0 ? void 0 : species.isNonstandard) ||
                    // Pokemon with Hisui evolutions
                    evoSpecies.isNonstandard === "Unobtainable";
            });
            species.canHatch = species.canHatch ||
                (!['Ditto', 'Undiscovered'].includes(species.eggGroups[0]) && !species.prevo && species.name !== 'Manaphy');
            if (this.dex.gen === 1)
                species.bst -= species.baseStats.spd;
            if (this.dex.gen < 5) {
                species.abilities = this.dex.deepClone(species.abilities);
                delete species.abilities['H'];
            }
            if (this.dex.gen === 3 && this.dex.abilities.get(species.abilities['1']).gen === 4)
                delete species.abilities['1'];
            if (this.dex.parentMod) {
                // if this species is exactly identical to parentMod's species, reuse parentMod's copy
                var parentMod = this.dex.mod(this.dex.parentMod);
                if (this.dex.data.Pokedex[id] === parentMod.data.Pokedex[id]) {
                    var parentSpecies = parentMod.species.getByID(id);
                    // checking tier cheaply filters out some non-matches.
                    // The construction logic is very complex so we ultimately need to do a deep equality check
                    if (species.tier === parentSpecies.tier && (0, node_util_1.isDeepStrictEqual)(species, parentSpecies)) {
                        species = parentSpecies;
                    }
                }
            }
        }
        else {
            species = new Species({
                id: id,
                name: id,
                exists: false, tier: 'Illegal', doublesTier: 'Illegal', natDexTier: 'Illegal', isNonstandard: 'Custom',
            });
        }
        if (species.exists)
            this.speciesCache.set(id, this.dex.deepFreeze(species));
        return species;
    };
    /**
     * @param id the ID of the species the move pool belongs to
     * @param isNatDex
     * @returns a Set of IDs of the full valid movepool of the given species for the current generation/mod.
     * Note that inter-move incompatibilities, such as those from exclusive events, are not considered and all moves are
     * lumped together. However, Necturna and Necturine's Sketchable moves are omitted from this pool, as their fundamental
     * incompatibility with each other is essential to the nature of those species.
     */
    DexSpecies.prototype.getMovePool = function (id, isNatDex) {
        var _this = this;
        if (isNatDex === void 0) { isNatDex = false; }
        var eggMovesOnly = false;
        var maxGen = this.dex.gen;
        var gen3HMMoves = ['cut', 'fly', 'surf', 'strength', 'flash', 'rocksmash', 'waterfall', 'dive'];
        var gen4HMMoves = ['cut', 'fly', 'surf', 'strength', 'rocksmash', 'waterfall', 'rockclimb'];
        var movePool = new Set();
        for (var _i = 0, _a = this.getFullLearnset(id); _i < _a.length; _i++) {
            var _b = _a[_i], species = _b.species, learnset = _b.learnset;
            if (!eggMovesOnly)
                eggMovesOnly = this.eggMovesOnly(species, this.get(id));
            for (var moveid in learnset) {
                if (species.isNonstandard !== 'CAP') {
                    if (gen4HMMoves.includes(moveid) && this.dex.gen >= 5) {
                        if (!learnset[moveid].some(function (source) { return parseInt(source.charAt(0)) >= 5 &&
                            parseInt(source.charAt(0)) <= _this.dex.gen; }))
                            continue;
                    }
                    else if (gen3HMMoves.includes(moveid) && this.dex.gen >= 4 &&
                        !learnset[moveid].some(function (source) { return parseInt(source.charAt(0)) >= 4 &&
                            parseInt(source.charAt(0)) <= _this.dex.gen; })) {
                        continue;
                    }
                }
                if (eggMovesOnly) {
                    if (learnset[moveid].some(function (source) { return source.startsWith('9E'); })) {
                        movePool.add(moveid);
                    }
                }
                else if (maxGen >= 9) {
                    // Pokemon Home now strips learnsets on withdrawal
                    if (isNatDex || learnset[moveid].some(function (source) { return source.startsWith('9'); })) {
                        movePool.add(moveid);
                    }
                }
                else {
                    if (learnset[moveid].some(function (source) { return parseInt(source.charAt(0)) <= maxGen; })) {
                        movePool.add(moveid);
                    }
                }
                if (moveid === 'sketch' && movePool.has('sketch')) {
                    if (species.isNonstandard === 'CAP') {
                        // Given what this function is generally used for, adding all sketchable moves to Necturna and Necturine's
                        // movepools would be undesirable as it would be impossible to tell sketched moves apart from normal ones
                        // so any code calling this one will need to get and handle those moves separately themselves
                        continue;
                    }
                    // Smeargle time
                    // A few moves like Dark Void were made unSketchable in a generation later than when they were introduced
                    // However, this has only happened in a gen where transfer moves are unavailable
                    var sketchables = this.dex.moves.all().filter(function (m) { return !m.flags['nosketch'] && !m.isNonstandard; });
                    for (var _c = 0, sketchables_1 = sketchables; _c < sketchables_1.length; _c++) {
                        var move = sketchables_1[_c];
                        movePool.add(move.id);
                    }
                    // Smeargle has some event moves; they're all sketchable, so let's just skip them
                    break;
                }
            }
            if (species.evoRegion) {
                // species can only evolve in this gen, so prevo can't have any moves
                // from after that gen
                if (this.dex.gen >= 9)
                    eggMovesOnly = true;
                if (this.dex.gen === 8 && species.evoRegion === 'Alola')
                    maxGen = 7;
            }
        }
        return movePool;
    };
    DexSpecies.prototype.getFullLearnset = function (id) {
        var originalSpecies = this.get(id);
        var species = originalSpecies;
        var out = [];
        var alreadyChecked = {};
        while ((species === null || species === void 0 ? void 0 : species.name) && !alreadyChecked[species.id]) {
            alreadyChecked[species.id] = true;
            var learnset = this.getLearnsetData(species.id);
            if (learnset.learnset) {
                out.push(learnset);
                species = this.learnsetParent(species, true);
                continue;
            }
            // no learnset
            if ((species.changesFrom || species.baseSpecies) !== species.name) {
                // forme without its own learnset
                species = this.get(species.changesFrom || species.baseSpecies);
                // warning: formes with their own learnset, like Wormadam, should NOT
                // inherit from their base forme unless they're freely switchable
                continue;
            }
            if (species.isNonstandard) {
                // It's normal for a nonstandard species not to have learnset data
                // Formats should replace the `Obtainable Moves` rule if they want to
                // allow pokemon without learnsets.
                return out;
            }
            if (species.prevo && this.getLearnsetData((0, dex_data_1.toID)(species.prevo)).learnset) {
                species = this.get((0, dex_data_1.toID)(species.prevo));
                continue;
            }
            // should never happen
            throw new Error("Species with no learnset data: ".concat(species.id));
        }
        return out;
    };
    DexSpecies.prototype.learnsetParent = function (species, checkingMoves) {
        if (checkingMoves === void 0) { checkingMoves = false; }
        // Own Tempo Rockruff and Battle Bond Greninja are special event formes
        // that are visually indistinguishable from their base forme but have
        // different learnsets. To prevent a leak, we make them show up as their
        // base forme, but hardcode their learnsets into Rockruff-Dusk and
        // Greninja-Ash
        if (['Gastrodon', 'Pumpkaboo', 'Sinistea', 'Tatsugiri'].includes(species.baseSpecies) && species.forme) {
            return this.get(species.baseSpecies);
        }
        else if (species.name === 'Lycanroc-Dusk') {
            return this.get('Rockruff-Dusk');
        }
        else if (species.prevo) {
            // there used to be a check for Hidden Ability here, but apparently it's unnecessary
            // Shed Skin Pupitar can definitely evolve into Unnerve Tyranitar
            species = this.get(species.prevo);
            if (species.gen > Math.max(2, this.dex.gen))
                return null;
            return species;
        }
        else if (species.changesFrom && species.baseSpecies !== 'Kyurem') {
            // For Pokemon like Rotom and Necrozma whose movesets are extensions are their base formes
            return this.get(species.changesFrom);
        }
        else if (checkingMoves && !species.prevo && species.baseSpecies && this.get(species.baseSpecies).prevo) {
            // For Pokemon like Cap Pikachu, who should be able to have egg moves in Gen 9
            var baseEvo = this.get(species.baseSpecies);
            while (baseEvo.prevo) {
                baseEvo = this.get(baseEvo.prevo);
            }
            return baseEvo;
        }
        return null;
    };
    /**
     * Gets the raw learnset data for the species.
     *
     * In practice, if you're trying to figure out what moves a pokemon learns,
     * you probably want to `getFullLearnset` or `getMovePool` instead.
     */
    DexSpecies.prototype.getLearnsetData = function (id) {
        var learnsetData = this.learnsetCache.get(id);
        if (learnsetData)
            return learnsetData;
        if (!this.dex.data.Learnsets.hasOwnProperty(id)) {
            return new Learnset({ exists: false }, this.get(id));
        }
        learnsetData = new Learnset(this.dex.data.Learnsets[id], this.get(id));
        this.learnsetCache.set(id, this.dex.deepFreeze(learnsetData));
        return learnsetData;
    };
    DexSpecies.prototype.getPokemonGoData = function (id) {
        return this.dex.data.PokemonGoData[id];
    };
    DexSpecies.prototype.all = function () {
        if (this.allCache)
            return this.allCache;
        var species = [];
        for (var id in this.dex.data.Pokedex) {
            species.push(this.getByID(id));
        }
        this.allCache = Object.freeze(species);
        return this.allCache;
    };
    DexSpecies.prototype.eggMovesOnly = function (child, father) {
        if (child.baseSpecies === (father === null || father === void 0 ? void 0 : father.baseSpecies))
            return false;
        while (father) {
            if (father.name === child.name)
                return false;
            father = this.learnsetParent(father);
        }
        return true;
    };
    return DexSpecies;
}());
exports.DexSpecies = DexSpecies;
