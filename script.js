"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function updateCanvasSize() {
	const rect = document.documentElement.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
}

function updateCanvas() {
	ctx.fillStyle = "#ff0000";
	ctx.fillRect(0, 0, 50, 50);
}

let dragwin = null;
let dragwinOrigin = null;
let dragwinOriginalPos = null;
let topZIndex = 10;

function updateWindowDrag(event) {
	const x = dragwinOriginalPos[0] + event.clientX - dragwinOrigin[0];
	const y = dragwinOriginalPos[1] + event.clientY - dragwinOrigin[1];
	dragwin.style.left = `${x}px`;
	dragwin.style.top = `${y}px`;
}

for (const titlebar of document.getElementsByClassName("windowtitle")) {
	titlebar.addEventListener("pointerdown", (event) => {
		const win = titlebar.parentElement;
		dragwin = win;
		dragwinOrigin = [event.clientX, event.clientY];
		const style = getComputedStyle(win);
		const x = parseInt(style.left.slice(0, -2), 10);
		const y = parseInt(style.top.slice(0, -2), 10);
		dragwinOriginalPos = [x, y];
		win.style.zIndex = topZIndex++;
	});
}

for (const winclose of document.getElementsByClassName("windowclose")) {
	const win = winclose.parentElement.parentElement;
	winclose.addEventListener("click", () => {
		win.style.display = "none";
	});
}

window.addEventListener("pointerup", (event) => {
	if (dragwin === null) {
		return;
	}
	updateWindowDrag(event);
	dragwin = null;
	dragwinOrigin = null;
	dragwinOriginalPos = null;
});
window.addEventListener("pointermove", (event) => {
	if (dragwin === null) {
		return;
	}
	updateWindowDrag(event);
});

window.addEventListener("resize", () => {
	updateCanvasSize();
	updateCanvas();
});
window.addEventListener("load", () => {
	updateCanvasSize();
	updateCanvas();
	setTimeout(() => {
		addEmail(
			"Welcome!",
			"Venkat Kapoor",
			"Director of Mars Operations at NASA",
			"Hello!\n\nIt is my pleasure to welcome you to the team. This of NASA's most ambitious projects ever. I'm sure you are very aware of our situation with our dear friend Mark Watney. It is our duty to ensure he makes it back to Earth safe and healthy. Being stranded on Mars alone is a serious matter and we are doing everything in our power to get him home.\n\nCommunication among the team will take place over email. Honestly, we don't have the time or energy to do it any other way. You can respond to us with the buttons and text boxes at the bottom of the emails that warrant a response.\n\nThank you for taking on this huge challenge. By the way, you might want to refill your cup of coffee.",
			0,
			[["I got coffee!", () => setTimeout(() => {
				addEmail(
					"Let's get started",
					"Venkat Kapoor",
					"Director of Mars Operations at NASA",
					"Hi again.\n\nCoffee's great. That fuel will be important. You simply can't work without that energy.\n\nEmergency funding from Congress basically means we can pay you for all the overtime in the world. But don't overwork yourself. You'll need rest eventually. Once you've done enough for the day, clock out. Take a break. You'll need it.\n\nMedia wants the latest position of Watney. Do you have it?",
					1,
					[["Position"]]
				);
			}, 500)]]
		);
	}, 3000);
});

let timeHours = 0;
let timeMinutes = 0;
const clock = document.getElementById("clock");

function getTimeString() {
	const hoursString = (timeHours < 10 ? "0" : "") + timeHours.toString();
	const minutesString = (timeMinutes < 10 ? "0" : "") + timeMinutes.toString();
	return `${hoursString}:${minutesString}`;
}

setInterval(() => {
	timeMinutes++;
	if (timeMinutes >= 60) {
		timeMinutes = 0;
		timeHours++;
	}
	clock.textContent = getTimeString();
}, 250/3);

const emailTable = document.getElementById("emailtable");
const messageFromDetails = document.getElementById("messagefromdetails");
const messageContent = document.getElementById("messagecontent");
const responseContainer = document.getElementById("responsecontainer");

function openEmail(fromDetails, message, responseType, responses) {
	messageFromDetails.textContent = fromDetails;
	messageContent.textContent = message;
	while (responseContainer.firstChild) {
		responseContainer.removeChild(responseContainer.firstChild);
	}
	if (responseType === 0) {
		for (const response of responses) {
			const responseButton = document.createElement("button");
			responseButton.textContent = response[0];
			responseButton.addEventListener("click", response[1]);
			responseContainer.appendChild(responseButton);
		}
	} else {
		const table = document.createElement("table");
		const inputs = [];
		for (const response of responses) {
			const responseInput = document.createElement("input");
			responseInput.placeholder = response[0];
			table.insertRow().insertCell().appendChild(responseInput);
			inputs.push(responseInput);
		}
		const submitButton = document.createElement("button");
		submitButton.textContent = "Submit";
		submitButton.className = "submitbutton";
		submitButton.addEventListener("click", () => {
			for (const input of inputs) {
				console.log(input.value);
			}
		});
		const submitCell = table.insertRow().insertCell();
		submitCell.colSpan = 2;
		submitCell.appendChild(submitButton);
		responseContainer.appendChild(table);
	}
	const win = document.getElementById("messagewindow");
	win.style.zIndex = topZIndex++;
	win.style.display = "block";
}

function addEmail(subject, from, fromDetails, message, responseType, responses) {
	const now = new Date();
	const row = emailTable.insertRow();
	row.insertCell().textContent = subject;
	row.insertCell().textContent = from;
	row.insertCell().textContent = getTimeString();
	row.addEventListener("click", () => {
		openEmail(`From ${from}, ${fromDetails}`, message, responseType, responses);
	});
}
