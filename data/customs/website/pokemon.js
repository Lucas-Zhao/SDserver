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