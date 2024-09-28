"use strict";

var AppD = {
	canvas: null,
	gl: null,
	points: [],
	numTimesToSubdivide: 4,
	theta: 0,
	twist: false,
	radius: 1.0,

	init: function() {
		this.canvas = document.getElementById("gl-canvas-d");
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
		}

		// 初始化Subdivision滑块
		const sliderD = document.getElementById("subdivision-slider-d");
		const sliderValueD = document.getElementById("slider-value-d");
		sliderD.value = this.numTimesToSubdivide;
		sliderD.oninput = () => {
			this.numTimesToSubdivide = parseInt(sliderD.value);
			sliderValueD.textContent = this.numTimesToSubdivide;
			this.points = [];
			this.renderGasket();
		};

		// 初始化Theta滑块
		const thetaSliderD = document.getElementById("subdivision-slider-theta-d");
		const thetaValueD = document.getElementById("slider-value-theta-d");
		thetaSliderD.value = this.theta;
		thetaSliderD.oninput = () => {
			this.theta = parseInt(thetaSliderD.value);
			thetaValueD.textContent = this.theta;
			this.points = [];
			this.renderGasket();
		};

		this.renderGasket(); // 初始化并渲染三角形
	},

	renderGasket: function() {
		var vertices = [
			this.radius * Math.cos(90 * Math.PI / 180.0), this.radius * Math.sin(90 * Math.PI / 180.0), 0,
			this.radius * Math.cos(210 * Math.PI / 180.0), this.radius * Math.sin(210 * Math.PI / 180.0), 0,
			this.radius * Math.cos(-30 * Math.PI / 180.0), this.radius * Math.sin(-30 * Math.PI / 180.0), 0
		];

		var u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
		var v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
		var w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

		this.divideTriangle(u, v, w, this.numTimesToSubdivide);

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

		var program = initShaders(this.gl, "vertex-shader-d", "fragment-shader-d");
		this.gl.useProgram(program);

		var vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

		var vPosition = this.gl.getAttribLocation(program, "vPosition");
		this.gl.vertexAttribPointer(vPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vPosition);

		this.renderTriangles();
	},

	tessellaTriangle: function(a, b, c) {
		var zerovec3 = vec3.create();
		vec3.zero(zerovec3);
		var radian = this.theta * Math.PI / 180.0;

		var a_new = vec3.create();
		var b_new = vec3.create();
		var c_new = vec3.create();

		if (this.twist == false) {
			vec3.rotateZ(a_new, a, zerovec3, radian);
			vec3.rotateZ(b_new, b, zerovec3, radian);
			vec3.rotateZ(c_new, c, zerovec3, radian);

			this.points.push(a_new[0], a_new[1], a_new[2]);
			this.points.push(b_new[0], b_new[1], b_new[2]);
			this.points.push(b_new[0], b_new[1], b_new[2]);
			this.points.push(c_new[0], c_new[1], c_new[2]);
			this.points.push(c_new[0], c_new[1], c_new[2]);
			this.points.push(a_new[0], a_new[1], a_new[2]);
		} else {
			var d_a = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
			var d_b = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
			var d_c = Math.sqrt(c[0] * c[0] + c[1] * c[1]);

			vec3.set(a_new, a[0] * Math.cos(d_a * radian) - a[1] * Math.sin(d_a * radian),
				a[0] * Math.sin(d_a * radian) + a[1] * Math.cos(d_a * radian), 0);
			vec3.set(b_new, b[0] * Math.cos(d_b * radian) - b[1] * Math.sin(d_b * radian),
				b[0] * Math.sin(d_b * radian) + b[1] * Math.cos(d_b * radian), 0);
			vec3.set(c_new, c[0] * Math.cos(d_c * radian) - c[1] * Math.sin(d_c * radian),
				c[0] * Math.sin(d_c * radian) + c[1] * Math.cos(d_c * radian), 0);

			this.points.push(a_new[0], a_new[1], a_new[2]);
			this.points.push(b_new[0], b_new[1], b_new[2]);
			this.points.push(b_new[0], b_new[1], b_new[2]);
			this.points.push(c_new[0], c_new[1], c_new[2]);
			this.points.push(c_new[0], c_new[1], c_new[2]);
			this.points.push(a_new[0], a_new[1], a_new[2]);
		}
	},

	divideTriangle: function(a, b, c, count) {
		// check for end of recursion
		if (count == 0) {
			this.tessellaTriangle(a, b, c);
		} else {
			var ab = vec3.create();
			vec3.lerp(ab, a, b, 0.5);
			var bc = vec3.create();
			vec3.lerp(bc, b, c, 0.5);
			var ca = vec3.create();
			vec3.lerp(ca, c, a, 0.5);

			// three new triangles
			this.divideTriangle(a, ab, ca, count - 1);
			this.divideTriangle(ab, b, bc, count - 1);
			this.divideTriangle(ca, bc, c, count - 1);
			this.divideTriangle(ab, bc, ca, count - 1);
		}
	},

	renderTriangles: function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.drawArrays(this.gl.LINES, 0, this.points.length / 3);
	}
};