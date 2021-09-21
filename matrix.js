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
	let power = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	if(!power){return null;}
	let xx = axis[0], yy = axis[1], zz = axis[2];
	if(power != 1){power = 1 / power; xx *= power; yy *= power; zz *= power;}
	let sa = Math.sin(angle), ca = Math.cos(angle), f = 1 - ca,
		g = mat[0],  h = mat[1], i = mat[2],  j = mat[3],
		k = mat[4],  l = mat[5], m = mat[6],  n = mat[7],
		o = mat[8],  p = mat[9], q = mat[10], r = mat[11],
		s = xx * xx * f + ca,
		t = yy * xx * f + zz * sa,
		u = zz * xx * f - yy * sa,
		v = xx * yy * f - zz * sa,
		w = yy * yy * f + ca,
		x = zz * yy * f + xx * sa,
		y = xx * zz * f + yy * sa,
		z = yy * zz * f - xx * sa,
		A = zz * zz * f + ca;
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

/* 視点,ビュー中心,上位置から射影行列を生成 */
mat.Matrix44.lookAt = function(eye, center, up, retm){
	let eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
		upX     = up[0],     upY     = up[1],     upZ     = up[2],
		centerX = center[0], centerY = center[1], centerZ = center[2];
	if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.loadIdentity(retm);}

	let fx = eyeX - centerX;
	let fy = eyeY - centerY;
	let fz = eyeZ - centerZ;
	// Normalize f
	let rlf = 1.0 / Math.sqrt(fx * fx + fy * fy + fz * fz);
	fx *= rlf;
	fy *= rlf;
	fz *= rlf;
	// compute s = f x up (x means "cross product")
	let sx = upY * fz - upZ * fy;
	let sy = upZ * fx - upX * fz;
	let sz = upX * fy - upY * fx;
	// and normalize s
	let rls = Math.sqrt(sx * sx + sy * sy + sz * sz);
	if(!rls){
		sx = 0;
		sy = 0;
		sz = 0;
	} else {
		rls = 1 / rls;
		sx *= rls;
		sy *= rls;
		sz *= rls;
	}
	// compute u = s x f
	let ux = fy * sz - fz * sy;
	let uy = fz * sx - fx * sz;
	let uz = fx * sy - fy * sx;
	// and normalize u
	let rlu = Math.sqrt(ux * ux + uy * uy + uz * uz);
	if(!rlu){
		ux = 0;
		uy = 0;
		uz = 0;
	} else {
		rlu = 1 / rlu;
		ux *= rlu;
		uy *= rlu;
		uz *= rlu;
	}
	retm[ 0] = sx;
	retm[ 1] = ux;
	retm[ 2] = fx;
	retm[ 3] = 0.0;
	retm[ 4] = sy;
	retm[ 5] = uy;
	retm[ 6] = fy;
	retm[ 7] = 0.0;
	retm[ 8] = sz;
	retm[ 9] = uz;
	retm[10] = fz;
	retm[11] = 0.0;
	retm[12] = -(sx * eyeX + sy * eyeY + sz * eyeZ);
	retm[13] = -(ux * eyeX + uy * eyeY + uz * eyeZ);
	retm[14] = -(fx * eyeX + fy * eyeY + fz * eyeZ);
	retm[15] = 1.0;
	return retm;
}

/* 視点形式で射影行列生成 */
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

/* 正射影行列生成 */
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

/* 転置行列を求める */
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

/* 逆行列を求める(戻り値 true:成功/false:逆行列が存在しない) */
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
	return [0,0,0,0,];
}

mat.Vector4.LoadIdentity = function(retvec){
	retvec[0] = 0; retvec[1] = 0; retvec[2] = 0; retvec[3] = 1;
	return retvec;
}

mat.Vector4.inverse = function(vec, retvec){
	retvec[0] = -vec[0];
	retvec[1] = -vec[1];
	retvec[2] = -vec[2];
	retvec[3] =  vec[3];
	return retvec;
}

mat.Vector4.normalize = function(retvec){
	let x = retvec[0], y = retvec[1], z = retvec[2], w = retvec[3];
	let power = Math.sqrt(x * x + y * y + z * z + w * w);
	if(power === 0){
		retvec[0] = 0;
		retvec[1] = 0;
		retvec[2] = 0;
		retvec[3] = 0;
	}else{
		power = 1 / power;
		retvec[0] = x * power;
		retvec[1] = y * power;
		retvec[2] = z * power;
		retvec[3] = w * power;
	}
	return retvec;
}

mat.Vector4.multiply = function(lvec, rvec, retvec){
	retvec[0] = lvec[0] * rvec[3] + lvec[3] * rvec[0] + lvec[1] * rvec[2] - lvec[2] * rvec[1];
	retvec[1] = lvec[1] * rvec[3] + lvec[3] * rvec[1] + lvec[2] * rvec[0] - lvec[0] * rvec[2];
	retvec[2] = lvec[2] * rvec[3] + lvec[3] * rvec[2] + lvec[0] * rvec[1] - lvec[1] * rvec[0];
	retvec[3] = lvec[3] * rvec[3] - lvec[0] * rvec[0] - lvec[1] * rvec[1] - lvec[2] * rvec[2];
	return retvec;
}

mat.Vector4.rotate = function(angle, axis, retvec){
	let power = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	if(!power){return null;}
	let x = axis[0], y = axis[1], z = axis[2];
	if(power != 1){power = 1 / power; x *= power; y *= power; z *= power;}
	let s = Math.sin(angle * 0.5);
	retvec[0] = x * s;
	retvec[1] = y * s;
	retvec[2] = z * s;
	retvec[3] = Math.cos(angle * 0.5);
	return retvec;
}

mat.Vector4.toVec3 = function(lvec, rvec, retvec){
	let qp = this.create();
	let qq = this.create();
	let qr = this.create();
	mat.Vector4.inverse(rvec, qr);
	qp[0] = lvec[0];
	qp[1] = lvec[1];
	qp[2] = lvec[2];
	mat.Vector4.multiply(qr, qp, qq);
	mat.Vector4.multiply(qq, rvec, qr);
	retvec[0] = qr[0];
	retvec[1] = qr[1];
	retvec[2] = qr[2];
	return retvec;
}

mat.Vector4.toMatrix44 = function(lvec, retvec){
	let x = lvec[0], y = lvec[1], z = lvec[2], w = lvec[3];
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
