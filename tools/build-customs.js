const fs = require("fs");
const path = require("path");

const customdexFilePath = path.join(
	path.resolve(),
	"/data/customs/pokedex.txt"
);
const pokedexFilePath = path.join(path.resolve(), "/data/pokedex.ts");

const { execSync } = require("child_process");
const { toID } = require("../sim/dex-data");

const sourceFilePath = pokedexFilePath;

exports.importCs = () => {
	try {
    console.log("Importing custom pokedex data...")
		const customFileContent = fs.readFileSync(customdexFilePath, "utf-8");
		const pokedexFileContent = fs.readFileSync(sourceFilePath, "utf-8");

		const newEntries = customFileContent;
		const oldEntries = pokedexFileContent
			.replace(
				`export const Pokedex: import('../sim/dex-species').SpeciesDataTable = {`,
				""
			)
			.split("/*CUSTOM POKEMONS*/");

      let bufunc = ``;

		if (oldEntries[1]) {
			console.log(oldEntries[1]);

			oldEntries[0] += `/*CUSTOM POKEMONS*/${newEntries}};`;
			const updatedContent = pokedexFileContent.replace(
				/};\s*$/,
				`\n/*CUSTOM POKEMONS*/\n${newEntries}};\n`
			);

		//	fs.writeFileSync(newEntriesFilePath, oldEntries[0], "utf-8");

			console.log("Custom Pokedex imported succesfully!");
			return;
		}
		const updatedContent = sourceFileContent.replace(
			/};\s*$/,
			`\n/*CUSTOM POKEMONS*/\n${newEntries}};\n`
		);

	//	fs.writeFileSync(newEntriesFilePath, updatedContent, "utf-8");

		console.log("New entries appended successfully!");
	} catch (error) {
		console.error("Error appending new entries:", error);
	}
};
