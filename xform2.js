
function translate3x3(tx, ty) {
	trans = mat3();

	trans[0][2] = tx;
	trans[1][2] = ty;

	return trans;
}

function scale3x3 (sx, sy) {
	scale = mat3();

	scale[0][0] = sx;
	scale[1][1] = sy;

	return scale;
}
function rotate3x3 (theta) {
	let rot = mat3();
	rot[0][0] =  Math.cos(theta);
	rot[0][1] = -Math.sin(theta);
	rot[1][0] =  Math.sin(theta);
	rot[1][1] =  Math.cos(theta);

	return rot;
}

function translate4x4(tx, ty, tz) {
	trans = mat4();

	trans[0][3] = tx;
	trans[1][3] = ty;
	trans[2][3] = tz;

	return trans;
}

function scale4x4 (sx, sy, sz) {
	scale = mat4();

	scale[0][0] = sx;
	scale[1][1] = sy;
	scale[2][2] = sz;

	return scale;
}
function rotate4x4 (theta, dim) {
	rot = mat4();
	switch (dim) {
		case 'x': 
			rot[1][1] =  Math.cos(theta);
			rot[1][2] = -Math.sin(theta);
			rot[2][1] =  Math.sin(theta);
			rot[2][2] =  Math.cos(theta);
			break;
		case 'y': 
			rot[0][1] =  Math.cos(theta);
			rot[0][2] =  Math.sin(theta);
			rot[2][0] = -Math.sin(theta);
			rot[2][2] =  Math.cos(theta);
			break;
		case 'z': 
			rot[0][0] =  Math.cos(theta);
			rot[0][1] = -Math.sin(theta);
			rot[1][0] =  Math.sin(theta);
			rot[1][1] =  Math.cos(theta);
			break;
	}

	return rot;
}
