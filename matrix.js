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

mat.Matrix44.loadIdentity = function(retm){
	retm[ 0] = 1; retm[ 1] = 0; retm[ 2] = 0; retm[ 3] = 0;
	retm[ 4] = 0; retm[ 5] = 1; retm[ 6] = 0; retm[ 7] = 0;
	retm[ 8] = 0; retm[ 9] = 0; retm[10] = 1; retm[11] = 0;
	retm[12] = 0; retm[13] = 0; retm[14] = 0; retm[15] = 1;
	return retm;
}

/* クォータニオン同士の掛け算 */
mat.Matrix44.multiply = function(lhs, rhs, retm){
	retm[ 0] = rhs[ 0] * lhs[0] + rhs[ 1] * lhs[4] + rhs[ 2] * lhs[ 8] + rhs[ 3] * lhs[12];
	retm[ 1] = rhs[ 0] * lhs[1] + rhs[ 1] * lhs[5] + rhs[ 2] * lhs[ 9] + rhs[ 3] * lhs[13];
	retm[ 2] = rhs[ 0] * lhs[2] + rhs[ 1] * lhs[6] + rhs[ 2] * lhs[10] + rhs[ 3] * lhs[14];
	retm[ 3] = rhs[ 0] * lhs[3] + rhs[ 1] * lhs[7] + rhs[ 2] * lhs[11] + rhs[ 3] * lhs[15];

	retm[ 4] = rhs[ 4] * lhs[0] + rhs[ 5] * lhs[4] + rhs[ 6] * lhs[ 8] + rhs[ 7] * lhs[12];
	retm[ 5] = rhs[ 4] * lhs[1] + rhs[ 5] * lhs[5] + rhs[ 6] * lhs[ 9] + rhs[ 7] * lhs[13];
	retm[ 6] = rhs[ 4] * lhs[2] + rhs[ 5] * lhs[6] + rhs[ 6] * lhs[10] + rhs[ 7] * lhs[14];
	retm[ 7] = rhs[ 4] * lhs[3] + rhs[ 5] * lhs[7] + rhs[ 6] * lhs[11] + rhs[ 7] * lhs[15];

	retm[ 8] = rhs[ 8] * lhs[0] + rhs[ 9] * lhs[4] + rhs[10] * lhs[ 8] + rhs[11] * lhs[12];
	retm[ 9] = rhs[ 8] * lhs[1] + rhs[ 9] * lhs[5] + rhs[10] * lhs[ 9] + rhs[11] * lhs[13];
	retm[10] = rhs[ 8] * lhs[2] + rhs[ 9] * lhs[6] + rhs[10] * lhs[10] + rhs[11] * lhs[14];
	retm[11] = rhs[ 8] * lhs[3] + rhs[ 9] * lhs[7] + rhs[10] * lhs[11] + rhs[11] * lhs[15];

	retm[12] = rhs[12] * lhs[0] + rhs[13] * lhs[4] + rhs[14] * lhs[ 8] + rhs[15] * lhs[12];
	retm[13] = rhs[12] * lhs[1] + rhs[13] * lhs[5] + rhs[14] * lhs[ 9] + rhs[15] * lhs[13];
	retm[14] = rhs[12] * lhs[2] + rhs[13] * lhs[6] + rhs[14] * lhs[10] + rhs[15] * lhs[14];
	retm[15] = rhs[12] * lhs[3] + rhs[13] * lhs[7] + rhs[14] * lhs[11] + rhs[15] * lhs[15];
	return retm;
}

/* 拡縮行列 生成 */
mat.Matrix44.scale = function(mat, vec, retm){
	retm[ 0] = mat[ 0] * vec[0];
	retm[ 1] = mat[ 1] * vec[0];
	retm[ 2] = mat[ 2] * vec[0];
	retm[ 3] = mat[ 3] * vec[0];

	retm[ 4] = mat[ 4] * vec[1];
	retm[ 5] = mat[ 5] * vec[1];
	retm[ 6] = mat[ 6] * vec[1];
	retm[ 7] = mat[ 7] * vec[1];

	retm[ 8] = mat[ 8] * vec[2];
	retm[ 9] = mat[ 9] * vec[2];
	retm[10] = mat[10] * vec[2];
	retm[11] = mat[11] * vec[2];

	retm[12] = mat[12];
	retm[13] = mat[13];
	retm[14] = mat[14];
	retm[15] = mat[15];
	return retm;
}

/* 移動行列 生成 */
mat.Matrix44.translate = function(mat, vec, retm){
	retm[ 0] = mat[0]; retm[1] = mat[1]; retm[ 2] = mat[ 2]; retm[ 3] = mat[ 3];
	retm[ 4] = mat[4]; retm[5] = mat[5]; retm[ 6] = mat[ 6]; retm[ 7] = mat[ 7];
	retm[ 8] = mat[8]; retm[9] = mat[9]; retm[10] = mat[10]; retm[11] = mat[11];
	retm[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[ 8] * vec[2] + mat[12];
	retm[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[ 9] * vec[2] + mat[13];
	retm[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
	retm[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
	return retm;
}

/* 回転行列 設定 */
mat.Matrix44.rotate = function(mat, angle, axis, retm){
	let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	if(!sq){return null;}
	let a = axis[0], b = axis[1], c = axis[2];
	if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
	let d = Math.sin(angle), e = Math.cos(angle), f = 1 - e,
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
		if(mat != retm){
			retm[12] = mat[12]; retm[13] = mat[13];
			retm[14] = mat[14]; retm[15] = mat[15];
		}
	} else {
		retm = mat;
	}
	retm[0]  = g * s + k * t + o * u;
	retm[1]  = h * s + l * t + p * u;
	retm[2]  = i * s + m * t + q * u;
	retm[3]  = j * s + n * t + r * u;
	retm[4]  = g * v + k * w + o * x;
	retm[5]  = h * v + l * w + p * x;
	retm[6]  = i * v + m * w + q * x;
	retm[7]  = j * v + n * w + r * x;
	retm[8]  = g * y + k * z + o * A;
	retm[9]  = h * y + l * z + p * A;
	retm[10] = i * y + m * z + q * A;
	retm[11] = j * y + n * z + r * A;
	return retm;
}

mat.Matrix44.lookAt = function(eye, center, up, retm){
	let eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
		upX     = up[0],     upY     = up[1],     upZ     = up[2],
		centerX = center[0], centerY = center[1], centerZ = center[2];
	if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.loadIdentity(retm);}
	let x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
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
	retm[0] = x0; retm[1] = y0; retm[2]  = z0; retm[3]  = 0;
	retm[4] = x1; retm[5] = y1; retm[6]  = z1; retm[7]  = 0;
	retm[8] = x2; retm[9] = y2; retm[10] = z2; retm[11] = 0;
	retm[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
	retm[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
	retm[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
	retm[15] = 1;
	return retm;
}

mat.Matrix44.perspective = function(fovy, aspect, near, far, retm){
	let t = near * Math.tan(fovy * Math.PI / 360);
	let r = t * aspect;
	let a = r * 2, b = t * 2, c = far - near;
	retm[0]  = near * 2 / a;
	retm[1]  = 0;
	retm[2]  = 0;
	retm[3]  = 0;
	retm[4]  = 0;
	retm[5]  = near * 2 / b;
	retm[6]  = 0;
	retm[7]  = 0;
	retm[8]  = 0;
	retm[9]  = 0;
	retm[10] = -(far + near) / c;
	retm[11] = -1;
	retm[12] = 0;
	retm[13] = 0;
	retm[14] = -(far * near * 2) / c;
	retm[15] = 0;
	return retm;
}

mat.Matrix44.ortho = function(left, right, top, bottom, near, far, retm) {
	let h = (right - left);
	let v = (top - bottom);
	let d = (far - near);
	retm[0]  = 2 / h;
	retm[1]  = 0;
	retm[2]  = 0;
	retm[3]  = 0;
	retm[4]  = 0;
	retm[5]  = 2 / v;
	retm[6]  = 0;
	retm[7]  = 0;
	retm[8]  = 0;
	retm[9]  = 0;
	retm[10] = -2 / d;
	retm[11] = 0;
	retm[12] = -(left + right) / h;
	retm[13] = -(top + bottom) / v;
	retm[14] = -(far + near) / d;
	retm[15] = 1;
	return retm;
}

mat.Matrix44.transpose = function(mat, retm){
	retm[0]  = mat[0];  retm[1]  = mat[4];
	retm[2]  = mat[8];  retm[3]  = mat[12];
	retm[4]  = mat[1];  retm[5]  = mat[5];
	retm[6]  = mat[9];  retm[7]  = mat[13];
	retm[8]  = mat[2];  retm[9]  = mat[6];
	retm[10] = mat[10]; retm[11] = mat[14];
	retm[12] = mat[3];  retm[13] = mat[7];
	retm[14] = mat[11]; retm[15] = mat[15];
	return retm;
}

mat.Matrix44.inverse = function(mat, retm){
	let a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
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
	retm[0]  = ( f * B - g * A + h * z) * ivd;
	retm[1]  = (-b * B + c * A - d * z) * ivd;
	retm[2]  = ( n * v - o * u + p * t) * ivd;
	retm[3]  = (-j * v + k * u - l * t) * ivd;
	retm[4]  = (-e * B + g * y - h * x) * ivd;
	retm[5]  = ( a * B - c * y + d * x) * ivd;
	retm[6]  = (-m * v + o * s - p * r) * ivd;
	retm[7]  = ( i * v - k * s + l * r) * ivd;
	retm[8]  = ( e * A - f * y + h * w) * ivd;
	retm[9]  = (-a * A + b * y - d * w) * ivd;
	retm[10] = ( m * u - n * s + p * q) * ivd;
	retm[11] = (-i * u + j * s - l * q) * ivd;
	retm[12] = (-e * z + f * x - g * w) * ivd;
	retm[13] = ( a * z - b * x + c * w) * ivd;
	retm[14] = (-m * t + n * r - o * q) * ivd;
	retm[15] = ( i * t - j * r + k * q) * ivd;
	return retm;
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
	let x = retvec[0], y = retvec[1], z = retvec[2], w = retvec[3];
	let l = Math.sqrt(x * x + y * y + z * z + w * w);
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
	let ax = qtn1[0], ay = qtn1[1], az = qtn1[2], aw = qtn1[3];
	let bx = qtn2[0], by = qtn2[1], bz = qtn2[2], bw = qtn2[3];
	retvec[0] = ax * bw + aw * bx + ay * bz - az * by;
	retvec[1] = ay * bw + aw * by + az * bx - ax * bz;
	retvec[2] = az * bw + aw * bz + ax * by - ay * bx;
	retvec[3] = aw * bw - ax * bx - ay * by - az * bz;
	return retvec;
}

mat.Vector4.rotate = function(angle, axis, retvec){
	let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	if(!sq){return null;}
	let a = axis[0], b = axis[1], c = axis[2];
	if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
	let s = Math.sin(angle * 0.5);
	retvec[0] = a * s;
	retvec[1] = b * s;
	retvec[2] = c * s;
	retvec[3] = Math.cos(angle * 0.5);
	return retvec;
}

mat.Vector4.toVecIII = function(vec, qtn, retvec){
	let qp = this.create();
	let qq = this.create();
	let qr = this.create();
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
	let x = qtn[0], y = qtn[1], z = qtn[2], w = qtn[3];
	let x2 = x + x, y2 = y + y, z2 = z + z;
	let xx = x * x2, xy = x * y2, xz = x * z2;
	let yy = y * y2, yz = y * z2, zz = z * z2;
	let wx = w * x2, wy = w * y2, wz = w * z2;
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
	let ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
	let hs = 1.0 - ht * ht;
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
			let ph = Math.acos(ht);
			let pt = ph * time;
			let t0 = Math.sin(ph - pt) / hs;
			let t1 = Math.sin(pt) / hs;
			retvec[0] = qtn1[0] * t0 + qtn2[0] * t1;
			retvec[1] = qtn1[1] * t0 + qtn2[1] * t1;
			retvec[2] = qtn1[2] * t0 + qtn2[2] * t1;
			retvec[3] = qtn1[3] * t0 + qtn2[3] * t1;
		}
	}
	return retvec;
}

function torus(row, column, irad, orad, color){
	let pos = new Array(), nor = new Array(),
	    col = new Array(), st  = new Array(), idx = new Array();
	for(let i = 0; i <= row; i++){
		let r = Math.PI * 2 / row * i;
		let rr = Math.cos(r);
		let ry = Math.sin(r);
		for(let ii = 0; ii <= column; ii++){
			let tr = Math.PI * 2 / column * ii;
			let tx = (rr * irad + orad) * Math.cos(tr);
			let ty = ry * irad;
			let tz = (rr * irad + orad) * Math.sin(tr);
			let rx = rr * Math.cos(tr);
			let rz = rr * Math.sin(tr);
			if(color){
				let tc = color;
			}else{
				tc = hsva(360 / column * ii, 1, 1, 1);
			}
			let rs = 1 / column * ii;
			let rt = 1 / row * i + 0.5;
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
