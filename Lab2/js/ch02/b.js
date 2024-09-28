"use strict";

var AppB = {
	canvas: null,
	gl: null,
	points: [],
	colors: [],
	numTimesToSubdivide: 4,

	init: function() {
		this.canvas = document.getElementById("gl-canvas-b");
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
		}

		// 初始化滑块控件并设置事件监听器
		const sliderB = document.getElementById("subdivision-slider-b");
		const sliderValueB = document.getElementById("slider-value-b");
		sliderB.value = this.numTimesToSubdivide;
		sliderValueB.innerHTML = this.numTimesToSubdivide;

		sliderB.oninput = () => {
			this.numTimesToSubdivide = parseInt(sliderB.value);
			sliderValueB.innerHTML = this.numTimesToSubdivide;
			this.points = [];
			this.colors = [];
			this.initGasket(); // 重新初始化三角形
		};

		this.initGasket(); // 初始化并渲染三角形
		this.gl.enable(this.gl.DEPTH_TEST); // 启用深度测试
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0); // 设置清除颜色
	},

	initGasket: function() {
		var vertices = [
			0.0000, 0.0000, -1.0000,
			0.0000, 0.9428, 0.3333,
			-0.8165, -0.4714, 0.3333,
			0.8165, -0.4714, 0.3333
		];

		var t = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
		var u = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
		var v = vec3.fromValues(vertices[6], vertices[7], vertices[8]);
		var w = vec3.fromValues(vertices[9], vertices[10], vertices[11]);

		this.divideTetra(t, u, v, w, this.numTimesToSubdivide);

		// 配置 WebGL
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);

		// 加载着色器并初始化缓冲区
		var programB = initShaders(this.gl, "vertex-shader-b", "fragment-shader-b");
		this.gl.useProgram(programB);

		var vBufferB = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBufferB);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

		var vPositionB = this.gl.getAttribLocation(programB, "vPosition");
		this.gl.vertexAttribPointer(vPositionB, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vPositionB);

		var cBufferB = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cBufferB);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

		var aColorB = this.gl.getAttribLocation(programB, "aColor");
		this.gl.vertexAttribPointer(aColorB, 4, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(aColorB);

		this.render();
	},

	triangle: function(a, b, c, color) {
		var baseColor = [
			1.0, 0.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0,
			0.0, 0.0, 0.0, 1.0
		];

		for (var k = 0; k < 4; k++) {
			this.colors.push(baseColor[color * 4 + k]);
		}
		for (var k = 0; k < 3; k++)
			this.points.push(a[k]);

		for (var k = 0; k < 4; k++) {
			this.colors.push(baseColor[color * 4 + k]);
		}
		for (var k = 0; k < 3; k++)
			this.points.push(b[k]);

		for (var k = 0; k < 4; k++) {
			this.colors.push(baseColor[color * 4 + k]);
		}
		for (var k = 0; k < 3; k++)
			this.points.push(c[k]);
	},

	tetra: function(a, b, c, d) {
		this.triangle(a, c, b, 0);
		this.triangle(a, c, d, 1);
		this.triangle(a, b, d, 2);
		this.triangle(b, c, d, 3);
	},

	divideTetra: function(a, b, c, d, count) {
		if (count == 0) {
			this.tetra(a, b, c, d);
		} else {
			var ab = vec3.create();
			glMatrix.vec3.lerp(ab, a, b, 0.5);
			var ac = vec3.create();
			glMatrix.vec3.lerp(ac, a, c, 0.5);
			var ad = vec3.create();
			glMatrix.vec3.lerp(ad, a, d, 0.5);
			var bc = vec3.create();
			glMatrix.vec3.lerp(bc, b, c, 0.5);
			var bd = vec3.create();
			glMatrix.vec3.lerp(bd, b, d, 0.5);
			var cd = vec3.create();
			glMatrix.vec3.lerp(cd, c, d, 0.5);

			--count;

			this.divideTetra(a, ab, ac, ad, count);
			this.divideTetra(ab, b, bc, bd, count);
			this.divideTetra(ac, bc, c, cd, count);
			this.divideTetra(ad, bd, cd, d, count);
		}
	},

	render: function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // 清除颜色和深度缓冲区
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.points.length / 3);
	}
};