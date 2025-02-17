import Customs from "../../data/customs/handler"
import fs from "fs"
import path from "path";
export const commands: Chat.ChatCommands = {
	apkm:'addpokemon',
	addpkmn: 'addpokemon',
	addpokemon(target, room, user) {
		if(!Config.developers?.includes(user.id)) return user.popup("Not Authorised")
			user.popup("[FORWARD]" + Customs.session(200));

	},
	potdhelp: [
		`/potd [pokemon] - Set the Pokemon of the Day to the given [pokemon]. Requires: ~`,
	],

	replaysave(target, room, user) {
		if(!room?.battle) return this.errorReply("Not a battle!");
		if(!room?.battle.ended) return this.errorReply("Let the battle end first");
		try {
		let data = {
			users: [],
			uploadedBy: "",
			id: "",
			title: "",
			uploadTime: Date.now(),
			file: "",
			url:""
		};
		room.battle.players.forEach((player) => {
			data.users.push(player.name)
		})
		data.uploadedBy = user.id;
		data.id = room.roomid.replace("battle-","replay-");
		data.title = room.title;
		//data.uploadTime = new Date();
		//data.file = toID(data.id);
		let url = (Config.client ?  Config.client : "") +"/replay.html?id=" + data.id;
		let loc = path.join(path.resolve(),"/data/customs")
		let replays = JSON.parse(fs.readFileSync(loc + "/replays.json").toString());
		data.url = url;
		replays[data.id] = data;

		fs.writeFileSync(loc + "/replays.json", JSON.stringify(replays))
		fs.writeFileSync(loc + "/replays/" + data.id + ".log",room.getLog())
		
		user.popup(
			`|html|<p>Your replay has been uploaded! It's available at:</p><p> ` +
			`<a class="no-panel-intercept" href="http://${url}" target="_blank">${url}</a> ` +
			`<copytext value="${url}">Copy</copytext>`
		);	} catch (e) {
		user.popup("Error uploading replay: " + e.message)
	}

	}
};

