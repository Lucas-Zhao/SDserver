import http, { IncomingMessage, ServerResponse } from "http";
import https from "https";
import fs from "fs";
const URL = require("url");

import Customs from "./handler";
import path, { resolve } from "path";
import { exec } from "child_process";

// HTTP and HTTPS ports
const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;

let update = function(what) {
	return new Promise((resolve, reject) => {
		exec(
			`node "${path.join(
				path.resolve(),
				"/tools/build-customs.js"
			)}" update${what}`,
			(error, stdout, stderr) => {
				if (error) return reject(`Error: ${error.message}`);
				if (stderr) return reject(`Stderr: ${stderr}`);
				resolve(stdout);
			}
		);
	})
}

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
	} else if (url === "/pokemon.html") {
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
			/*
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
			} */
			update(body.update).then((data) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: data }));
			}).catch((e) => {
				console.log(e)
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: e.message }));
				return;
			})
			
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
