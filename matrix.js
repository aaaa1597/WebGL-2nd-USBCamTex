/* mat名前空間定義 */
var mat = mat || {};

mat.Matrix44 = {};
mat.Matrix44.create = function(){
	return [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,];
}

mat.Matrix44.createIdentity = function(){
	return [1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1];
}

mat.Matrix44.loadIdentity = function(retmat){
	retmat[ 0] = 1; retmat[ 1] = 0; retmat[ 2] = 0; retmat[ 3] = 0;
	retmat[ 4] = 0; retmat[ 5] = 1; retmat[ 6] = 0; retmat[ 7] = 0;
	retmat[ 8] = 0; retmat[ 9] = 0; retmat[10] = 1; retmat[11] = 0;
	retmat[12] = 0; retmat[13] = 0; retmat[14] = 0; retmat[15] = 1;
	return retmat;
}

mat.Matrix44.multiply = function(mat1, mat2, retmat){
	var a = mat1[0],  b = mat1[1],  c = mat1[2],  d = mat1[3],
		e = mat1[4],  f = mat1[5],  g = mat1[6],  h = mat1[7],
		i = mat1[8],  j = mat1[9],  k = mat1[10], l = mat1[11],
		m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15],
		A = mat2[0],  B = mat2[1],  C = mat2[2],  D = mat2[3],
		E = mat2[4],  F = mat2[5],  G = mat2[6],  H = mat2[7],
		I = mat2[8],  J = mat2[9],  K = mat2[10], L = mat2[11],
		M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];
	retmat[ 0] = A * a + B * e + C * i + D * m;
	retmat[ 1] = A * b + B * f + C * j + D * n;
	retmat[ 2] = A * c + B * g + C * k + D * o;
	retmat[ 3] = A * d + B * h + C * l + D * p;

	retmat[ 4] = E * a + F * e + G * i + H * m;
	retmat[ 5] = E * b + F * f + G * j + H * n;
	retmat[ 6] = E * c + F * g + G * k + H * o;
	retmat[ 7] = E * d + F * h + G * l + H * p;

	retmat[ 8] = I * a + J * e + K * i + L * m;
	retmat[ 9] = I * b + J * f + K * j + L * n;
	retmat[10] = I * c + J * g + K * k + L * o;
	retmat[11] = I * d + J * h + K * l + L * p;

	retmat[12] = M * a + N * e + O * i + P * m;
	retmat[13] = M * b + N * f + O * j + P * n;
	retmat[14] = M * c + N * g + O * k + P * o;
	retmat[15] = M * d + N * h + O * l + P * p;
	return retmat;
}

mat.Matrix44.scale = function(mat, vec, retmat){
	retmat[0]  = mat[0]  * vec[0];
	retmat[1]  = mat[1]  * vec[0];
	retmat[2]  = mat[2]  * vec[0];
	retmat[3]  = mat[3]  * vec[0];
	retmat[4]  = mat[4]  * vec[1];
	retmat[5]  = mat[5]  * vec[1];
	retmat[6]  = mat[6]  * vec[1];
	retmat[7]  = mat[7]  * vec[1];
	retmat[8]  = mat[8]  * vec[2];
	retmat[9]  = mat[9]  * vec[2];
	retmat[10] = mat[10] * vec[2];
	retmat[11] = mat[11] * vec[2];
	retmat[12] = mat[12];
	retmat[13] = mat[13];
	retmat[14] = mat[14];
	retmat[15] = mat[15];
	return retmat;
}

mat.Matrix44.translate = function(mat, vec, retmat){
	retmat[0] = mat[0]; retmat[1] = mat[1]; retmat[2]  = mat[2];  retmat[3]  = mat[3];
	retmat[4] = mat[4]; retmat[5] = mat[5]; retmat[6]  = mat[6];  retmat[7]  = mat[7];
	retmat[8] = mat[8]; retmat[9] = mat[9]; retmat[10] = mat[10]; retmat[11] = mat[11];
	retmat[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8]  * vec[2] + mat[12];
	retmat[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9]  * vec[2] + mat[13];
	retmat[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
	retmat[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
	return retmat;
}

mat.Matrix44.rotate = function(mat, angle, axis, retmat){
	var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	if(!sq){return null;}
	var a = axis[0], b = axis[1], c = axis[2];
	if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
	var d = Math.sin(angle), e = Math.cos(angle), f = 1 - e,
		g = mat[0],  h = mat[1], i = mat[2],  j = mat[3],
		k = mat[4],  l = mat[5], m = mat[6],  n = mat[7],
		o = mat[8],  p = mat[9], q = mat[10], r = mat[11],
		s = a * a * f + e,
		t = b * a * f + c * d,
		u = c * a * f - b * d,
		v = a * b * f - c * d,
		w = b * b * f + e,
		x = c * b * f + a * d,
		y = a * c * f + b * d,
		z = b * c * f - a * d,
		A = c * c * f + e;
	if(angle){
		if(mat != retmat){
			retmat[12] = mat[12]; retmat[13] = mat[13];
			retmat[14] = mat[14]; retmat[15] = mat[15];
		}
	} else {
		retmat = mat;
	}
	retmat[0]  = g * s + k * t + o * u;
	retmat[1]  = h * s + l * t + p * u;
	retmat[2]  = i * s + m * t + q * u;
	retmat[3]  = j * s + n * t + r * u;
	retmat[4]  = g * v + k * w + o * x;
	retmat[5]  = h * v + l * w + p * x;
	retmat[6]  = i * v + m * w + q * x;
	retmat[7]  = j * v + n * w + r * x;
	retmat[8]  = g * y + k * z + o * A;
	retmat[9]  = h * y + l * z + p * A;
	retmat[10] = i * y + m * z + q * A;
	retmat[11] = j * y + n * z + r * A;
	return retmat;
}

mat.Matrix44.lookAt = function(eye, center, up, retmat){
	var eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
		upX     = up[0],     upY     = up[1],     upZ     = up[2],
		centerX = center[0], centerY = center[1], centerZ = center[2];
	if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.loadIdentity(retmat);}
	var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
	z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
	l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	z0 *= l; z1 *= l; z2 *= l;
	x0 = upY * z2 - upZ * z1;
	x1 = upZ * z0 - upX * z2;
	x2 = upX * z1 - upY * z0;
	l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	if(!l){
		x0 = 0; x1 = 0; x2 = 0;
	} else {
		l = 1 / l;
		x0 *= l; x1 *= l; x2 *= l;
	}
	y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
	l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	if(!l){
		y0 = 0; y1 = 0; y2 = 0;
	} else {
		l = 1 / l;
		y0 *= l; y1 *= l; y2 *= l;
	}
	retmat[0] = x0; retmat[1] = y0; retmat[2]  = z0; retmat[3]  = 0;
	retmat[4] = x1; retmat[5] = y1; retmat[6]  = z1; retmat[7]  = 0;
	retmat[8] = x2; retmat[9] = y2; retmat[10] = z2; retmat[11] = 0;
	retmat[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
	retmat[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
	retmat[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
	retmat[15] = 1;
	return retmat;
}

mat.Matrix44.perspective = function(fovy, aspect, near, far, retmat){
	var t = near * Math.tan(fovy * Math.PI / 360);
	var r = t * aspect;
	var a = r * 2, b = t * 2, c = far - near;
	retmat[0]  = near * 2 / a;
	retmat[1]  = 0;
	retmat[2]  = 0;
	retmat[3]  = 0;
	retmat[4]  = 0;
	retmat[5]  = near * 2 / b;
	retmat[6]  = 0;
	retmat[7]  = 0;
	retmat[8]  = 0;
	retmat[9]  = 0;
	retmat[10] = -(far + near) / c;
	retmat[11] = -1;
	retmat[12] = 0;
	retmat[13] = 0;
	retmat[14] = -(far * near * 2) / c;
	retmat[15] = 0;
	return retmat;
}

mat.Matrix44.ortho = function(left, right, top, bottom, near, far, retmat) {
	var h = (right - left);
	var v = (top - bottom);
	var d = (far - near);
	retmat[0]  = 2 / h;
	retmat[1]  = 0;
	retmat[2]  = 0;
	retmat[3]  = 0;
	retmat[4]  = 0;
	retmat[5]  = 2 / v;
	retmat[6]  = 0;
	retmat[7]  = 0;
	retmat[8]  = 0;
	retmat[9]  = 0;
	retmat[10] = -2 / d;
	retmat[11] = 0;
	retmat[12] = -(left + right) / h;
	retmat[13] = -(top + bottom) / v;
	retmat[14] = -(far + near) / d;
	retmat[15] = 1;
	return retmat;
}

mat.Matrix44.transpose = function(mat, retmat){
	retmat[0]  = mat[0];  retmat[1]  = mat[4];
	retmat[2]  = mat[8];  retmat[3]  = mat[12];
	retmat[4]  = mat[1];  retmat[5]  = mat[5];
	retmat[6]  = mat[9];  retmat[7]  = mat[13];
	retmat[8]  = mat[2];  retmat[9]  = mat[6];
	retmat[10] = mat[10]; retmat[11] = mat[14];
	retmat[12] = mat[3];  retmat[13] = mat[7];
	retmat[14] = mat[11]; retmat[15] = mat[15];
	return retmat;
}

mat.Matrix44.inverse = function(mat, retmat){
	var a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
		e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
		i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
		m = mat[12], n = mat[13], o = mat[14], p = mat[15],
		q = a * f - b * e, r = a * g - c * e,
		s = a * h - d * e, t = b * g - c * f,
		u = b * h - d * f, v = c * h - d * g,
		w = i * n - j * m, x = i * o - k * m,
		y = i * p - l * m, z = j * o - k * n,
		A = j * p - l * n, B = k * p - l * o,
		ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
	retmat[0]  = ( f * B - g * A + h * z) * ivd;
	retmat[1]  = (-b * B + c * A - d * z) * ivd;
	retmat[2]  = ( n * v - o * u + p * t) * ivd;
	retmat[3]  = (-j * v + k * u - l * t) * ivd;
	retmat[4]  = (-e * B + g * y - h * x) * ivd;
	retmat[5]  = ( a * B - c * y + d * x) * ivd;
	retmat[6]  = (-m * v + o * s - p * r) * ivd;
	retmat[7]  = ( i * v - k * s + l * r) * ivd;
	retmat[8]  = ( e * A - f * y + h * w) * ivd;
	retmat[9]  = (-a * A + b * y - d * w) * ivd;
	retmat[10] = ( m * u - n * s + p * q) * ivd;
	retmat[11] = (-i * u + j * s - l * q) * ivd;
	retmat[12] = (-e * z + f * x - g * w) * ivd;
	retmat[13] = ( a * z - b * x + c * w) * ivd;
	retmat[14] = (-m * t + n * r - o * q) * ivd;
	retmat[15] = ( i * t - j * r + k * q) * ivd;
	return retmat;
}

mat.Vector4 = {};
mat.Vector4.create = function(){
	return new Float32Array(4);
}

mat.Vector4.identity = function(retvec){
	retvec[0] = 0; retvec[1] = 0; retvec[2] = 0; retvec[3] = 1;
	return retvec;
}

mat.Vector4.inverse = function(qtn, retvec){
	retvec[0] = -qtn[0];
	retvec[1] = -qtn[1];
	retvec[2] = -qtn[2];
	retvec[3] =  qtn[3];
	return retvec;
}

mat.Vector4.normalize = function(retvec){
	var x = retvec[0], y = retvec[1], z = retvec[2], w = retvec[3];
	var l = Math.sqrt(x * x + y * y + z * z + w * w);
	if(l === 0){
		retvec[0] = 0;
		retvec[1] = 0;
		retvec[2] = 0;
		retvec[3] = 0;
	}else{
		l = 1 / l;
		retvec[0] = x * l;
		retvec[1] = y * l;
		retvec[2] = z * l;
		retvec[3] = w * l;
	}
	return retvec;
}

mat.Vector4.multiply = function(qtn1, qtn2, retvec){
	var ax = qtn1[0], ay = qtn1[1], az = qtn1[2], aw = qtn1[3];
	var bx = qtn2[0], by = qtn2[1], bz = qtn2[2], bw = qtn2[3];
	retvec[0] = ax * bw + aw * bx + ay * bz - az * by;
	retvec[1] = ay * bw + aw * by + az * bx - ax * bz;
	retvec[2] = az * bw + aw * bz + ax * by - ay * bx;
	retvec[3] = aw * bw - ax * bx - ay * by - az * bz;
	return retvec;
}

mat.Vector4.rotate = function(angle, axis, retvec){
	var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	if(!sq){return null;}
	var a = axis[0], b = axis[1], c = axis[2];
	if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
	var s = Math.sin(angle * 0.5);
	retvec[0] = a * s;
	retvec[1] = b * s;
	retvec[2] = c * s;
	retvec[3] = Math.cos(angle * 0.5);
	return retvec;
}

mat.Vector4.toVecIII = function(vec, qtn, retvec){
	var qp = this.create();
	var qq = this.create();
	var qr = this.create();
mat.Vector4.inverse(qtn, qr);
	qp[0] = vec[0];
	qp[1] = vec[1];
	qp[2] = vec[2];
mat.Vector4.multiply(qr, qp, qq);
mat.Vector4.multiply(qq, qtn, qr);
	retvec[0] = qr[0];
	retvec[1] = qr[1];
	retvec[2] = qr[2];
	return retvec;
}

mat.Vector4.toMatIV = function(qtn, retvec){
	var x = qtn[0], y = qtn[1], z = qtn[2], w = qtn[3];
	var x2 = x + x, y2 = y + y, z2 = z + z;
	var xx = x * x2, xy = x * y2, xz = x * z2;
	var yy = y * y2, yz = y * z2, zz = z * z2;
	var wx = w * x2, wy = w * y2, wz = w * z2;
	retvec[0]  = 1 - (yy + zz);
	retvec[1]  = xy - wz;
	retvec[2]  = xz + wy;
	retvec[3]  = 0;
	retvec[4]  = xy + wz;
	retvec[5]  = 1 - (xx + zz);
	retvec[6]  = yz - wx;
	retvec[7]  = 0;
	retvec[8]  = xz - wy;
	retvec[9]  = yz + wx;
	retvec[10] = 1 - (xx + yy);
	retvec[11] = 0;
	retvec[12] = 0;
	retvec[13] = 0;
	retvec[14] = 0;
	retvec[15] = 1;
	return retvec;
}

mat.Vector4.slerp = function(qtn1, qtn2, time, retvec){
	var ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
	var hs = 1.0 - ht * ht;
	if(hs <= 0.0){
		retvec[0] = qtn1[0];
		retvec[1] = qtn1[1];
		retvec[2] = qtn1[2];
		retvec[3] = qtn1[3];
	}else{
		hs = Math.sqrt(hs);
		if(Math.abs(hs) < 0.0001){
			retvec[0] = (qtn1[0] * 0.5 + qtn2[0] * 0.5);
			retvec[1] = (qtn1[1] * 0.5 + qtn2[1] * 0.5);
			retvec[2] = (qtn1[2] * 0.5 + qtn2[2] * 0.5);
			retvec[3] = (qtn1[3] * 0.5 + qtn2[3] * 0.5);
		}else{
			var ph = Math.acos(ht);
			var pt = ph * time;
			var t0 = Math.sin(ph - pt) / hs;
			var t1 = Math.sin(pt) / hs;
			retvec[0] = qtn1[0] * t0 + qtn2[0] * t1;
			retvec[1] = qtn1[1] * t0 + qtn2[1] * t1;
			retvec[2] = qtn1[2] * t0 + qtn2[2] * t1;
			retvec[3] = qtn1[3] * t0 + qtn2[3] * t1;
		}
	}
	return retvec;
}

function torus(row, column, irad, orad, color){
	var pos = new Array(), nor = new Array(),
	    col = new Array(), st  = new Array(), idx = new Array();
	for(var i = 0; i <= row; i++){
		var r = Math.PI * 2 / row * i;
		var rr = Math.cos(r);
		var ry = Math.sin(r);
		for(var ii = 0; ii <= column; ii++){
			var tr = Math.PI * 2 / column * ii;
			var tx = (rr * irad + orad) * Math.cos(tr);
			var ty = ry * irad;
			var tz = (rr * irad + orad) * Math.sin(tr);
			var rx = rr * Math.cos(tr);
			var rz = rr * Math.sin(tr);
			if(color){
				var tc = color;
			}else{
				tc = hsva(360 / column * ii, 1, 1, 1);
			}
			var rs = 1 / column * ii;
			var rt = 1 / row * i + 0.5;
			if(rt > 1.0){rt -= 1.0;}
			rt = 1.0 - rt;
			pos.push(tx, ty, tz);
			nor.push(rx, ry, rz);
			col.push(tc[0], tc[1], tc[2], tc[3]);
			st.push(rs, rt);
		}
	}
	for(i = 0; i < row; i++){
		for(ii = 0; ii < column; ii++){
			r = (column + 1) * i + ii;
			idx.push(r, r + column + 1, r + 1);
			idx.push(r + column + 1, r + column + 2, r + 1);
		}
	}
	return {p : pos, n : nor, c : col, t : st, i : idx};
}

function createRgbaformhsva(h, s, v, a){
	if(s > 1 || v > 1 || a > 1){return;}
	let th = h % 360;
	let i = Math.floor(th / 60);
	let f = th / 60 - i;
	let m = v * (1 - s);
	let n = v * (1 - s * f);
	let k = v * (1 - s * (1 - f));
	let color = [];
	if(!s > 0 && !s < 0){
		color.push(v, v, v, a); 
	} else {
		let r = [v, n, m, m, k, v];
		let g = [k, v, v, n, m, m];
		let b = [m, m, k, v, v, n];
		color.push(r[i], g[i], b[i], a);
	}
	return color;
}
