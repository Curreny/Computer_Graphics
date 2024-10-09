"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;
var sides = 4; // 默认值为四边形

function changeDir() {
	direction *= -1;
}

function initRotSquare() {
	canvas = document.getElementById("rot-canvas");
	gl = canvas.getContext("webgl2");
	if (!gl) {
		alert("WebGL isn't available");
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	var program = initShaders(gl, "rot-v-shader", "rot-f-shader");
	gl.useProgram(program);

	// 根据 sides 动态生成顶点
	updateVertices(sides);

	thetaLoc = gl.getUniformLocation(program, "theta");

	// 更新速度滑杆
	document.getElementById("speedcon").oninput = function(event) {
		speed = 100 - event.target.value;
		updateSpeedDisplay(event.target.value);
	}

	// 更新边数滑杆
	document.getElementById("sidesRange").oninput = function(event) {
		sides = event.target.value;
		updatePolygonSidesDisplay(sides); // 实时更新显示边数
		updateVertices(sides); // 更新多边形的顶点
	}

	renderSquare();
}

// 生成多边形的顶点
function updateVertices(numSides) {
	var vertices = [];
	var angleStep = (2 * Math.PI) / numSides;

	for (var i = 0; i < numSides; i++) {
		var angle = i * angleStep;
		vertices.push(Math.cos(angle), Math.sin(angle), 0);
	}

	vertices = new Float32Array(vertices);

	// 创建并绑定缓冲区
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(gl.getParameter(gl.CURRENT_PROGRAM), "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
}

function renderSquare() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	theta += direction * 0.1;
	gl.uniform1f(thetaLoc, theta);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, sides); // 使用 TRIANGLE_FAN 绘制多边形
	setTimeout(function() {
		requestAnimFrame(renderSquare);
	}, speed);
}

// 实时更新速度值
function updateSpeedDisplay(value) {
	document.getElementById("speedValue").textContent = value;
}

// 实时更新边数值
function updatePolygonSidesDisplay(value) {
	document.getElementById("sidesValue").textContent = value;
}