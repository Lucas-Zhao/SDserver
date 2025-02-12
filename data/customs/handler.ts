/*
This file includes all the necessary functions that handle editing custom
data in data files
Pokem9n
*/
import * as path from "path";
import * as fsSync from "fs";
import * as fs from "fs/promises";
import { exec } from "child_process";

const CUSTOM_DIR = path.join(path.resolve(), "/data/customs");

type DataFile =
	| "pokedex"
	| "learnsets"
	| "items"
	| "moves"
	| "aliases"
	| "abilities"
	| "formats-data";

let fileTypes: Array<DataFile> = [
	"pokedex",
	"learnsets",
	"items",
	"moves",
	"aliases",
	"abilities",
	"formats-data",
];

interface Dict<T> {
	[key: string]: T;
}

interface Pokemon {
	name: string;
	num: number;
	types: Array<string>;
	genderRatio?: Dict<string>;
	baseStats: Dict<string>;
	abilities: Dict<string>;
	heightm: number;
	weightkg: number;
	color?: string;
	prevo: string;
	evoLevel?: number;
	eggGroups: Array<string>;
	otherFormes?: Array<string>;
	formeOrder?: Array<string>;
	requiredItem: string;
}

interface FormatsData {
	isNonstandard: string;
	tier: string;
	natDexTier: string;
}

interface Item {
	name: string;
	num: number;
	megaStone?: string;
	itemUser?: string;
	isNonstandard?: string;
	megaEvolves?: string[];
}

interface Ability {
	name: string;
	num: number;
	flags: Dict<string>;
	rating?: number;
}

interface Learnset {
	learnset: Dict<string>;
}

export class Handler {
	pokedex: Dict<Pokemon>;
	items: Dict<Item>;
	abilities: Dict<Ability>;
	learnsets: Dict<Learnset>;
	formatsdata: Dict<FormatsData>;

	pokedexIds?: Array<string>;
	itemsIds?: Array<string>;
	abilitiesIds?: Array<string>;
	learnsetsIds?: Array<string>;
	movesIds: Array<string>;

	funcTxt: Array<string>;

	constructor() {
		this.pokedex = {};
		this.abilities = {};
		this.items = {};
		this.learnsets = {};
		this.formatsdata = {};
		this.funcTxt = ["abilities", "items", "moves"];
		this.loadFiles();
	}

	toID(txt: string): string {
		return Handler.toID(txt);
	}
	print(txt: string) {
		console.log("[Handler] :" + txt);
	}

	load(file: DataFile): void {
		if (!fileTypes.includes(file))
			return console.log("Invalid file type received, aborting...");
		let filePath: string = this.getDir(file);
		if (!fsSync.existsSync(filePath))
			return console.log(
				"Data file is a valid file but does not exist.. aborting.."
			);

		let content = fsSync
			.readFileSync(filePath)
			.toString()
			.split("/*FUNCTIONS*/")[0];
		console.log("Loading data from " + file + "..");
		let json = "{" + content + "}";
		let parsedJson;
		try {
			parsedJson = JSON.parse(json);
		} catch (e) {
			throw new Error(
				"Error: could not parse json content, please make sure the file follows the json syntax, aborting... (file: " +
					file +
					")"
			);
		}

		let keys = Object.keys(parsedJson);
		if (file == "pokedex") this.pokedexIds = keys;
		if (file == "items") this.itemsIds = keys;
		if (file == "moves") this.movesIds = keys;
		if (file == "learnsets") this.learnsetsIds = keys;
		if (file == "abilities") this.abilitiesIds = keys;

		if (file == "pokedex") this.pokedex = parsedJson;
		if (file == "items") this.items = parsedJson;
		//if(file == "moves") this.moves = keys
		if (file == "learnsets") this.learnsets = parsedJson;
		if (file == "abilities") this.abilities = parsedJson;
		if (file == "formats-data") this.formatsdata = parsedJson;
	}

	loadFiles() {
		try {
			fileTypes.forEach((file) => {
				this.load(file);
			});
		} catch (e) {
			this.print("Error loading files: " + e.message);
		}
	}

	getDir(type): string {
		return path.join(CUSTOM_DIR, "/data/" + type + ".txt");
	}

	session(length: number = 32) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters[randomIndex];
		}
		let file = path.join(CUSTOM_DIR, "/session.txt");
		fsSync.writeFileSync(file, result);
		return result;
	}

	static toID(text: any): string {
		if (typeof text !== "string") {
			if (text) text = text.id || text.userid || text.roomid || text;
			if (typeof text === "number") text = "" + text;
			else if (typeof text !== "string") return "";
		}
		return text.toLowerCase().replace(/[^a-z0-9]+/g, "") as string;
	}

	format(data: Pokemon, type: DataFile): string {
		if (!data) throw new Error("Text data was not provided");
		if (!type) type = "pokedex";
		if (!fileTypes.includes(type)) throw new Error("Inavlid tyoe received");

		let buffer: string = ``;
		switch (type) {
			case "pokedex":
				{
					buffer = `
		"${this.toID(data.name)}": {
		"num": -1000, // always negative and above 999
		"forme": "",
		"baseForme": "Alien",
		"baseSpecies": "Zerapium", // if this pokemon is a mega, dynamax or a regional form of an existing pokemon then add name of that existing pokemon otherwise leave blank
		"name": "Zerapium", // name
		"types": ["Ghost", "Dark"], // types, only 2
		"gender": "N", 
		"baseStats": { "hp": 100, "atk": 150, "def": 100, "spa": 150, "spd": 100, "spe": 150 },
		"abilities": { "0": "Levitate" },
		"heightm": 1.5,
		"weightkg": 61,
		"color": "White",
		"eggGroups": ["Undiscovered"],
		"gen": 5,
		"prevo": "Shuckle", // prevolution name
		"evoType": "trade" // in what way a pokemon evolve into this pokemon
	},
	`;
				}
				break;

			case "items":
				return this.formatAbilities(data);
		}
		return buffer;
	}

	formatAbilities(data: any): string {
		let buffer = this.abilitiesIds?.length ? `,` : ``;
		buffer += `
		"${this.toID(data.name)}": {
		"flags": ${data.flags},
		"name": "${data.name}",
		"rating": 4,
		"num": ${data.num}
	}
		`;
		if (data.setsWeather) {
			buffer += ``;
		}
		return buffer;
	}

	/* checks functions */
	hasAbility(name: string) {
		if (this.abilitiesIds?.includes(this.toID(name))) return true;
		return false;
	}
	hasPokemon(name: string) {
		if (this.pokedexIds?.includes(this.toID(name))) return true;
		return false;
	}
	hasItem(name: string) {
		if (this.itemsIds?.includes(this.toID(name))) return true;
		return false;
	}

	functionsExist(content: string, name: string): boolean {
		const regex = new RegExp(`//${name}start([\\s\\S]*?)//${name}end`, "g");
		const match = content.match(regex);
		if (match) return true;
		return false;
	}

	getFunctions(content: string, name: string) {
		const regex = new RegExp(`//${name}start([\\s\\S]*?)//${name}end`, "g");
		const match = content.match(regex);
		console.log(match);
		if (match)
			return match[0]
				.replace(`//${name}start`, "")
				.replace(`//${name}end`, "");
		return "";
	}

	/* main functions */

	addAbility(data: any): boolean {
		let filePath: string = this.getDir("abilities");
		let content = fsSync
			.readFileSync(filePath)
			.toString()
			.split("/*FUNCTIONS*/");
		let id = this.toID(data.name);
		//	if (this.hasAbility(id)) return false;
		this.addAbilityFunction(data as Ability, data.functions);
		this.abilities[id] = {
			name: data.name,
			flags: {},
			num: -(Object.keys(this.abilities as {}).length + 1001),
			rating: data.rating,
		};
		this.convertToTxt("abilities");

		this.import("abilities");
		return true;
	}

	addAbilityFunction(ability: Ability, functions: Array<Dict<string>>) {
		let buffer = ``;
		let filePath = this.getDir("abilities");
		let content = fsSync.readFileSync(filePath).toString();
		let id = this.toID(ability.name);
		functions.forEach((func) => {
			let funcc = func.body.startsWith("function")
				? func.body
				: new Function(...func.params, func.body);

			//buffer += this.getFunctions(content,this.toID(ability.name))
			console.log(buffer);
			buffer += `\nAbilities["${this.toID(ability.name)}"].${
				func.name
			} = ${funcc.toString()}\n`;
		});

		if (this.functionsExist(content, this.toID(ability.name)))
			content = content.replace(
				this.getFunctions(content, this.toID(ability.name)),
				buffer
			);
		if (!this.functionsExist(content, this.toID(ability.name)))
			content += `//${id}start\n${buffer}\n//${id}end`;

		fsSync.writeFileSync(filePath, content);
	}

	addItem(data: any): boolean {
		let filePath: string = this.getDir("items");
		let content = fsSync
			.readFileSync(filePath)
			.toString()
			.split("/*FUNCTIONS*/");
		let id = this.toID(data.name);
		//if (this.hasItem(id)) return false;
		this.addItemFunction(data as Item, data.functions);
		this.items[id] = {
			name: data.name,
			megaStone: data.megaStone || undefined,
			itemUser: data.itemUser || undefined,
			megaEvolves: data.megaEvolves || undefined,
			num: -(Object.keys(this.items as {}).length + 1001),
			isNonstandard: "Unobtainable",
		};
		this.convertToTxt("items");

		this.import("items");
		return true;
	}

	addItemFunction(item: Item, functions: Array<Dict<string>>) {
		let buffer = ``;
		let filePath = this.getDir("items");
		let content = fsSync.readFileSync(filePath).toString();
		let id = this.toID(item.name);
		functions.forEach((func) => {
			let funcc = func.body.startsWith("function")
				? func.body
				: new Function(...func.params, func.body);

			//buffer += this.getFunctions(content,this.toID(ability.name))
			console.log(buffer);
			buffer += `\nItems["${this.toID(item.name)}"].${
				func.name
			} = ${funcc.toString()}\n`;
		});

		if (this.functionsExist(content, this.toID(item.name)))
			content = content.replace(
				this.getFunctions(content, this.toID(item.name)),
				buffer
			);
		if (!this.functionsExist(content, this.toID(item.name)))
			content += `//${id}start\n${buffer}\n//${id}end`;

		fsSync.writeFileSync(filePath, content);
	}

	addPokemon(pokemon: Pokemon, opts: Dict<string>) {
		console.log(Object.keys(this.pokedex));
		pokemon.num = -(Object.keys(this.abilities as {}).length + 1000);
		this.pokedex[this.toID(pokemon.name)] = pokemon;
		this.convertToTxt("pokedex");
		this.import("pokedex");
		if (opts.isMega) {
			let func = function (item, source) {
				if (item.megaEvolves === source.baseSpecies.baseSpecies)
					return false;
				return true;
			};
			let data = {
				name: pokemon.requiredItem,
				megaEvolves: pokemon.name,
				itemUser: [pokemon.prevo],
				functions: [{ name: "onTakeItem", body: func.toString() }],
			};
			this.addItem(data);
		}
		if (opts.learnset) {
			let data = { learnset: opts.learnset as {} };
			this.addLearnset(data, pokemon.name);
		}
		this.addFormatData(
			{
				isNonstandard: "Unobtainable",
				tier: "Legacy",
				natDexTier: "Legacy",
			},
			this.toID(pokemon.name)
		);
	}

	addFormatData(data: FormatsData, name: string) {
		console.log(Object.keys(this.formatsdata));
		//pokemon.num = -(Object.keys(this.abilities as {}).length + 1000)
		this.formatsdata[this.toID(name)] = data;
		this.convertToTxt("formats-data");
		this.import("formats-data");
	}

	addLearnset(data: Learnset, name: string) {
		console.log(Object.keys(this.learnsets));
		//pokemon.num = -(Object.keys(this.abilities as {}).length + 1000)
		this.learnsets[this.toID(name)] = data;
		this.convertToTxt("learnsets");
		this.import("learnsets");
	}

	convertToTxt(file: DataFile): string {
		console.log("converting...");
		if (!file) return "";
		let filePath = this.getDir(file);
		let fileid = this.toID(file);
		let buffer = ``;
		Object.keys(this[fileid]).forEach((id, i) => {
			let data = this[fileid][id];
			buffer += `${i ? "," : ""} "${id}":${JSON.stringify(data)}\n`;
		});
		if (this.funcTxt.includes(file)) {
			let content = fsSync
				.readFileSync(filePath)
				.toString()
				.split("/*FUNCTIONS*/");
			content[0] = buffer;
			buffer = content.join("\n/*FUNCTIONS*/");
		}
		fsSync.writeFileSync(filePath, buffer);

		return buffer;
	}

	import(file: DataFile) {
		exec(
			`node "${path.join(
				path.resolve(),
				"/tools/build-customs.js"
			)}" ${file}`,
			(error, stdout, stderr) => {
				if (error) return console.error(`Error: ${error.message}`);
				if (stderr) return console.error(`Stderr: ${stderr}`);
				console.log(`Output: ${stdout}`);
			}
		);
	}

	updateFile(file: DataFile) {
		if (file == "pokedex") {
			let filePath = this.getDir(file);
			let content = fsSync.readFileSync(filePath);
			let buffer = ``;
			let data = this[file as string];
			Object.keys(data).forEach((id, i) => {
				buffer += `${i ? ", \n" : ""}"${id}": ${JSON.stringify(data[id])}`;
			});
			fsSync.writeFileSync(filePath, buffer);
		} else {
			let filePath = this.getDir(file);
			let content = fsSync.readFileSync(filePath).toString();
			let buffer = ``;
			let data = this[file as string];
			const regex = /\/\/namestart([\s\S]*?)\/\/namend/;
			const match = content.match(regex);
		}
	}

	updateFiles() {}
}

interface Weather {
	name: "raindance" | "sunnyday" | "electricterrain" | "psychicterrain";
	duration: number;
	boost?: Boost;
}
type Terrain = Weather;

interface Boost {
	target: "me" | "you";
	name:
		| "atk"
		| "def"
		| "spa"
		| "spd"
		| "spe"
		| "priority"
		| "accuracy"
		| "evasiveness";
	value: number;
	specific?: "highest" | "lowest";
	condition?: string;
}
interface Recover {
	target: "me" | "you";
	hp?: number;
	item?: string;
	condition?: string;
}

interface TypeChange {
	moveType?: Array<string>;
	type?: Array<string>;
	target: "me" | "you";
}

interface Effects {
	weather?: Array<Weather>;
	terrain?: Array<Terrain>;
	boosts?: Array<Boost>;
	recovers?: Array<Recover>;
	typechanges?: Array<TypeChange>;
}

interface InputAbility extends Ability {
	onSwitchIn: Effects;
	onKoYou?: Effects;
	onHitMe?: Effects;
}

class AbilityEntry {
	functions: Array<string>;
	constructor(data: InputAbility) {
		this.name = data.name;
		this.flags = data.flags || {};
		this.rating = data.rating || 0;
		this.functions = [];

		this.load(data);
	}

	load(data: InputAbility): void {
		let funcData = {
			name: "onStart",
			//	body: onStart.toString(),
			params: ["source"],
		};

		let onStart = `function(source) { \n`;
		let onModifyAtk = `function(num, me, you, move) { \n`;
		let onModifySpA = `function(num, me, you, move) { \n`;
		let onModifyDef = `function(num, me, you, move) { \n`;
		let onModifySpD = `function(num, me, you, move) { \n`;
		let onModifyAccuracy = `function(num, target, source, move) { \n`;
		let onModifySpe = `function(num, pokemon) { \n`;
		let onModifyMove = `function(move, me, you) { \n`;

		let onModifyCritRatio = `function(source) { \n`;
		let onModifySTAB = `function(source) { \n`;
		let onModifyDamage = `function(source) { \n`;
		let onModifyType = `function(source) { \n`;

		Object.keys(data).forEach((key, i) => {
			switch (key) {
				case "onSwitchIn": {
					let effects = data[key];
					if (effects.weather) {
						effects.weather.forEach((weather) => {
							let id = Handler.toID(weather.name);
							onStart += `
						this.field.setWeather('${id}');
	                    this.field.weatherState.duration = ${weather.duration};
						`;
						});
					}

					if (effects.terrain) {
						effects.terrain.forEach((terrain) => {
							let id = Handler.toID(terrain.name);
							onStart += `
						this.field.setTerrain('${id}');
	                    this.field.terrainState.duration = ${terrain.duration};
						`;
						});
					}

					if (effects.boosts) {
						effects.boosts.forEach((boost) => {
							switch (boost.name) {
								case "atk":
									{
										if (boost.condition)
											onModifyAtk += `
									 ${boost.condition}
									 this.chainModify(${boost.value})
									${boost.condition.endsWith("//CONDITIONEND") ? `\n` : "}\n"}
									`;
									}
									break;
								case "def":
									{
										if (boost.condition)
											onModifyDef += `
									 ${boost.condition}
									 this.chainModify(${boost.value})
									${boost.condition.endsWith("//CONDITIONEND") ? `\n` : "}\n"}
									`;
									}
									break;
								case "spa":
									{
										if (boost.condition)
											onModifySpA += `
									 ${boost.condition}
									 this.chainModify(${boost.value})
									${boost.condition.endsWith("//CONDITIONEND") ? `\n` : "}\n"}
									`;
									}
									break;
								case "spd":
									{
										if (boost.condition)
											onModifySpD += `
									 ${boost.condition}
									 this.chainModify(${boost.value})
									${boost.condition.endsWith("//CONDITIONEND") ? `\n` : "}\n"}
									`;
									}
									break;
								case "spe":
									{
										if (boost.condition)
											onModifySpe += `
									 ${boost.condition}
									 this.chainModify(${boost.value})
									${boost.condition.endsWith("//CONDITIONEND") ? `\n` : "}\n"}
									`;
									}
									break;
							}
						});
					}
				}
			}
		});
	}
}

let Customs = new Handler();
export default Customs;
