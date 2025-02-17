/*
 * syncer.js
 * Author - Pokem9n | https://github.com/ISenseAura
 * 
 * This file contains logic to sync data from main PS' repository,
 * also updates local and remote server repository then attempts to 
 * sync client and server data. 
 * This is primarily used after updating custom data in server
 * through API. The new custom data needs to be updated in 
 * client repository as well thats what this script does.
 * 
 */

const fs = require("fs");
const path = require("path");
const {execSync} = require("child_process")

const MAIN_PATH = path.join(path.resolve(), "..");
const SERVER_FOLDER_NAME = "pokemon-showdown";
const CLIENT_FOLDER_NAME = "pokemon-showdown-client";

let updateRepo = (msg = "Data Update") => {
	console.log("\n[UPDATING SERVER REPO]")
	console.log(execSync("git add .",{cwd : MAIN_PATH + "/" + SERVER_FOLDER_NAME}).toString())
	console.log(execSync(`git commit -m "[Automated Push] ${msg}"`,{cwd : MAIN_PATH + "/" + SERVER_FOLDER_NAME}).toString())
	console.log(execSync(`git push origin2`,{cwd : MAIN_PATH + "/" + SERVER_FOLDER_NAME}).toString())
	console.log("\n[FINISHED]")
}


let updateClient = (msg) => {
	console.log("\n-----[UPDATING CLIENT]------- \n")
	console.log(execSync("npm run build-full",{cwd : MAIN_PATH + "/" + CLIENT_FOLDER_NAME}).toString())
	console.log("---------[UPDATING-CLIENT-FINISHED]--------")
}

module.exports = { updateRepo, updateClient}
