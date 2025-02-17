let url = "http://localhost:3000/allpokemon"


sessionId = window.location.href.split("sessionId=")[1].replace("#","");
if (!sessionId) {
  alert("Invalid session!");
}
window.sessionId = sessionId;

const fetchData = async (url) => {
	let body = {}
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
	  console.error("Error making POST request:", error);
	}
  };

  fetchData(url).then((data) => {
	console.log(data)
  })


  function loadPokemon(replays = []) {
	let html = ``;
	replays.reverse().forEach((replay,i) => {
		let stats = ``;
		let bst = 0;
		Object.keys(replay.baseStats).forEach((stat) => {
			stats += `<sup>${stat.toUpperCase()}</sup> <b>${replay.baseStats[stat]}</b> `
			bst += replay.baseStats[stat]
		})
		html += `    <tr>
		<td> <button style="background:red;color:white;padding:5px;border:1px solid white;border-radius:4px;font-weight:600;" onclick="deletePokemon('${replay.name}')"> DELETE </button> </td>
            <td>${i + 1}</td>
            <td onclick="" 
            data-title="Denial of Service Vulnerability in Linux Kernel"
                  data-source="hackernews"
                  data-severity="HIGH"
                  data-priority="2"
                  data-date="Jan 27, 2025"
                  data-description="A vulnerability has been reported in the Linux kernel that could allow a local attacker to cause denial of service conditions on a targeted system."
                  data-fix-link="https://github.com/patch-link">${replay.name}</td>
            <td>${replay.prevo ? replay.prevo : replay.baseSpecies || "NA"}</td>
            <td>${replay.evos ? replay.evos.join(",") : "NA"}</td>
            <td>${stats} <sup> BST </sup> <b> ${bst} </b></td>
          </tr>`
	})
	document.getElementById("pokemon-table").innerHTML = html;
}

function deletePokemon(name) {
	let areyousure = confirm("Are you sure you want delete " + name + " ?");
	if(!areyousure) return;

	makePostRequest(apiUrl + "/deletepokemon",{ pokemon : name}).then((data) => {
		if(data.message === "Done") return loadPokemon(Object.values(data.data.pokedex));
		alert(data.message)
	})
}