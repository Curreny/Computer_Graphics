"use strict";

const {
	vec4
} = glMatrix;

var CubeApp = {
	canvas: null,
	gl: null,
	points: [],
	colors: [],
	xAxis: 0,
	yAxis: 1,
	zAxis: 2,
	axis: 0,
	theta: [0, 0, 0],
	thetaLoc: null,

	init: function() {
		this.canvas = document.getElementById("rtcb-canvas");
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
			return;
		}

		this.makeCube();

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);

		// Load shaders and initialize attribute buffer
		var program = initShaders(this.gl, "rtvshader", "rtfshader");
		this.gl.useProgram(program);

		// Load color buffer
		var cBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

		var vColor = this.gl.getAttribLocation(program, "vColor");
		this.gl.vertexAttribPointer(vColor, 4, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vColor);

		// Load position buffer
		var vBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

		var vPosition = this.gl.getAttribLocation(program, "vPosition");
		this.gl.vertexAttribPointer(vPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vPosition);

		this.thetaLoc = this.gl.getUniformLocation(program, "theta");
		this.gl.uniform3fv(this.thetaLoc, this.theta);

		document.getElementById("xbutton").onclick = () => {
			this.axis = this.xAxis;
		};

		document.getElementById("ybutton").onclick = () => {
			this.axis = this.yAxis;
		};

		this.render();
	},

	makeCube: function() {
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
			1, 0, 3, 1, 3, 2, // Front
			2, 3, 7, 2, 7, 6, // Right
			3, 0, 4, 3, 4, 7, // Bottom
			6, 5, 1, 6, 1, 2, // Top
			4, 5, 6, 4, 6, 7, // Back
			5, 4, 0, 5, 0, 1  // Left
		];

		for (var i = 0; i < faces.length; i++) {
			this.points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);

			this.colors.push(
				vertexColors[Math.floor(i / 6)][0],
				vertexColors[Math.floor(i / 6)][1],
				vertexColors[Math.floor(i / 6)][2],
				vertexColors[Math.floor(i / 6)][3]
			);
		}
	},

	render: function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.theta[this.axis] += 0.1;
		this.gl.uniform3fv(this.thetaLoc, this.theta);

		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.points.length / 3);

		requestAnimFrame(() => this.render());
	}
};
