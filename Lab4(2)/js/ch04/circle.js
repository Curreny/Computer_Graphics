"use strict";

var CircleApp = {
	canvas: null,
	gl: null,
	sides: 100,
	scale: 0.2, // 设置缩放因子，值越小图形越小
	translateX: 0.0, // X 轴上的初始平移
	translateY: 0.0, // Y 轴上的初始平移
	velocityX: 0.015, // X 轴上的速度
	velocityY: 0.013, // Y 轴上的速度

	init: function () {
		this.canvas = document.getElementById("rot-canvas");
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
			return;
		}

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

		var program = initShaders(this.gl, "rot-v-shader", "rot-f-shader");
		this.gl.useProgram(program);

		// 获取平移变量的 Uniform 位置
		this.translateLoc = this.gl.getUniformLocation(program, "uTranslate");
		// 根据 sides 动态生成顶点
		this.updateVertices(this.sides);

		this.render();
	},

	// 生成多边形的顶点
	updateVertices: function (numSides) {
		var vertices = [];
		var angleStep = (2 * Math.PI) / numSides;

		// 使用 scale 来控制多边形的大小
		for (var i = 0; i < numSides; i++) {
			var angle = i * angleStep;
			vertices.push(this.scale * Math.cos(angle), this.scale * Math.sin(angle), 0);
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
		this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.sides); // 使用 TRIANGLE_FAN 绘制多边形
		// 更新平移位置
		this.translateX += this.velocityX;
		this.translateY += this.velocityY;

		// 边界检测，反向运动
		if (Math.abs(this.translateX) > 1.0 - this.scale) this.velocityX = -this.velocityX;
		if (Math.abs(this.translateY) > 1.0 - this.scale) this.velocityY = -this.velocityY;
		// 设置平移位置
		this.gl.uniform2f(this.translateLoc, this.translateX, this.translateY);

		this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.sides);
		requestAnimationFrame(this.render.bind(this));
	},
};
