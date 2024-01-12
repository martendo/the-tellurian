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
let topZIndex = 2;

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
	setInterval(() => addEmail("Test!", "me", `${Math.random()}`), 5000);
});

const emailTable = document.getElementById("emailtable");

function openEmail(message) {
	document.getElementById("messagecontent").textContent = message;
	const win = document.getElementById("messagewindow");
	win.style.zIndex = topZIndex++;
	win.style.display = "block";
}

function addEmail(subject, from, message) {
	const now = new Date();
	const row = emailTable.insertRow();
	row.insertCell().textContent = subject;
	row.insertCell().textContent = from;
	row.insertCell().textContent = `${now.getHours()}:${now.getMinutes()}`;
	row.addEventListener("click", () => {
		openEmail(message);
	});
}
