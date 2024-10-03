//////////////////////////////////////////////////////////////////////////////
//
// matrix, vector  utilities
//
//////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------
function degreesToRadians(degr) {
	// returns the radians, given degrees

    return degr * Math.PI/180.0;
}
//----------------------------------------------------------------------------
//
//  Vector Constructors
//
function vec2(x, y) {
	// returns a 2 element vector in homogeneous coords

	return [x, y];
}

function vec2h (x, y) {
	// returns a 2D vector in homogeneous coords

	return [x, y, 1.];
}

function vec3(x, y, z) {
	// returns a 3D vector

	return [x, y, z];
}
function vec3h(x, y, z) {
	// returns a 3D vector

	return [x, y, z, 1.];
}

function vec3h(x, y, z, w) {
	return [x, y, z, w];
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors
//

function mat2() {
	return identity2();
}

//----------------------------------------------------------------------------

function mat3() {
	return identity3 ();
}
//----------------------------------------------------------------------------

function mat4() {
	return identity4();
}

//----------------------------------------------------------------------------
function identity2() {
	// returns a 2x2 identity matrix
	// as array of arrays for easy indexing by row
	let m = [
				[1.0, 0.0],
				[0.0, 1.0]
		   ];
	m.matrix = true;

	return m;
}

//----------------------------------------------------------------------------
function identity3() {
	// returns a 3x3 identity matrix
	// as array of arrays for easy indexing by row
	let m =  [
				[1.0, 0.0, 0.0],
				[0.0, 1.0, 0.0],
				[0.0, 0.0, 1.0],
		   ];

	m.matrix = true;
	return m;
}
//----------------------------------------------------------------------------
function identity4() {
	// returns a 3x3 identity matrix
	// as array of arrays for easy indexing by row
	let m =  [
				[1.0, 0.0, 0.0, 0.0],
				[0.0, 1.0, 0.0, 0.0],
				[0.0, 0.0, 1.0, 0.0],
				[0.0, 0.0, 0.0, 1.0],
		   ];
	m.matrix = true;
	return m;
}
//----------------------------------------------------------------------------
//
//  Matrix Functions
//
//----------------------------------------------------------------------------
// multiplies the matrices m1 and m2
// assumes the matrices are of  the same dimensions
// assumes matrices are an array of arrays

function matMult(m1, m2) {

    let result = [];

	for (let i = 0; i < m1.length; ++i) {
		result.push([]);
		for (let j = 0; j < m2.length; ++j) {
			let sum = 0.0;
			for (let k = 0; k < m1.length; ++k) {
				sum += m1[i][k] * m2[k][j];
			}
			result[i].push(sum);
		}
	}
	result.matrix = true;
	return result;
}
//----------------------------------------------------------------------------
function matVecMult (m, v) {
	if (m.length != v.length) {
        throw "matVecMult(): num rows of matrix and length of vector mismatch!";
	}

	let result = [];

    for (let i = 0; i < m.length; ++i) {
		let sum = 0;
    	for (let j = 0; j < m.length; ++j)
			sum += m[i][j]*v[j];
		result.push(sum);
	}

	return result;
}
//----------------------------------------------------------------------------

function vecMult(v1, v2) {
	// multiplies two vectors term by term
	result = [];
	if ( v1.length != v2.length ) {
		throw "vecMult(): vectors are not the same dimension";
	}

	for (let i = 0; i < v1.length; ++i ) {
		result.push( v1[i] * v2[i] );
	}

	return result;
}

function transpose(m) {
	// transpose a matrix 
    let result = [];
    for (let i = 0; i < m.length; ++i) {
        result.push([]);
        for (let j = 0; j < m[i].length; ++j) {
            result[i].push( m[j][i] );
        }
    }
	result.matrix = true;

    return result;
}
//----------------------------------------------------------------------------
//
// computes the dot product between vectors u and v
//
function dot_product (u, v) {
    if (u.length != v.length) {
        throw "dot_product(): vectors are not the same dimension";
    }

    let sum = 0.0;
    for (let i = 0; i < u.length; ++i) {
        sum += u[i] * v[i];
    }

    return sum;
}
//----------------------------------------------------------------------------
// negates the vector u
function negate( u ) {
    let result = [];
    for (let i = 0; i < u.length; ++i) {
        result.push( -u[i] );
    }

    return result;
}

//----------------------------------------------------------------------------
// computes the cross product between vectors u and v
function cross_product(u, v) {
    if (!Array.isArray(u) || u.length < 3) {
        throw "cross_product(): first argument is not a vector of at least 3";
    }

    if ( !Array.isArray(v) || v.length < 3 ) {
        throw "cross(): second argument is not a vector of at least 3";
    }

	let result = [ 
			u[1]*v[2] - u[2]*v[1],
			u[2]*v[0] - u[0]*v[2],
			u[0]*v[1] - u[1]*v[0]
		];

	return result;
}
//----------------------------------------------------------------------------
// magnitude of a vector
function length(u) {
    return Math.sqrt(dot_product(u, u));
}

//----------------------------------------------------------------------------
// normalize a vector with or without the last component
function normalize(u, excludeLastComponent) { 
    if (excludeLastComponent) {
        var last = u.pop();
    }
    let len = length(u);

    if (!isFinite(len)) {
        throw "normalize: vector " + u + " has zero length";
    }
    
    for ( let i = 0; i < u.length; ++i ) {
        u[i] /= len;
    }

    if (excludeLastComponent) {
        u.push( last );
    }
            
    return u;
}
//----------------------------------------------------------------------------
