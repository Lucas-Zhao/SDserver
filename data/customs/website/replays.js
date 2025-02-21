


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

function loadReplays(replays = []) {
	let html = ``;
	replays.reverse().forEach((replay,i) => {
		html += `    <tr>
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${i + 1}</td>
            <td onclick="" 
            data-title="Denial of Service Vulnerability in Linux Kernel"
                  data-source="hackernews"
                  data-severity="HIGH"
                  data-priority="2"
                  data-date="Jan 27, 2025"
                  data-description="A vulnerability has been reported in the Linux kernel that could allow a local attacker to cause denial of service conditions on a targeted system."
                  data-fix-link="https://github.com/patch-link">${replay.title}</td>
            <td>${replay.id.split("-")[1]}</td>
            <td>${replay.uploadedBy}</td>
            <td>${(new Date(replay.uploadTime)).toString().split(" ").slice(1,5).join(" ")}</td>
            <td><a style="padding: 5px;border:1px solid blue;text-decoration: none;border-radius: 5px;" href="${replay.url}" target="_blank">Watch!</a></td>
          </tr>`
	})
	document.getElementById("replays-table").innerHTML = html;
}