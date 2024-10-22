var canvasTranslation = [0, 0]; // 用于保存画布的平移值

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
	var translationLoc = gl.getUniformLocation(program, "translation");

	function renderSquare() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		var theta = performance.now() / 1000;
		gl.uniform1f(thetaLoc, theta);
		gl.uniform2fv(translationLoc, [0.0, 0.0]); // 正方形保持原地旋转

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(renderSquare);
	}

	renderSquare();
}

// 控制 Canvas 平移
function moveCanvas() {
	// 获取用户输入的 X 和 Y 坐标
	var xPos = parseFloat(document.getElementById("xPos").value);
	var yPos = parseFloat(document.getElementById("yPos").value);

	// 将 Canvas 平移到用户指定的位置
	var canvas = document.getElementById("rot-canvas");
	canvas.style.position = "absolute"; // 确保 canvas 能够绝对定位
	canvas.style.transform = `translate(${xPos}px, ${yPos}px)`; // 使用 CSS transform 实现平移
}

// 按按钮控制 Canvas 沿 X 轴平移
function moveCanvasX(delta) {
	canvasTranslation[0] += delta; // 更新 X 方向的平移量
	applyCanvasTranslation();
}

// 按按钮控制 Canvas 沿 Y 轴平移
function moveCanvasY(delta) {
	canvasTranslation[1] += delta; // 更新 Y 方向的平移量
	applyCanvasTranslation();
}

// 应用 Canvas 的平移
function applyCanvasTranslation() {
	var canvas = document.getElementById("rot-canvas");
	canvas.style.position = "absolute"; // 确保 canvas 能够绝对定位
	canvas.style.transform = `translate(${canvasTranslation[0]}px, ${canvasTranslation[1]}px)`; // 使用 CSS transform 实现平移
}