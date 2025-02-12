(function() {
	window.toID = function(text){
		if (typeof text !== "string") {
			if (text) text = text.id || text.userid || text.roomid || text;
			if (typeof text === "number") text = "" + text;
			else if (typeof text !== "string") return "";
		}
		return text.toLowerCase().replace(/[^a-z0-9]+/g, "")
	}
	let sessionId = window.location.href.split("sessionId=")[1];
	if(!sessionId) {
		alert("Invalid session!");
		return;
	}
	window.sessionId = sessionId;
	const form = document.getElementById('myForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      console.log('Form submission prevented.');
      // Handle form data here, e.g., validate or send with fetch
    });
})()
const apiUrl = "http://localhost:3000";

const makePostRequest = async (url, body) => {
	body.sessionId = sessionId;
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
  
	  const data = await response.json(); // Assuming the API returns JSON
	  console.log("Response Data:", data);
	  return data;
	} catch (error) {
	  console.error("Error making POST request:", error);
	}
  };

  function getVal(id) {
	return document.getElementById(id).value;
  }

function addPokemon() {
	try {
	console.log("test")
	let body =	{
		pokemon: {
		  name: getVal("name"),
		  types: getVal("type2") == getVal("type1") ? [getVal("type1")] : [getVal("type2"),getVal("type1")],
		  genderRatio: { M: 0.875, F: 0.125 },
		  baseStats: { hp: parseInt(getVal("hp")), atk: parseInt(getVal("atk")), def: parseInt(getVal("def")), spa: parseInt(getVal("spa")), spd: parseInt(getVal("spd")), spe: parseInt(getVal("spe")) },
		  abilities: {},
		  heightm: getVal("weight"),
		  weightkg: getVal("height"),
		 // color: "Blue",
		  prevo: getVal("prevo"),
		  evoType: "trade",
		  requiredItem: getVal("requiredItem")
		 // evoCondition: "during the day",
		},
		
		  isMega: getVal("ismega") === "yes",
		  learnset: {},
		}

	if(getVal("requiredItem").length > 2) body.pokemon.requiredItem = getVal("requiredItem")
		getVal("moveset").split(",").forEach((move) => {
			body.learnset[toID(move)] = ["9L4"]
		})
		getVal("ability").split(",").forEach((ab,i) => {
			body.pokemon.abilities[i] = ab;
		})
	  
	  
	makePostRequest(apiUrl + "/addpokemon", body);
	} catch(e) { console.log(e) }
}