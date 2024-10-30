"use strict";

var TriangleApp = {
	gl: null,
	uScale: null, // 添加 uScale 变量引用
	scaleValue: 0.5, // 初始缩放值
	scaleDirection: 0.01, // 缩放方向与步长

	init: function() {
		var canvas = document.getElementById("triangle-canvas");
		this.gl = canvas.getContext("webgl2");
		if (!this.gl) {
			alert("WebGL isn't available");
			return;
		}

		// 三角形顶点
		var points = new Float32Array([
			-1.0, -1.0,
			 0.0,  1.0,
			 1.0, -1.0,
		]);

		// 配置 WebGL
		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

		// 加载着色器并初始化缓冲区
		var program = initShaders(this.gl, "vertex-shader-triangle", "fragment-shader-triangle");
		this.gl.useProgram(program);

		// 将数据加载到 GPU
		var bufferId = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferId);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);

		// 关联顶点数据
		var vPosition = this.gl.getAttribLocation(program, "vPosition");
		this.gl.vertexAttribPointer(vPosition, 2, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(vPosition);

		// 获取 uScale uniform 位置
		this.uScale = this.gl.getUniformLocation(program, "uScale");

		// 启动动画
		this.animate();
	},

	// 动画渲染函数
	animate: function() {
		// 更新 scaleValue，使其在 0.5 和 2.0 之间循环
		this.scaleValue += this.scaleDirection;
		if (this.scaleValue >= 1.0 || this.scaleValue <= 0.1) {
			this.scaleDirection *= -1; // 反转缩放方向
		}

		// 设置缩放值并渲染
		this.render(this.scaleValue);

		// 请求下一帧
		requestAnimationFrame(this.animate.bind(this));
	},

	render: function(scale) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.uniform1f(this.uScale, scale); // 更新缩放参数
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
	}
};
