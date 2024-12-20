"use strict";

const { vec3, vec4 } = glMatrix;

var WebGLAppA = {
    canvas: null,
    gl: null,
    program: null,
    points: [],
    colors: [],
    texCoords: [],
    texSize: 256,
    numChecks: 64,
    texture1: null,
    texture2: null,
    c: null,
    xAxis: 0,
    yAxis: 1,
    zAxis: 2,
    axis: 0,
    theta: [45.0, 45.0, 0.0],
    thetaLoc: null,
    latitudeBands: 500,
    longitudeBands: 500,
    vertexColors: [
        vec4.fromValues(1.0, 0.0, 0.0, 1.0), // 红色
        vec4.fromValues(1.0, 1.0, 0.0, 1.0), // 黄色
        vec4.fromValues(0.0, 1.0, 0.0, 1.0), // 绿色
        vec4.fromValues(0.0, 0.0, 1.0, 1.0), // 蓝色
        vec4.fromValues(1.0, 0.0, 1.0, 1.0), // 紫色
        vec4.fromValues(0.0, 1.0, 1.0, 1.0)  // 青色
    ],

    init: function () {
        this.canvas = document.getElementById("gl-canvas");
        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl) {
            alert("WebGL isn't available");
            return;
        }

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE); // 启用背面剔除
        this.gl.cullFace(this.gl.BACK); // 剔除背面

        // Load shaders and initialize attribute buffers
        this.program = initShaders(this.gl, "vertex-shader", "fragment-shader");
        this.gl.useProgram(this.program);

        this.thetaLoc = this.gl.getUniformLocation(this.program, "theta");

        this.configureTexture();
        this.initEventHandlers();
        this.updateSphere();
        this.render();
    },

    configureTexture: function () {
        var image1 = new Uint8Array(4 * this.texSize * this.texSize);
        for (var i = 0; i < this.texSize; i++) {
            for (var j = 0; j < this.texSize; j++) {
                this.c = 255 * (((i & 0x20) == 0) ^ ((j & 0x20) == 0));
                image1[4 * i * this.texSize + 4 * j] = this.c;
                image1[4 * i * this.texSize + 4 * j + 1] = this.c;
                image1[4 * i * this.texSize + 4 * j + 2] = this.c;
                image1[4 * i * this.texSize + 4 * j + 3] = 255;
            }
        }

        var image2 = new Uint8Array(4 * this.texSize * this.texSize);
        for (var i = 0; i < this.texSize; i++) {
            for (var j = 0; j < this.texSize; j++) {
                image2[4 * i * this.texSize + 4 * j] = 127 + 127 * Math.sin(0.1 * i * j);
                image2[4 * i * this.texSize + 4 * j + 1] = 127 + 127 * Math.sin(0.1 * i * j);
                image2[4 * i * this.texSize + 4 * j + 2] = 127 + 127 * Math.sin(0.1 * i * j);
                image2[4 * i * this.texSize + 4 * j + 3] = 255;
            }
        }

        this.texture1 = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture1);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.texSize, this.texSize, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image1);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.texture2 = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture2);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.texSize, this.texSize, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image2);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    },

    initEventHandlers: function () {
        document.getElementById("ButtonX").onclick = () => { this.axis = this.xAxis; };
        document.getElementById("ButtonY").onclick = () => { this.axis = this.yAxis; };
        document.getElementById("ButtonZ").onclick = () => { this.axis = this.zAxis; };

        document.getElementById("latitudeSlider").oninput = (event) => {
            this.latitudeBands = parseInt(event.target.value);
            document.getElementById("latitudeValue").innerText = this.latitudeBands;
            this.updateSphere();
        };

        document.getElementById("longitudeSlider").oninput = (event) => {
            this.longitudeBands = parseInt(event.target.value);
            document.getElementById("longitudeValue").innerText = this.longitudeBands;
            this.updateSphere();
        };
    },

    makeSphere: function (radius, latitudeBands, longitudeBands) {
        this.points = [];
        this.colors = [];
        this.texCoords = [];

        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                this.points.push(radius * x, radius * y, radius * z);
                this.texCoords.push(u, v);

                this.colors.push(1.0, 1.0, 1.0, 1.0);
            }
        }

        for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;

                this.points.push(this.points[first * 3], this.points[first * 3 + 1], this.points[first * 3 + 2]);
                this.points.push(this.points[second * 3], this.points[second * 3 + 1], this.points[second * 3 + 2]);
                this.points.push(this.points[(first + 1) * 3], this.points[(first + 1) * 3 + 1], this.points[(first + 1) * 3 + 2]);

                this.points.push(this.points[second * 3], this.points[second * 3 + 1], this.points[second * 3 + 2]);
                this.points.push(this.points[(second + 1) * 3], this.points[(second + 1) * 3 + 1], this.points[(second + 1) * 3 + 2]);
                this.points.push(this.points[(first + 1) * 3], this.points[(first + 1) * 3 + 1], this.points[(first + 1) * 3 + 2]);

                this.texCoords.push(this.texCoords[first * 2], this.texCoords[first * 2 + 1]);
                this.texCoords.push(this.texCoords[second * 2], this.texCoords[second * 2 + 1]);
                this.texCoords.push(this.texCoords[(first + 1) * 2], this.texCoords[(first + 1) * 2 + 1]);

                this.texCoords.push(this.texCoords[second * 2], this.texCoords[second * 2 + 1]);
                this.texCoords.push(this.texCoords[(second + 1) * 2], this.texCoords[(second + 1) * 2 + 1]);
                this.texCoords.push(this.texCoords[(first + 1) * 2], this.texCoords[(first + 1) * 2 + 1]);

                // 根据纬度选择颜色
                var colorIndex = Math.floor(latNumber / (latitudeBands / 6));
                for (var i = 0; i < 6; i++) {
                    this.colors.push(this.vertexColors[colorIndex][0], this.vertexColors[colorIndex][1], this.vertexColors[colorIndex][2], this.vertexColors[colorIndex][3]);
                }
            }
        }
    },

    updateSphere: function () {
        this.makeSphere(1, this.latitudeBands, this.longitudeBands);
        this.updateBuffers();
    },

    updateBuffers: function () {
        var cBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

        var vColor = this.gl.getAttribLocation(this.program, "vColor");
        this.gl.vertexAttribPointer(vColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vColor);

        var vBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

        var vPosition = this.gl.getAttribLocation(this.program, "vPosition");
        this.gl.vertexAttribPointer(vPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vPosition);

        var tBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texCoords), this.gl.STATIC_DRAW);

        var vTexCoord = this.gl.getAttribLocation(this.program, "vTexCoord");
        this.gl.vertexAttribPointer(vTexCoord, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vTexCoord);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture1);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, "texture1"), 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture2);
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, "texture2"), 1);
    },

    render: function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.theta[this.axis] += 0.3;
        this.gl.uniform3fv(this.thetaLoc, this.theta);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.points.length / 3);

        requestAnimFrame(this.render.bind(this));
    }
};
