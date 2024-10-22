function initRotSquare() {
	var canvas = document.getElementById("rot-canvas");
	var gl = canvas.getContext("webgl2");

	if (!gl) {
		alert("WebGL isn't available");
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	var program = initShaders(gl, "rot-v-shader", "rot-f-shader");
	gl.useProgram(program);

	var vertices = new Float32Array([
		0, 1, 0,
		-1, 0, 0,
		1, 0, 0,
		0, -1, 0
	]);

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var thetaLoc = gl.getUniformLocation(program, "theta");

	function renderSquare() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		var theta = performance.now() / 1000;
		gl.uniform1f(thetaLoc, theta);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(renderSquare);
	}

	renderSquare();
}

function moveCanvas() {
	// 获取用户输入的 X 和 Y 坐标
	var xPos = parseFloat(document.getElementById("xPos").value);
	var yPos = parseFloat(document.getElementById("yPos").value);

	// 将 Canvas 平移到用户指定的位置
	var canvas = document.getElementById("rot-canvas");
	canvas.style.position = "absolute"; // 确保 canvas 能够绝对定位
	canvas.style.transform = `translate(${xPos}px, ${yPos}px)`; // 使用 CSS transform 实现平移
}