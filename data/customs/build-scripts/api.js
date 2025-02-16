/*
 * api.js
 * Author - Pokem9n | https://github.com/ISenseAura
 * This file handles operations related to API this file itself does not
 * contain logic for API but to start/stop the API this script is used
 */
const {fork} = require("child_process")
const path = require("path");

function start() {
	// Path to the API script
	const apiScript = path.join(path.resolve(),"/dist/data/customs/api.js"); // Replace with your API script path

	const child = fork(apiScript);

	child.on("message", (message) => {
		console.log("Message from child:", message);
	});
}


module.exports = { start }