var gl;

var MAX_POINTS = 40000;
var numPoints = 0;

var shouldUpdate = false;

var delay = 100;
var lineBuffer;
var squareBuffer;
var program;

var transformLoc;
var colorLoc;

var worldBounds = [
    [0, 0],
    [350, 350],
];

var worldW = worldBounds[1][0] - worldBounds[0][0];
var worldH = worldBounds[1][1] - worldBounds[0][1];

var worldCenter = [[worldW / 2, worldH / 2]];

var worldToNDC;


var list;

function calcWorldToNDC() {
    var worldBL = worldBounds[0];
    var worldTR = worldBounds[1];

    var worldH = worldTR[1] - worldBL[1];
    var worldW = worldTR[0] - worldBL[0];

    var toOrigin = translate4x4(-worldBL[0], -worldBL[1], 0);
    var mainTranslation = translate4x4(-worldW / 2, -worldH / 2, 0);
    var scaleMTX = scale4x4(2 / worldW, 2 / worldH, 1);
    var out = matMult(mainTranslation, toOrigin);
    out = matMult(scaleMTX, out);
    return out;
}


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    worldToNDC = calcWorldToNDC();

    gl = initWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.7, 0.7, 0.7, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    //Line Vertex Buffer
    lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 2 * 4 * 2, gl.STATIC_DRAW);
    gl.bufferSubData(
        gl.ARRAY_BUFFER,
        0,
        flatten([
            [0, 0],
            [1, 0],
        ]),
    );

    squareBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 6 * 4 * 2, gl.STATIC_DRAW);
    gl.bufferSubData(
        gl.ARRAY_BUFFER,
        0,
        flatten([
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [-0.5, -0.5],
            [0.5, 0.5],
            [0.5, -0.5],
        ]),
    );

    transformLoc = gl.getUniformLocation(program, "uWorldToNDC");
    colorLoc = gl.getUniformLocation(program, "uColor");

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    canvas.addEventListener("mousemove", (event) => {
        if (shouldUpdate) {
            var pos = [
                event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop,
            ];
            var p = [pos[0], pos[1]];

            // Calc and Print the points for display
            var pW = matVecMult(devToWorld, [...p, 0, 1]);
            var pNDC = matVecMult(worldToNDC, pW);
        }
    });
    render();
};

function getTransformMTX(trans, scale, rot) {
    var out = scale4x4(scale[0], scale[1], 1);

    out = matMult(rotate4x4(degreesToRadians(rot), "z"), out);

    out = matMult(translate4x4(trans[0], trans[1], 0), out);

    out = matMult(worldToNDC, out);
    return out;
}
function getTransformMTXLocal(trans, scale, rot) {
    var out = scale4x4(scale[0], scale[1], 1);

    out = matMult(rotate4x4(degreesToRadians(rot), "z"), out);

    out = matMult(translate4x4(trans[0], trans[1], 0), out);

    return out;
}



function renderSpoke(angle, distance, color) {
    var transform = getTransformMTX(worldCenter[0], [distance, 1], angle);
    gl.uniformMatrix4fv(transformLoc, false, flatten(transform));
    gl.uniform3f(colorLoc, color[0], color[1], color[2]);
    gl.lineWidth(2);
    gl.drawArrays(gl.LINES, 0, 2);
}

// in the form [pos, scale, rot]
var chairLines = [
    [[-0.5, 0], [175, 0], 0],
    [[-0.5, 0], [100, 0], -90],
    [[0.5, 0.5], [175, 0], -90],
];
function renderChair(position, angle) {
    var chairTransform = getTransformMTX(position, [0.2, 0.2], angle);

    chairLines.forEach((cl) => {
        var pos = cl[0];
        var sc = cl[1];
        var rot = cl[2];

        var localTransform = getTransformMTXLocal([pos[0] * worldW / 2, pos[1] * worldH / 2], sc, rot);

        var combinedTransform = matMult(chairTransform, localTransform);

        gl.uniformMatrix4fv(transformLoc, false, flatten(combinedTransform));

        gl.uniform3f(colorLoc, 1, 0, 0);
        gl.lineWidth(2);
        gl.drawArrays(gl.LINES, 0, 2);
    });
    chairLines.forEach((cl) => {
        var pos = cl[0];
        var sc = cl[1];
        var rot = cl[2];

        var rPos = [(pos[0] * worldW / 2) - 20, (pos[1] * worldH / 2) + 20]

        var localTransform = getTransformMTXLocal(rPos, sc, rot);

        var combinedTransform = matMult(chairTransform, localTransform);

        gl.uniformMatrix4fv(transformLoc, false, flatten(combinedTransform));

        gl.uniform3f(colorLoc, 1, 0, 0);
        gl.lineWidth(2);
        gl.drawArrays(gl.LINES, 0, 2);
    });
}

counter = 0;
var numSpokes = 12;
var angleInc = 360 / numSpokes;
var continuousAngle = 0;

var chairAng = 0;
var maxChairAngle = 35;
var coef = 1;

var wheelSpeed = 0.3;

var chairStartingLocs = []
for (var i = 0; i < numSpokes; i++) {
    chairStartingLocs[i] = Math.random() * maxChairAngle;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    continuousAngle += 1 * wheelSpeed;
    continuousAngle = continuousAngle % 360;

    if (Math.abs(chairAng) >= maxChairAngle) {
        coef *= -1;
    }
    chairAng += coef * 2;



    // ===== DRAW ALL LINES =====
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var dist = 150;
    var spokeOffsetDegrees = 4;
    for (var i = 0; i < numSpokes; i++) {
        var angle = i * angleInc;
        angle += continuousAngle;
        var angleRad = degreesToRadians(angle);

        renderSpoke(angle + spokeOffsetDegrees, dist, [0.2, 0.5, 0.8]);

        var chairAngle = angleRad + degreesToRadians(spokeOffsetDegrees / 2);
        var x = Math.cos(chairAngle) * dist;
        var y = Math.sin(chairAngle) * dist;
        renderChair([worldCenter[0][0] + x, worldCenter[0][1] + y], chairAng + chairStartingLocs[i]);

        renderSpoke(angle, dist, [0.2, 0.1, 0.8]);
    }


    // ===== DRAW ALL SQUARES =====
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.uniform3f(colorLoc, 0.8, 0.0, 0.0);
    var transform = getTransformMTX(worldCenter[0], [10, 10], 0);
    gl.uniformMatrix4fv(transformLoc, false, flatten(transform));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Request the next frame to animate
    setTimeout(function() {
        requestAnimFrame(render);
    }, delay);
}
