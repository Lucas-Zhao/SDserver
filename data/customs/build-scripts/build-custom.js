const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const api = require("./api.js")
const importer = require("./importer.js")
const syncer = require("./syncer.js")


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
					importPokedexData();
					break;
				case "abilities":
					importAbilitiesData();
					break;
				case "items":
					importItemsData();
					break;
				case "learnsets":
					importLearnsetsData();
					break;
				case "formats-data":
					importFormatsData();
					break;
				case "text/pokedex":
					importTextData();
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
				default:
					console.log("Could not build customs: Invalid argument received (" + arg + ")")
			}
		} catch (e) {
			console.log(e);
		}
	});
	return;
} else {
	importer.importCustomData();
}
return;
}

module.exports = {listen}
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
