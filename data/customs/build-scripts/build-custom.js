/*
 * build-custom.js
 * Author - Pokem9n | https://github.com/ISenseAura
 * 
 * This is the main file for Custom Pokemon Server. This file
 * mainly acts as a command line tool to perform tasks that
 * should be independent of PS' processes.
 * PS' "build" file uses this file to import the custom 
 * data from the text files
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const api = require("./api.js")
const importer = require("./importer.js")
const syncer = require("./syncer.js")
const stats = require("../utils/os.js")

require("./compiler.js")


if (!fs.existsSync(path.join(path.resolve(), "/data/customs/"))) {
	console.log(
		"[WARNING] Customs direcotry does not exist, this is either a mistake or an indication that this is a client project\nAborting importing custom pokemon data.. "
	);
	return;
}

function listen() {
if (args.length) {
	args.forEach((arg) => {
		//console.log(this)
		try {
			switch (arg) {
				case "pokedex":
					importer.importPokedexData();
					break;
				case "abilities":
					importer.importAbilitiesData();
					break;
				case "items":
					importer.importItemsData();
					break;
				case "learnsets":
					importer.importLearnsetsData();
					break;
				case "formats-data":
					importer.importFormatsData();
					break;
				case "formats":
					importer.importFormats();
					break;
				case "text/pokedex":
					importer.importTextData();
					break;
				case "apistart":
					api.start();
					break;
				case "updaterepo":
					syncer.updateRepo();
					break;
				case "updateclient":
					syncer.updateClient();
					break;
				case "syncclient":
					syncer.updateRepo();
					syncer.updateClient();
					break;
				case "updatedata":
					importer.importCustomData();
					break;
				case "samples":
					importer.importSamples();
					break;
				case "stats":
					stats.getSystemStatsAsync().then((data) => {
						console.log(JSON.stringify(data))
					})
					break;
				default:
					console.log("Could not build customs: Invalid argument received (" + arg + ")")
			}
		} catch (e) {
			console.log(e);
		}
	});
}
}

function importData() {
	importer.importCustomData();
	return;
}

module.exports = {importData, listen}
/* TEST FUNCTIONS, SHOULD BE REMOVED AFTER USE */

/*
const h = require("").default;
let abs = require("./test.js").abilities;

Object.keys(abs).forEach((key) => {
	let ability = abs[key];
	let functions = [];
	if (ability.onStart)
		functions.push({ name: "onStart", body: ability.onStart.toString() });
	if (ability.onModifySpA)
		functions.push({
			name: "onModifySpA",
			body: ability.onModifySpA.toString(),
		});
	if (ability.onModifyAtk)
		functions.push({
			name: "onModifyAtk",
			body: ability.onModifyAtk.toString(),
		});
	if (ability.onModifyDef)
		functions.push({
			name: "onModifyDef",
			body: ability.onModifyDef.toString(),
		});
	if (ability.onModifySpD)
		functions.push({
			name: "onModifySpD",
			body: ability.onModifySpD.toString(),
		});
	if (ability.onModifySpe)
		functions.push({
			name: "onModifySpe",
			body: ability.onModifySpe.toString(),
		});

	if (ability.onTerrainChange)
		functions.push({
			name: "onTerrainChange",
			body: ability.onTerrainChange.toString(),
		});
	if (ability.onWeatherChange)
		functions.push({
			name: "onWeatherChange",
			body: ability.onWeatherChange.toString(),
		});
	if (ability.onDamagingHit)
		functions.push({
			name: "onDamagingHit",
			body: ability.onDamagingHit.toString(),
		});
	if (ability.onAnyModifySpe)
		functions.push({
			name: "onAnyModifySpe",
			body: ability.onAnyModifySpe.toString(),
		});
	if (ability.onSourceAfterFaint)
		functions.push({
			name: "onSourceAfterFaint",
			body: ability.onSourceAfterFaint.toString(),
		});

	if (ability.onModifyType)
		functions.push({
			name: "onModifyType",
			body: ability.onModifyType.toString(),
		});
	if (ability.onBasePower)
		functions.push({
			name: "onBasePower",
			body: ability.onBasePower.toString(),
		});

	ability.functions = functions;
	h.addAbility(ability);
});

//console.log(h)*/
