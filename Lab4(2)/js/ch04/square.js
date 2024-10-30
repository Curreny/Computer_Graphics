"use strict";

var SquareApp = {
	canvas: null,
	gl: null,
	theta: 0.0,
	thetaLoc: null,
	direction: 1,
	speed: 20,
	sides: 4,

	init: function () {
		this.canvas = document.getElementById("square-canvas");
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
			return;
		}

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

		var program = initShaders(this.gl, "vertex-shader-square", "fragment-shader-square");
		this.gl.useProgram(program);

		// 根据 sides 动态生成顶点
		this.updateVertices(this.sides);

		this.thetaLoc = this.gl.getUniformLocation(program, "theta");

		this.render();
	},

	// 生成多边形的顶点
	updateVertices: function (numSides) {
		var vertices = [];
		var angleStep = (2 * Math.PI) / numSides;

		for (var i = 0; i < numSides; i++) {
			var angle = i * angleStep;
			vertices.push(Math.cos(angle), Math.sin(angle), 0);
		}

		vertices = new Float32Array(vertices);

		// 创建并绑定缓冲区
		var bufferId = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferId);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

		var vPosition = this.gl.getAttribLocation(this.gl.getParameter(this.gl.CURRENT_PROGRAM), "vPosition");
		this.gl.vertexAttribPointer(vPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vPosition);
	},

	render: function () {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.theta += this.direction * 0.1;
		this.gl.uniform1f(this.thetaLoc, this.theta);
		this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.sides); // 使用 TRIANGLE_FAN 绘制多边形

		setTimeout(() => {
			requestAnimFrame(this.render.bind(this));
		}, this.speed);
	},

};
