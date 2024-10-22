"use strict";

const {
	vec4
} = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;
var scaleLoc;
var scale = [1.0, 1.0]; // 用于缩放的初始比例

window.onload = function initCube() {
	canvas = document.getElementById("rtcb-canvas");

	gl = canvas.getContext("webgl2");
	if (!gl) {
		alert("WebGL isn't available");
	}

	makeCube();

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	// load shaders and initialize attribute buffer
	var program = initShaders(gl, "rtvshader", "rtfshader");
	gl.useProgram(program);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	thetaLoc = gl.getUniformLocation(program, "theta");
	gl.uniform3fv(thetaLoc, theta);

	// 获取 scale 的 uniform 变量位置
	scaleLoc = gl.getUniformLocation(program, "scale");
	gl.uniform2fv(scaleLoc, scale);

	// 旋转按钮
	document.getElementById("xbutton").onclick = function() {
		axis = xAxis;
	}
	document.getElementById("ybutton").onclick = function() {
		axis = yAxis;
	}

	// 监听滑杆，更新缩放比例
	document.getElementById("xscale").oninput = function(event) {
		scale[0] = parseFloat(event.target.value); // 更新x轴缩放比例
		gl.uniform2fv(scaleLoc, scale);
	}

	document.getElementById("yscale").oninput = function(event) {
		scale[1] = parseFloat(event.target.value); // 更新y轴缩放比例
		gl.uniform2fv(scaleLoc, scale);
	}

	render();
}

function makeCube() {
	var vertices = [
		vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
		vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
		vec4.fromValues(0.5, 0.5, 0.5, 1.0),
		vec4.fromValues(0.5, -0.5, 0.5, 1.0),
		vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
		vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
		vec4.fromValues(0.5, 0.5, -0.5, 1.0),
		vec4.fromValues(0.5, -0.5, -0.5, 1.0),
	];

	var vertexColors = [
		vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		vec4.fromValues(1.0, 0.0, 0.0, 1.0),
		vec4.fromValues(1.0, 1.0, 0.0, 1.0),
		vec4.fromValues(0.0, 1.0, 0.0, 1.0),
		vec4.fromValues(0.0, 0.0, 1.0, 1.0),
		vec4.fromValues(1.0, 0.0, 1.0, 1.0),
		vec4.fromValues(0.0, 1.0, 1.0, 1.0),
		vec4.fromValues(1.0, 1.0, 1.0, 1.0)
	];

	var faces = [
		1, 0, 3, 1, 3, 2, // 正面
		2, 3, 7, 2, 7, 6, // 右面
		3, 0, 4, 3, 4, 7, // 底面
		6, 5, 1, 6, 1, 2, // 顶面
		4, 5, 6, 4, 6, 7, // 背面
		5, 4, 0, 5, 0, 1 // 左面
	];

	for (var i = 0; i < faces.length; i++) {
		points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
		colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i /
			6)][2], vertexColors[Math.floor(i / 6)][3]);
	}
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	theta[axis] += 0.1;
	gl.uniform3fv(thetaLoc, theta);

	gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

	requestAnimationFrame(render);
}