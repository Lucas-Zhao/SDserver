/*
 * importer.js
 * Author - Pokem9n | https://github.com/ISenseAura
 *
 * This file is responsible for writing custom pokemon, abilities, items, moves, formats data
 * from text files in data/customs/data folder to PS' main data files in data folder
 * for example: takes data from "/data/customs/data/pokedex.txt", converts the content within it
 * into TypeScript syntax and updates "/data/pokedex.ts"
 */

const fs = require("fs");
const path = require("path");

const customPath = path.join(path.resolve(), "/data/customs/data");
const dataPath = path.join(path.resolve(), "/data");

const { toID } = require("../../../sim/dex-data.js");


function getCustomPath(file) {
	return customPath + "/" + file + ".txt";
}
function getDataPath(file) {
	return dataPath + "/" + file + ".ts";
}

function getPrevoPokemon(txt) {
	let evos = [];
	let jsonObj = JSON.parse("{" + txt + "}");
	Object.values(jsonObj).forEach((val) => {
		if (val.prevo || val.baseSpecies)
			evos.push(
				JSON.stringify({
					name: toID(val.prevo) || toID(val.baseSpecies),
					evotype: val.evoType,
					from: val.name,
				})
			);
	});
	return evos;
}

let importPokedexData = () => {
	let customdexFilePath = getCustomPath("pokedex");
	let pokedexFilePath = (sourceFilePath = getDataPath("pokedex"));
	try {
		console.log("Importing custom pokedex data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent.split("/*CUSTOM POKEMONS*/");

		let bufFunc = ``;

		let existingChanges = getPrevoPokemon(newEntries);

		if (existingChanges.length) {
			bufFunc = `
	/*
	 function to add custom evolutions to existing pokemon,
	 this is basically done to let existing pokemon have 
	 the eviolite bonus if a custom pokemon is added as its evolution
	*/ 
			(() => {
	let toChangePokemon = [${existingChanges}];
	toChangePokemon.forEach((val) => {
		//val = JSON.parse(val)
		if(val.from.includes("-Mega")) {
		if(!Pokedex[(val.name)].otherFormes) Pokedex[(val.name)].otherFormes = [];
		Pokedex[(val.name)].otherFormes.push(val.from)
		} else {
		if (Pokedex[(val.name)].evos)
			Pokedex[(val.name)]?.evos?.push(val.from);
		if (!Pokedex[(val.name)].evos)
			Pokedex[(val.name)]?.evos?.push(val.from);
	}
	});
})();`;

			console.log(
				"New evolutions found for existing pokemon, making changes accordingly"
			);
		}

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM POKEMONS*/\n${newEntries}\n};\n ${bufFunc}`;
			fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");
			console.log("Custom Pokedex imported succesfully!");
			return;
		}
		const updatedContent = pokedexFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM POKEMONS*/\n${newEntries}\n};\n`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("New entries appended successfully!");
	} catch (error) {
		console.error("Error appending new entries:", error);
	}
};

let importTextData = () => {
	let txtFiles = ["pokedex", "abilities", "items"];
	txtFiles.forEach((file) => {
		let customdexFilePath = getCustomPath("text/" + file);
		let pokedexFilePath = (sourceFilePath = getDataPath("text/" + file));
		try {
			console.log(`Importing custom ${file} text data...`);
			const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
			const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

			const newEntries = customFileContent;
			const oldEntries = pokedexFileContent.split("/*CUSTOM TEXTS*/");

			let bufFunc = ``;

			if (oldEntries[1]) {
				oldEntries[0] += `/*CUSTOM TEXTS*/\n${newEntries}\n};\n ${bufFunc}`;
				fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");
				console.log(`Custom ${file} text imported succesfully!`);
				return;
			}
			const updatedContent = pokedexFileContent.replace(
				/};\s*$/,
				`\n/*CUSTOM TEXTS*/\n${newEntries}\n};\n`
			);

			fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

			console.log("New entries appended successfully!");
		} catch (error) {
			console.error("Error appending new entries:", error);
		}
	});
};

let importFormatsData = () => {
	let customdexFilePath = getCustomPath("formats-data");
	let pokedexFilePath = (sourceFilePath = getDataPath("formats-data"));
	try {
		console.log("Importing custom formats-data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent.split("/*CUSTOM FORMATS*/");

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM FORMATS*/\n${newEntries}\n};\n`;
			fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");
			console.log("Custom Formats data imported succesfully!");
			return;
		}
		const updatedContent = pokedexFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM FORMATS*/\n${newEntries}\n};\n`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("New entries appended successfully!");
	} catch (error) {
		console.error("Error appending new entries:", error);
	}
};

let importAbilitiesData = () => {
	let customdexFilePath = getCustomPath("abilities");
	let pokedexFilePath = (sourceFilePath = getDataPath("abilities"));
	try {
		console.log("Importing custom abilites data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent.split("/*FUNCTIONS*/");
		const oldEntries = pokedexFileContent.split("/*CUSTOM ABILITIES*/");

		let bufunc = ``;

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM ABILITIES*/\n${newEntries[0]}};`;
			oldEntries[0] += `\n/*FUNCTIONS*/\n${newEntries[1]}`;
			const updatedContent = pokedexFileContent.replace(
				/};\s*$/,
				`\n/*CUSTOM ABILITIES*/\n${newEntries}};\n`
			);

			fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");

			console.log("Custom Abilities imported succesfully!");
			return;
		}
		const updatedContent = pokedexFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM ABILITIES*/\n${newEntries[0]}};\n/*FUNCTIONS*/\n${newEntries[1]}`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("Custom Abilities imported succesfully!");
	} catch (error) {
		console.error("Error importing custom abilities:", error);
	}
};

let importItemsData = () => {
	let customdexFilePath = getCustomPath("items");
	let pokedexFilePath = (sourceFilePath = getDataPath("items"));
	try {
		console.log("Importing custom abilites data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent.split("/*FUNCTIONS*/");
		const oldEntries = pokedexFileContent.split("/*CUSTOM ITEMS*/");

		let bufunc = ``;

		if (oldEntries[1]) {
			oldEntries[0] += `\n/*CUSTOM ITEMS*/\n${newEntries[0]}};`;
			oldEntries[0] += `\n/*FUNCTIONS*/\n${newEntries[1]}`;
			const updatedContent = pokedexFileContent.replace(
				/};\s*$/,
				`\n/*CUSTOM ITEMS*/\n${newEntries}};\n`
			);
			fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");
			console.log("Custom Items imported succesfully!");
			return;
		}
		const updatedContent = pokedexFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM ITEMS*/\n${newEntries}};\n`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("Custom Items imported succesfully!");
	} catch (error) {
		console.error("Error importing custom items:", error);
	}
};

let importLearnsetsData = () => {
	let customdexFilePath = getCustomPath("learnsets");
	let pokedexFilePath = (sourceFilePath = getDataPath("learnsets"));
	try {
		console.log("Importing custom abilites data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent.split("/*CUSTOM LEARNSETS*/");

		let bufunc = ``;

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM LEARNSETS*/\n${newEntries}};`;
			const updatedContent = pokedexFileContent.replace(
				/};\s*$/,
				`\n/*CUSTOM LEARNSETS*/\n${newEntries}};\n`
			);
			fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");
			console.log("Custom Learnsets imported succesfully!");
			return;
		}
		const updatedContent = pokedexFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM LEARNSETS*/\n${newEntries}};\n`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("Custom Learnsets imported succesfully!");
	} catch (error) {
		console.error("Error importing custom learnsets:", error);
	}
};

let importCustomData = async () => {
	this.importTextData();
	this.importPokedexData();
	this.importLearnsetsData();
	this.importAbilitiesData();
	this.importItemsData();
	this.importFormatsData();
};

exports.importTextData = importTextData;
exports.importPokedexData = importPokedexData;
exports.importFormatsData = importFormatsData;
exports.importAbilitiesData = importAbilitiesData;
exports.importItemsData = importItemsData;
exports.importLearnsetsData = importLearnsetsData;
exports.importCustomData = importCustomData;

