const fs = require("fs");
const path = require("path");

const customPath = path.join(path.resolve(), "/data/customs");
const dataPath = path.join(path.resolve(), "/data");

const { execSync } = require("child_process");
const { toID } = require("../sim/dex-data");

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
		console.log(val);
		if (val.prevo)
			evos.push(
				JSON.stringify({
					name: val.prevo,
					evotype: val.evoType,
					from: val.name,
				})
			);
	});
	return evos;
}

exports.importPokedexData = () => {
	let customdexFilePath = getCustomPath("pokedex");
	let pokedexFilePath = (sourceFilePath = getDataPath("pokedex"));
	try {
		console.log("Importing custom pokedex data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent
			.replace(
				`export const Pokedex: import('../sim/dex-species').SpeciesDataTable = {`,
				""
			)
			.split("/*CUSTOM POKEMONS*/");

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
		if (Pokedex[toID(val.name)].evos)
			Pokedex[toID(val.name)]?.evos?.push(val.from);
		if (!Pokedex[toID(val.name)].evos)
			Pokedex[toID(val.name)]?.evos?.push(val.from);
	});
})();`;

			console.log(
				"New evolutions found for existing pokemon, making changes accordingly"
			);
		}

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM POKEMONS*/${newEntries}};\n ${bufFunc}`;
			fs.writeFileSync(pokedexFilePath, oldEntries[0], "utf-8");
			console.log("Custom Pokedex imported succesfully!");
			return;
		}
		const updatedContent = pokedexFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM POKEMONS*/\n${newEntries}};\n`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("New entries appended successfully!");
	} catch (error) {
		console.error("Error appending new entries:", error);
	}
};

exports.importAbilitiesData = () => {
	let customdexFilePath = getCustomPath("abilities");
	let pokedexFilePath = (sourceFilePath = getDataPath("abilities"));
	try {
		console.log("Importing custom abilites data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent.split("/*CUSTOM ABILITIES*/");

		let bufunc = ``;

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM ABILITIES*/\n${newEntries}};`;
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
			`\n/*CUSTOM ABILITIES*/\n${newEntries}};\n`
		);

		fs.writeFileSync(pokedexFilePath, updatedContent, "utf-8");

		console.log("Custom Abilities imported succesfully!");
	} catch (error) {
		console.error("Error importing custom abilities:", error);
	}
};

exports.importItemsData = () => {
	let customdexFilePath = getCustomPath("items");
	let pokedexFilePath = (sourceFilePath = getDataPath("items"));
	try {
		console.log("Importing custom abilites data...");
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent.split("/*CUSTOM ITEMS*/");

		let bufunc = ``;

		if (oldEntries[1]) {
			oldEntries[0] += `/*CUSTOM ITEMS*/\n${newEntries}};`;
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

exports.importLearnsetsData = () => {
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

exports.importCustomData = () => {
	this.importPokedexData();
	this.importLearnsetsData()
	this.importAbilitiesData();
	this.importItemsData();
};
