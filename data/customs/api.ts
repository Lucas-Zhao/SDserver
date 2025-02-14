import http, { IncomingMessage, ServerResponse } from "http";
import https from "https";
import fs from "fs";
const URL = require("url");

import Customs from "./handler";
import path from "path";
import { exec } from "child_process";

// HTTP and HTTPS ports
const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;

function update(what) {
	exec(
		`node "${path.join(
			path.resolve(),
			"/tools/build-customs.js"
		)}" update${what}`,
		(error, stdout, stderr) => {
			if (error) return console.error(`Error: ${error.message}`);
			if (stderr) return console.error(`Stderr: ${stderr}`);
			console.log(`Output: ${stdout}`);
		}
	);
}

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
	console.log(filePath);
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

	if (query.sessionId && method === "GET") {
		let oid = fs
			.readFileSync(path.join(path.resolve(), "/data/customs/session.txt"))
			.toString();
		if (oid !== query.sessionId) {
			res.writeHead(401, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Invalid session" }));
			return;
		}
		serveStatic(req, res, "index.html");
	} else if (url === "/index.css") {
		serveStatic(req, res, "index.css");
	} else if (url === "/index.js") {
		serveStatic(req, res, "index.js");
	}
	else if (url === "/pokemon.html") {
		serveStatic(req, res, "pokemon.html");
	} else if (url === "/pokemon.css") {
		serveStatic(req, res, "pokemon.css");
	}   else if (url === "/" && method === "GET") {
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
				console.log(oid == body.sessionId)
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
			if (!body.sessionID || body.sessionId !== oid) {
				res.writeHead(401, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Invalid session" }));
				return;
			}
			update(body.update)
			res.writeHead(201, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Done" }));
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
