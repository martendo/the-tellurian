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

const screen = document.getElementById("screen");
let dragwin = null;
let dragwinOrigin = null;
let dragwinOriginalPos = null;
let topZIndex = 10;

function updateWindowDrag(event) {
	let x = dragwinOriginalPos[0] + event.clientX - dragwinOrigin[0];
	let y = dragwinOriginalPos[1] + event.clientY - dragwinOrigin[1];
	const winRect = dragwin.getBoundingClientRect();
	if (x < 0) {
		x = 0;
	} else if (x > screen.clientWidth - winRect.width) {
		x = screen.clientWidth - winRect.width;
	}
	if (y < 0) {
		y = 0;
	} else if (y > screen.clientHeight - winRect.height) {
		y = screen.clientHeight - winRect.height;
	}
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
	CHECKPOINTS.intro();
});

let timeHours = 0;
let timeMinutes = 0;
const clock = document.getElementById("clock");

function getTimeString() {
	const hoursString = (timeHours < 10 ? "0" : "") + timeHours.toString();
	const minutesString = (timeMinutes < 10 ? "0" : "") + timeMinutes.toString();
	return `${hoursString}:${minutesString}`;
}

const clockInterval = setInterval(() => {
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
	messageContent.innerHTML = message;
	while (responseContainer.firstChild) {
		responseContainer.removeChild(responseContainer.firstChild);
	}
	if (responseType === 0) {
		// Button responses
		for (const response of responses) {
			const responseButton = document.createElement("button");
			responseButton.disabled = response[0];
			responseButton.textContent = response[1];
			if (!response[0]) {
				responseButton.addEventListener("click", () => {
					response[0] = true;
					responseButton.disabled = true;
					response[2]();
				});
			}
			responseContainer.appendChild(responseButton);
		}
	} else {
		// Input responses
		const table = document.createElement("table");
		const inputs = [];
		for (let i = 2; i < responses.length; i++) {
			const responseInput = document.createElement("input");
			responseInput.placeholder = responses[i][0];
			table.insertRow().insertCell().appendChild(responseInput);
			inputs.push(responseInput);
		}
		const submitButton = document.createElement("button");
		submitButton.disabled = responses[0];
		submitButton.textContent = "Submit";
		submitButton.className = "submitbutton";
		if (!responses[0]) {
			submitButton.addEventListener("click", () => {
				responses[0] = true;
				submitButton.disabled = true;
				for (let i = 0; i < inputs.length; i++) {
					if (!responses[i + 2][1](inputs[i].value)) {
						// Fail
						CHECKPOINTS[responses[1][1]]();
						return;
					}
				}
				// Pass
				CHECKPOINTS[responses[1][0]]();
			});
		}
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

const CHECKPOINTS = {
	"intro": () => {
		setTimeout(() => {
			addEmail(
				"Welcome!",
				"Venkat Kapoor",
				"Director of Mars Operations at NASA",
				"<p>Hello!</p><p>It is my pleasure to welcome you to the team. This of NASA's most ambitious projects ever. I'm sure you are very aware of our situation with our dear friend Mark Watney. It is our duty to ensure he makes it back to Earth safe and healthy. Being stranded on Mars alone is a serious matter and we are doing everything in our power to get him home.</p><p>Communication among the team will take place over email. Honestly, we don't have the time or energy to do it any other way. You can respond to us with the buttons and text boxes at the bottom of the emails that warrant a response.</p><p>Thank you for taking on this huge challenge. By the way, you might want to refill your cup of coffee.</p>",
				0,
				[[false, "I got coffee!", () => CHECKPOINTS.pos1()]]
			);
		}, 3000);
	},
	"pos1": () => {
		setTimeout(() => {
			addEmail(
				"Let's get started",
				"Venkat Kapoor",
				"Director of Mars Operations at NASA",
				"<p>Hi again.</p><p>Coffee's great. That fuel will be important. You simply can't work without that energy.</p><p>Emergency funding from Congress basically means we can pay you for all the overtime in the world. But don't overwork yourself. You'll need rest eventually. Once you've done enough for the day, clock out. Take a break. You'll need it.</p><p>Control wants the latest position of Watney. Do you have it?</p>",
				1,
				[
					false,
					["pos1pass", "pos1fail"],
					["Latitude", (res) => Math.abs(parseFloat(res) - WATNEY_LAT_1) < 1],
					["Longitude", (res) => Math.abs(parseFloat(res) - WATNEY_LONG_1) < 1],
				]
			);
		}, 1000);
	},
	"pos1pass": () => {
		console.log("yay");
	},
	"pos1fail": () => {
		setTimeout(() => {
			addEmail(
				"Termination",
				"Venkat Kapoor",
				"Director of Mars Operations at NASA",
				"<p>Hey there,</p><p>I got word that the coordinates you found ended up totally screwing over Control. You must've been way off. They, uh, lost communication with the Hab. They're gonna need a week or two to get it back.</p><p>I'm sorry, but I just can't tolerate that kind of mistake.</p><p style=\"color:#ff0000\">You're fired.</p>",
				0,
				[[false, "Try again?", () => location.reload()]]
			);
		}, 2000);
	},
};

const MAP_OFFSET_X = -28.3;
const MAP_OFFSET_Y = 31.9;
const MAP_WIDTH = 22.9 - MAP_OFFSET_X;
const MAP_HEIGHT = -7.4 - MAP_OFFSET_Y;

const WATNEY_LAT_1 = 21.367;
const WATNEY_LONG_1 = -14.149;

const mapCursorPosSpan = document.getElementById("mapcursorpos");

document.getElementById("map").addEventListener("pointermove", (event) => {
	const mapRect = event.currentTarget.getBoundingClientRect();
	const long = (event.clientX - mapRect.left) / mapRect.width * MAP_WIDTH + MAP_OFFSET_X;
	const lat = (event.clientY - mapRect.top) / mapRect.height * MAP_HEIGHT + MAP_OFFSET_Y;
	mapCursorPosSpan.textContent = `${lat.toFixed(3)}, ${long.toFixed(3)}`;
});
