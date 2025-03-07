import http, { IncomingMessage, ServerResponse } from "http";
import https from "https";
import fs from "fs";

const URL = require("url");

import Customs from "./handler";
import path, { resolve } from "path";
import { exec } from "child_process";

// HTTP and HTTPS ports
const HTTP_PORT = 2405;
const HTTPS_PORT = 3443;

let update = function (what) {
	return new Promise(async (resolve, reject) => {
		let logs = ``;
		let errLogs = ``;
		let process =
			what === "data"
				? exec(
						`node "${path.join(
							path.resolve(),
							"data/customs/build-scripts/build-custom"
						)}" update${what}`
				  )
				: exec(
						`node "${path.join(path.resolve(), "build")}" update${what}`
				  );

		process.on("error", (data) => {
			console.log(data);
			reject(data);
		});
		process?.stdout?.on("data", (data) => {
			logs += data;
		});

		process?.stderr?.on("data", (data) => {
			errLogs += data;
		});
		process.on("exit", () => {
			resolve({ logs: logs.trim(), errLogs });
		});
		//resolve(logs)
	});
};

let getStats = function () {
	return new Promise((resolve, reject) => {
		let data = "";
		let child = exec(
			`node "${path.join(
				path.resolve(),
				"data/customs/build-scripts/build-custom"
			)}" stats`
		);
		child?.stdout?.on("data", (chunk) => {
			data += chunk;
		});
		child.on("error", (data) => {
			reject(data);
		});
		child.on("exit", () => {
			resolve(data);
		});
	});
};

const checkPM2 = () => {
	return new Promise((resolve) => {
		exec("pm2 -v", (error) => {
			if (error) {
				console.log("PM2 is not installed. Exiting.");
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
};

const restart = (processNameOrId) => {
	return new Promise((resolve, reject) => {
		exec(`pm2 restart ${processNameOrId}`, (error, stdout, stderr) => {
			if (error) {
				reject(
					`Error restarting PM2 process "${processNameOrId}":` +
						stderr.trim()
				);
			} else {
				resolve(
					`PM2 process "${processNameOrId}" restarted successfully:\n` +
						stdout
				);
			}
		});
	});
};

Customs.session(170);

// Helper to parse request body (for JSON payloads)
const parseRequestBody = async (req: IncomingMessage): Promise<any> => {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", () => {
			try {
				resolve(JSON.parse(body));
			} catch (err) {
				reject(new Error("Invalid JSON"));
			}
		});
	});
};

// Request Handler

function serveStatic(req, res, file) {
	const basePath = path.join(path.resolve(), "/data/customs/website"); // Base directory for static files

	// Map URLs to files
	let filePath = path.join(basePath, file ? file : req.url);

	// Determine content type
	const ext = path.extname(filePath);
	let contentType = "text/html";
	switch (ext) {
		case ".css":
			contentType = "text/css";
			break;
		case ".js":
			contentType = "application/javascript";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".jpg":
			contentType = "image/jpeg";
			break;
		case ".ico":
			contentType = "image/x-icon";
			break;
	}
	// Read and serve the file
	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code === "ENOENT") {
				// File not found
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.end("404 Not Found");
			} else {
				// Other server errors
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("500 Server Error");
			}
		} else {
			// Serve the file
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
		}
	});
}

const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
	const { method, url } = req;
	const parsedUrl = URL.parse(req.url, true);
	const query = parsedUrl.query;

	res.setHeader("Access-Control-Allow-Origin", "*"); // Allow any origin
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	// Handle preflight requests
	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (query.sessionId && method === "GET") {
		console.log(url);
		let oid = fs
			.readFileSync(path.join(path.resolve(), "/data/customs/session.txt"))
			.toString();
		if (oid !== query.sessionId) {
			res.writeHead(401, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Invalid session" }));
			return;
		}
		if (url?.startsWith("/pokemon.html"))
			return serveStatic(req, res, "pokemon.html");
		if (url?.startsWith("/addpokemon.html"))
			return serveStatic(req, res, "addpokemon.html");
		if (url?.startsWith("/replays.html"))
			return serveStatic(req, res, "replays.html");
		serveStatic(req, res, "index.html");
	} else if (url === "/index.css") {
		serveStatic(req, res, "index.css");
	} else if (url === "/index.js") {
		serveStatic(req, res, "index.js");
	} else if (url === "/pokemon.js") {
		serveStatic(req, res, "pokemon.js");
	} else if (url === "/replays.js") {
		serveStatic(req, res, "replays.js");
	} else if (url === "/config.js") {
		serveStatic(req, res, "config.js");
	}else if (url === "/pokemon.html") {
		serveStatic(req, res, "pokemon.html");
	} else if (url === "/pokemon.css") {
		serveStatic(req, res, "pokemon.css");
	} else if (url === "/" && method === "GET") {
		// Home route
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Welcome to the API!" }));
	} else if (url === "/sessionreset" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);

			// Validate input
			if (!body.name || !body.types) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(
					JSON.stringify({ message: "Name and type are required." })
				);
			}
			if (!body.stats && !body.baseStats) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(
					JSON.stringify({ message: "Base stats are required." })
				);
			}
			if (body.isMega && !body.requiredItem) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(
					JSON.stringify({
						message: "Each mega evolution should have a required item.",
					})
				);
			}

			try {
				Customs.addPokemon(body, true);
			} catch (e) {
				console.log(e);
			}
			res.writeHead(201, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Pokemon created", user: body }));
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/addpokemon" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);
			let oid = fs
				.readFileSync(
					path.join(path.resolve(), "/data/customs/session.txt")
				)
				.toString();
			console.log(oid == body.sessionId);
			console.log(body);
			if (!body.sessionId || body.sessionId != oid) {
				res.writeHead(401, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Invalid session" }));
				return;
			}
			// Validate input
			if (!body.pokemon.name || !body.pokemon.types) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(
					JSON.stringify({ message: "Name and type are required." })
				);
			}
			if (!body.pokemon.stats && !body.pokemon.baseStats) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(
					JSON.stringify({ message: "Base stats are required." })
				);
			}
			if (body.isMega && !body.pokemon.requiredItem) {
				res.writeHead(400, { "Content-Type": "application/json" });
				return res.end(
					JSON.stringify({
						message: "Each mega evolution should have a required item.",
					})
				);
			}

			try {
				Customs.addPokemon(body.pokemon, body);
			} catch (e) {
				console.log(e);
			}
			res.writeHead(201, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Pokemon created", user: body }));
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/update" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);

			let oid = fs
				.readFileSync(
					path.join(path.resolve(), "/data/customs/session.txt")
				)
				.toString();
			console.log(body);
			if (!body.sessionId || body.sessionId !== oid) {
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Invalid session" }));
				return;
			}
			update(body.update)
				.then((data: any) => {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({ message: data.logs, errors: data.errLogs })
					);
				})
				.catch((e) => {
					console.log(e);
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: e.message }));
					return;
				});

			return;
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/restart" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);

			let oid = fs
				.readFileSync(
					path.join(path.resolve(), "/data/customs/session.txt")
				)
				.toString();
			console.log(body);
			if (!body.sessionId || body.sessionId !== oid) {
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Invalid session" }));
				return;
			}
			checkPM2().then((does) => {
				if (!does) {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({
							message:
								"PM2 is not configured, please restart the server manually",
						})
					);
					return;
				} else {
					restart("SDserver")
						.then((data) => {
							res.writeHead(200, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ message: data }));
						})
						.catch((e) => {
							res.writeHead(200, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ message: e }));
						});
				}
			});

			return;
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/allpokemon" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);
			let oid = fs
				.readFileSync(
					path.join(path.resolve(), "/data/customs/session.txt")
				)
				.toString();
			console.log(body);
			if (!body.sessionId || body.sessionId !== oid) {
				res.writeHead(401, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Invalid session" }));
				return;
			}
			let data = {
				pokedex: Customs.pokedex,
				items: Customs.items,
				texts: Customs.texts,
			};
			res.writeHead(201, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Done", data: data }));
			return;
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/deletepokemon" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);
			let oid = fs
				.readFileSync(
					path.join(path.resolve(), "/data/customs/session.txt")
				)
				.toString();
			console.log(body);
			if (!body.sessionId || body.sessionId !== oid) {
				res.writeHead(401, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Invalid session" }));
				return;
			}

			try {
				Customs.deletePokemon(body.pokemon);
			} catch (e) {
				console.log(e);
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Error deleting pokemon: " + e.message,
					})
				);
				return;
			}
			let data = {
				pokedex: Customs.pokedex,
				items: Customs.items,
				texts: Customs.texts,
			};
			res.writeHead(201, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Done", data: data }));
			return;
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/getreplay" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);
			console.log(body);

			if (!body.replayid) {
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Provide replay id" }));
				return;
			}
			let filePath = path.join(
				path.resolve(),
				"/data/customs/replays/" + body.replayid + ".log"
			);
			if (!fs.existsSync(filePath)) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end("Replay does not exist");
				return;
			}
			let replay = fs.readFileSync(filePath).toString();
			let replayData = JSON.parse(
				fs
					.readFileSync(
						path.join(path.resolve(), "/data/customs/replays.json")
					)
					.toString()
			)[body.replayid];

			let data = { log: replay, replay: replayData };
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(data));
			return;
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/replays" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);
			console.log(body);

			let filePath = path.join(path.resolve(), "/data/customs/replays.json");
			if (!fs.existsSync(filePath)) {
				res.writeHead(404, { "Content-Type": "application/json" });
				res.end("Replay does not exist");
				return;
			}
			let replayData = fs
				.readFileSync(
					path.join(path.resolve(), "/data/customs/replays.json")
				)
				.toString();

			let data = { replays: JSON.parse(replayData) };
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(data));
			return;
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else if (url === "/stats" && method === "POST") {
		try {
			// Parse the request body
			const body = await parseRequestBody(req);
			getStats().then((d) => {
				console.log(d);
				let data = { stats: d };
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(data));
				return;
			});
		} catch (error) {
			// Handle JSON parse errors or other issues
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: error.message }));
		}
	} else {
		// Route not found
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ message: "Not Found" }));
	}
};

// HTTPS Options

// Create HTTP Server
const httpServer = http.createServer(requestHandler);

// Create HTTPS Server
//const httpsServer = https.createServer(httpsOptions, requestHandler);

// Start HTTP Server
httpServer.listen(HTTP_PORT, () => {
	console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
});
