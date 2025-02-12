import Customs from "../../data/customs/handler"
export const commands: Chat.ChatCommands = {
	apkm:'addpokemon',
	addpkmn: 'addpokemon',
	addpokemon(target, room, user) {
		if(!Config.developers.includes(user.id)) return user.popup("Not Authorised")
			user.popup("[FORWARD]" + Customs.session(200));

	},
	potdhelp: [
		`/potd [pokemon] - Set the Pokemon of the Day to the given [pokemon]. Requires: ~`,
	],
};

