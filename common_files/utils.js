
// ************************************************************
// this file has  a set of utility functions useful in WebGL programs
//
// Creator: Kalpathi Subramanian
// Sources : various
// Date: 12/23/21
//
// ************************************************************
function initWebGL (canvas) {
	// Initialize the WebGL context
	// returns the context 
	const gl = canvas.getContext("webgl");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL\n"+ 
			+ "Your browser or machine may not support it.");
  	}

    return gl;
}

//
// Provides requestAnimationFrame in a cross browser way.
//
// Source Angel/Shreiner book tools
// 
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

//
//	initialize vertex and fragment shaders
//  Source: Angel/Shreiner book tools
//

// this function initializes the vertex and fragment shaders
function initShaders(gl, vertexShaderId, fragmentShaderId ) {
	let vertShdr, fragShdr;

	let vertElem = document.getElementById( vertexShaderId );
	if (!vertElem) {
		alert( "Unable to load vertex shader " + vertexShaderId );
		return -1;
	}
	else {
		// create the vertex shader  
		vertShdr = gl.createShader(gl.VERTEX_SHADER);

		// read it as a string
		gl.shaderSource(vertShdr, vertElem.text);

		// compile it
		gl.compileShader(vertShdr);

		// print error logs if compilation failed
		if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
			let msg = "Vertex shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
			alert( msg );
			return -1;
		}
	}

	// get the fragment shader source (string) and then compile it
	let fragElem = document.getElementById( fragmentShaderId );
	if (!fragElem) {
		alert( "Unable to load vertex shader " + fragmentShaderId );
		return -1;
	}
	else {
		// create a fragment shader
		fragShdr = gl.createShader(gl.FRAGMENT_SHADER);

		// read it as a string
		gl.shaderSource(fragShdr, fragElem.text);

		// compile it
		gl.compileShader( fragShdr );

		// print error logs if compilation failed
		if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
			let msg = "Fragment shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
			alert( msg );
			return -1;
		}
	}

	// create  a shader program 
	let program = gl.createProgram();

	// attach the two shaders to the program
	gl.attachShader(program, vertShdr);
	gl.attachShader(program, fragShdr);

	// link the program
	gl.linkProgram(program);

	// if linking failed, print error log
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		let msg = "Shader program failed to link.  The error log is:"
			+ "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
		alert( msg );
		return -1;
	}
	return program;
}

function flatten( v ) {

	// This function takes Javascript arrays and flattens it into 
	// a set of floating point values; this is required since Javascript
	// arrays, being objects, cannot be passed to GL buffers directly,
	// buffers expect raw float (or whatever type chose)  values

	// For matrices, column major is expected by it, so this function 
	// transposes them for convenience and then flattens it

	if (v.matrix === true) {
		v = transpose(v);
	}

	var n = v.length;
	var elemsAreArrays = false;

	if (Array.isArray(v[0])) {
		elemsAreArrays = true;
		n *= v[0].length;
	}

	var float_vals = new Float32Array(n);

	if (elemsAreArrays) {
		var idx = 0;
		for ( var i = 0; i < v.length; ++i ) {
			for ( var j = 0; j < v[i].length; ++j ) {
				float_vals[idx++] = v[i][j];
			}
		}
	}
	else {
		for ( var i = 0; i < v.length; ++i ) {
			float_vals[i] = v[i];
		}
	}

	return float_vals;
}

