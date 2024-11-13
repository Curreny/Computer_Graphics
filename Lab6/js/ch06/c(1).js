"use strict";

const {
    vec3,
    vec4,
    mat4
} = glMatrix;

var canvas;
var gl;

var program;

var points = [];
var normals = [];

var lightPosition = vec4.fromValues(1.0, 1.0, 1.0, 0.0);// 光源位置
var lightAmbient = vec4.fromValues(0.2, 0.2, 0.2, 1.0);// 环境光颜色
var lightDiffuse = vec4.fromValues(1.0, 1.0, 1.0, 1.0);// 漫反射光颜色
var lightSpecular = vec4.fromValues(1.0, 1.0, 1.0, 1.0);// 镜面反射光颜色

var materialAmbient = vec4.fromValues(1.0, 0.0, 1.0, 1.0);// 材质的环境光反射系数
var materialDiffuse = vec4.fromValues(1.0, 0.8, 0.0, 1.0);// 材质的漫反射系数
var materialSpecular = vec4.fromValues(1.0, 0.8, 0.0, 1.0);// 材质的高光反射系数
var materialShininess = 100.0;// 材质的高光系数

var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var viewerPos;

var thetaLoc;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
var flag = true;

var currentKey = [];

function handleKeyDown(event) {
    var key = event.keyCode;
    currentKey[key] = true;
    switch (key) {
        case 65: // a // select x axis
            axis = xAxis;
            break;
        case 66: // b // select y axis
            axis = yAxis;
            break;
        case 67: // c // select z axis
            axis = zAxis;
            break;
        case 82: // r // toggle rotate
            flag = !flag;
    }
}

function handleKeyUp(event) {
    currentKey[event.keyCode] = false;
}

function makeColorCube() {
    var vertices = [
        vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
        vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
        vec4.fromValues(0.5, 0.5, 0.5, 1.0),
        vec4.fromValues(0.5, -0.5, 0.5, 1.0),
        vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
        vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
        vec4.fromValues(0.5, 0.5, -0.5, 1.0),
        vec4.fromValues(0.5, -0.5, -0.5, 1.0)
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
        1, 0, 3, 1, 3, 2, //正
        2, 3, 7, 2, 7, 6, //右
        3, 0, 4, 3, 4, 7, //底
        6, 5, 1, 6, 1, 2, //顶
        4, 5, 6, 4, 6, 7, //背
        5, 4, 0, 5, 0, 1 //左
    ];

    for (var i = 0; i < faces.length; i += 3) {
        var v1 = vec4.create();
        var v2 = vec4.create();
        vec4.subtract(v1, vertices[faces[i + 1]], vertices[faces[i]]);
        vec4.subtract(v2, vertices[faces[i + 2]], vertices[faces[i + 1]]);
        var normal = vec3.create();
        vec3.cross(normal, vec3.fromValues(v1[0], v1[1], v1[2]), vec3.fromValues(v2[0], v2[1], v2[2]));
        vec3.normalize(normal, normal);

        points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2], vertices[faces[i]][3]);
        points.push(vertices[faces[i + 1]][0], vertices[faces[i + 1]][1], vertices[faces[i + 1]][2], vertices[faces[i + 1]][3]);
        points.push(vertices[faces[i + 2]][0], vertices[faces[i + 2]][1], vertices[faces[i + 2]][2], vertices[faces[i + 2]][3]);

        normals.push(normal[0], normal[1], normal[2]);
        normals.push(normal[0], normal[1], normal[2]);
        normals.push(normal[0], normal[1], normal[2]);
        //var id = Math.floor(i/6);
        //colors.push( vertexColors[id][0], vertexColors[id][1], vertexColors[id][2], vertexColors[id][3] );
    }
}

function initCube() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    // load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    makeColorCube();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    viewerPos = vec3.fromValues(0.0, 0.0, -20.0);

    projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1, 1, -1, 1, -100, 100);

    var ambientProduct = vec4.create();
    vec4.multiply(ambientProduct, lightAmbient, materialAmbient);
    var diffuseProduct = vec4.create();
    vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);
    var specularProduct = vec4.create();
    vec4.multiply(specularProduct, lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform4fv(gl.getUniformLocation(program, "lightAmbient"), flatten(lightAmbient));
    gl.uniform4fv(gl.getUniformLocation(program, "lightDiffuse"), flatten(lightDiffuse));
    gl.uniform4fv(gl.getUniformLocation(program, "lightSpecular"), flatten(lightSpecular));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, new Float32Array(projectionMatrix));

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    document.getElementById("ButtonX").onclick = function () { axis = xAxis; };
    document.getElementById("ButtonY").onclick = function () { axis = yAxis; };
    document.getElementById("ButtonZ").onclick = function () { axis = zAxis; };
    document.getElementById("ButtonT").onclick = function () { flag = !flag; };


    document.getElementById("ambientCoefficient").oninput = function (event) {
        var value = parseFloat(event.target.value);
        materialAmbient[0] = value;
        materialAmbient[1] = value;
        materialAmbient[2] = value;
        updateMaterial();
    };

    document.getElementById("diffuseCoefficient").oninput = function (event) {
        var value = parseFloat(event.target.value);
        materialDiffuse[0] = value;
        materialDiffuse[1] = value;
        materialDiffuse[2] = value;
        updateMaterial();
    };

    document.getElementById("specularCoefficient").oninput = function (event) {
        var value = parseFloat(event.target.value);
        materialSpecular[0] = value;
        materialSpecular[1] = value;
        materialSpecular[2] = value;
        updateMaterial();
    };

    document.getElementById("shininessCoefficient").oninput = function (event) {
        materialShininess = parseFloat(event.target.value);
        updateMaterial();
    };

    document.getElementById("materialColorR").oninput = function (event) {
        var value = parseFloat(event.target.value);
        materialDiffuse[0] = value;
        materialSpecular[0] = value;
        updateMaterial();
    };

    document.getElementById("materialColorG").oninput = function (event) {
        var value = parseFloat(event.target.value);
        materialDiffuse[1] = value;
        materialSpecular[1] = value;
        updateMaterial();
    };

    document.getElementById("materialColorB").oninput = function (event) {
        var value = parseFloat(event.target.value);
        materialDiffuse[2] = value;
        materialSpecular[2] = value;
        updateMaterial();
    };

    document.getElementById("lightPosX").oninput = function (event) {
        lightPosition[0] = parseFloat(event.target.value);
        updateLight();
    };

    document.getElementById("lightPosY").oninput = function (event) {
        lightPosition[1] = parseFloat(event.target.value);
        updateLight();
    };

    document.getElementById("lightPosZ").oninput = function (event) {
        lightPosition[2] = parseFloat(event.target.value);
        updateLight();
    };

    document.getElementById("lightColorR").oninput = function (event) {
        lightDiffuse[0] = parseFloat(event.target.value);
        lightSpecular[0] = parseFloat(event.target.value);
        updateLight();
    };

    document.getElementById("lightColorG").oninput = function (event) {
        lightDiffuse[1] = parseFloat(event.target.value);
        lightSpecular[1] = parseFloat(event.target.value);
        updateLight();
    };

    document.getElementById("lightColorB").oninput = function (event) {
        lightDiffuse[2] = parseFloat(event.target.value);
        lightSpecular[2] = parseFloat(event.target.value);
        updateLight();
    };

    render();
}


function updateMaterial() {
    var ambientProduct = vec4.create();
    vec4.multiply(ambientProduct, lightAmbient, materialAmbient);
    var diffuseProduct = vec4.create();
    vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);
    var specularProduct = vec4.create();
    vec4.multiply(specularProduct, lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

function updateLight() {
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform4fv(gl.getUniformLocation(program, "lightAmbient"), flatten(lightAmbient));
    gl.uniform4fv(gl.getUniformLocation(program, "lightDiffuse"), flatten(lightDiffuse));
    gl.uniform4fv(gl.getUniformLocation(program, "lightSpecular"), flatten(lightSpecular));
}

function flatten(v) {
    var n = v.length;
    var elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    } else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag)
        theta[axis] += 0.80;

    modelViewMatrix = mat4.create();
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta[zAxis] * Math.PI / 180.0);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, theta[yAxis] * Math.PI / 180.0);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, theta[xAxis] * Math.PI / 180.0);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, new Float32Array(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 4);

    requestAnimationFrame(render);
}