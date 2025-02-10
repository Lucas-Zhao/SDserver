export const commands: Chat.ChatCommands = {
	apkm:'addpokemon',
	addpkmn: 'addpokemon',
	addpokemon(target, room, user) {
		this.checkCan('lockdown');
	},
	potdhelp: [
		`/potd [pokemon] - Set the Pokemon of the Day to the given [pokemon]. Requires: ~`,
	],
};

