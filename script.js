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
	setInterval(() => addEmail("Test!", "me"), 5000);
});

const emailTable = document.getElementById("emailtable");

function addEmail(subject, from) {
	const now = new Date();
	const row = emailTable.insertRow();
	row.insertCell().textContent = subject;
	row.insertCell().textContent = from;
	row.insertCell().textContent = `${now.getHours()}:${now.getMinutes()}`;
}
