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
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

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