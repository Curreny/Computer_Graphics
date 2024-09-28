"use strict";

const {
	vec3
} = glMatrix;

var AppA = {
	canvas: null,
	gl: null,
	points: [],
	numTimesToSubdivide: 4,

	init: function() {
		this.canvas = document.getElementById("gl-canvas-a");
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
		}

		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// 初始化滑块控件并设置事件监听器
		const sliderA = document.getElementById("subdivision-slider-a");
		const sliderValueA = document.getElementById("slider-value-a");
		sliderA.value = this.numTimesToSubdivide;
		sliderValueA.innerHTML = this.numTimesToSubdivide;

		sliderA.oninput = (function() {
			this.numTimesToSubdivide = parseInt(sliderA.value);
			sliderValueA.innerHTML = this.numTimesToSubdivide;
			this.points = [];
			this.divideTriangle(vec3.fromValues(-1, -1, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(1,
				-1, 0), this.numTimesToSubdivide);
			this.renderTriangles();
		}).bind(this);

		// 初始化三角形
		this.divideTriangle(vec3.fromValues(-1, -1, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(1, -1, 0),
			this.numTimesToSubdivide);

		// 配置 WebGL
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

		// 加载着色器并初始化缓冲区
		var programA = initShaders(this.gl, "vertex-shader-a", "fragment-shader-a");
		this.gl.useProgram(programA);

		var vertexBufferA = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBufferA);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

		var vPositionA = this.gl.getAttribLocation(programA, "vPosition");
		this.gl.vertexAttribPointer(vPositionA, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vPositionA);

		this.renderTriangles();
	},

	triangle: function(a, b, c) {
		this.points.push(a[0], a[1], a[2]);
		this.points.push(b[0], b[1], b[2]);
		this.points.push(c[0], c[1], c[2]);
	},

	divideTriangle: function(a, b, c, count) {
		if (count == 0) {
			this.triangle(a, b, c);
		} else {
			var ab = vec3.create();
			vec3.lerp(ab, a, b, 0.5);
			var bc = vec3.create();
			vec3.lerp(bc, b, c, 0.5);
			var ca = vec3.create();
			vec3.lerp(ca, c, a, 0.5);

			this.divideTriangle(a, ab, ca, count - 1);
			this.divideTriangle(b, bc, ab, count - 1);
			this.divideTriangle(c, ca, bc, count - 1);
		}
	},

	renderTriangles: function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.points.length / 3);
	}
};