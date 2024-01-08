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
});
