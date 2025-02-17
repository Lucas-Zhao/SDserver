
// Immediately Invoked Function Expression (IIFE) to handle `sessionId` and helper functions
let sessionId; // Declare sessionId globally
const client = url = "http://localhost:5501";
(function () {
  window.toID = function (text) {
    if (typeof text !== "string") {
      if (text) text = text.id || text.userid || text.roomid || text;
      if (typeof text === "number") text = "" + text;
      else if (typeof text !== "string") return "";
    }
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
  };

  sessionId = window.location.href.split("sessionId=")[1].replace("#","");
  if (!sessionId) {
    alert("Invalid session!");
    return;
  }
  window.sessionId = sessionId;

  
})();

// API URL
const apiUrl = "http://localhost:3000";

// Make POST request function
const makePostRequest = async (url, body) => {
  body.sessionId = sessionId; // Attach sessionId to the request body
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response
    console.log("Response Data:", data);
    return data;
  } catch (error) {
    throw error;
    console.error("Error making POST request:", error);
  }
};

// Helper functions for input handling and validation
function getVal(id) {
  return document.getElementById(id).value.trim(); // Trim spaces
}

function capitalizeWords(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
}

function updateSprite() {
	let name = toID(getVal("name"))
	console.log(name)
	let baseLink = "https://raw.githubusercontent.com/ISenseAura/files/refs/heads/main/" + name;
	document.getElementById("bsprite").src = baseLink + ".png"
	document.getElementById("bsprite2").src = baseLink + "-back.png"
	document.getElementById("bsprites").src = baseLink + "-shiny.png"
	document.getElementById("bsprites2").src = baseLink + "-shiny-back.png"


}

function validatePokemon(body) {
  // Name validation
  if (!body.pokemon.name) {
    throw new Error("The Pokémon name is required.");
  }
  if (body.pokemon.name.startsWith("Mega")) {
    throw new Error("The Pokémon name cannot start with 'Mega'.");
  }
  if (body.pokemon.name.includes(" ")) {
    throw new Error("The Pokémon name should not include spaces. Use '-' instead.");
  }

  // Base stats validation
  if (
    !body.pokemon.baseStats ||
    Object.values(body.pokemon.baseStats).some((stat) => isNaN(stat) || stat <= 0)
  ) {
    throw new Error("Base stats are required and must all be positive numbers.");
  }

  // Abilities validation
  if (!body.pokemon.abilities || Object.keys(body.pokemon.abilities).length === 0) {
    throw new Error("At least one ability is required.");
  }

  // Mega Pokémon validation
  if (body.isMega && !body.pokemon.requiredItem) {
    throw new Error("A Mega Pokémon must have a required item.");
  }

  // Moveset validation
  if (!body.learnset || !Array.isArray(body.learnset) || body.learnset.length === 0) {
    throw new Error("A moveset is required for the Pokémon.");
  }
}

// Add Pokémon function
function addPokemon() {
  try {
    console.log("Adding Pokémon...");

    const nameInput = getVal("name");
    const formattedName = capitalizeWords(nameInput);

    const body = {
      pokemon: {
        name: formattedName,
        types:
          getVal("type2") === getVal("type1")
            ? [getVal("type1")]
            : [getVal("type1"), getVal("type2")],
        genderRatio: { M: 0.875, F: 0.125 },
        baseStats: {
          hp: parseInt(getVal("hp")),
          atk: parseInt(getVal("atk")),
          def: parseInt(getVal("def")),
          spa: parseInt(getVal("spa")),
          spd: parseInt(getVal("spd")),
          spe: parseInt(getVal("spe")),
        },
        abilities: {
          "0": getVal("ability1"),
          "1": getVal("ability2") || null,
          H: getVal("hiddenAbility") || null,
        },
        heightm: parseFloat(getVal("height")),
        weightkg: parseFloat(getVal("weight")),
        prevo: getVal("prevo") || null,
        evoType: "trade",
        requiredItem: getVal("requiredItem") || null,
      },
      isMega: getVal("ismega").toLowerCase() === "yes",
      learnset: getVal("moveset").split(",").map((move) => move.trim()), // Convert moveset into an array
    };

    // Validate Pokémon data
    validatePokemon(body);

	if(body.isMega) {
		delete body.pokemon.prevo;
		body.pokemon.baseSpecies = getVal("prevo")
		body.pokemon.forme = "Mega"
    if(body.pokemon.name.endsWith("-X")) body.pokemon.forme = "Mega-X"
    if(body.pokemon.name.endsWith("-Y")) body.pokemon.forme = "Mega-Y"
    if(body.pokemon.name.endsWith("-Z")) body.pokemon.forme = "Mega-Z"


	}
    // Make API request
    makePostRequest(apiUrl + "/addpokemon", body).then((response) => {
      console.log("Response from server:", response);
      alert("Pokémon added successfully!");
    });

    console.log("Pokémon added successfully:", body);
  } catch (error) {
    console.error("Error adding Pokémon:", error.message);
    alert(error.message); // Provide feedback to the user
  }
}

function openLink(file) {
  window.location.href = "/" + file + "?sessionId=" + window.sessionId;
}

function updateClient() {
  let body = { update : "repo"}
  makePostRequest(apiUrl + "/update",body).then((data) => {
    console.log(data)
    document.getElementById("logs").innerHTML = data.message.replace("\n","<br>")
    document.getElementById("errors").innerHTML = data.errors.replace("\n","<br>")

  })
}

window.onload = function() {
  document.getElementById("sidebar").innerHTML = `<nav>
            <ul>
                <li onclick="openLink('index.html')"><a href="#">Dashboard</a></li>
                <li onclick="openLink('pokemon.html')"><a href="#">Pokemon</a></li>
                <li onclick="openLink('replays.html')"><a href="#">Replays</a></li>
                <li><a href="#">Abilities</a></li>
                <li><a href="#">Moves</a></li>
                <li><a href="#">Usage Stats</a></li>
                <li><a href="#">Settings</a></li>
            </ul>
        </nav>`
}