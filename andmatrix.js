/* andmatの実体化 */
var andmat = andmat || {};

/* 4x4行列 * 4x4行列 */
andmat.multiplyMM = function(retm, lhs, rhs) {
	retm[0*4+0] = lhs[0*4+0] * rhs[0*4+0] + lhs[0*4+1] * rhs[1*4+0] + lhs[0*4+2] * rhs[2*4+0] + lhs[0*4+3] * rhs[3*4+0];
	retm[0*4+1] = lhs[0*4+0] * rhs[0*4+1] + lhs[0*4+1] * rhs[1*4+1] + lhs[0*4+2] * rhs[2*4+1] + lhs[0*4+3] * rhs[3*4+1];
	retm[0*4+2] = lhs[0*4+0] * rhs[0*4+2] + lhs[0*4+1] * rhs[1*4+2] + lhs[0*4+2] * rhs[2*4+2] + lhs[0*4+3] * rhs[3*4+2];
	retm[0*4+3] = lhs[0*4+0] * rhs[0*4+3] + lhs[0*4+1] * rhs[1*4+3] + lhs[0*4+2] * rhs[2*4+3] + lhs[0*4+3] * rhs[3*4+3];

	retm[1*4+0] = lhs[1*4+0] * rhs[0*4+0] + lhs[1*4+1] * rhs[1*4+0] + lhs[1*4+2] * rhs[2*4+0] + lhs[1*4+3] * rhs[3*4+0];
	retm[1*4+1] = lhs[1*4+0] * rhs[0*4+1] + lhs[1*4+1] * rhs[1*4+1] + lhs[1*4+2] * rhs[2*4+1] + lhs[1*4+3] * rhs[3*4+1];
	retm[1*4+2] = lhs[1*4+0] * rhs[0*4+2] + lhs[1*4+1] * rhs[1*4+2] + lhs[1*4+2] * rhs[2*4+2] + lhs[1*4+3] * rhs[3*4+2];
	retm[1*4+3] = lhs[1*4+0] * rhs[0*4+3] + lhs[1*4+1] * rhs[1*4+3] + lhs[1*4+2] * rhs[2*4+3] + lhs[1*4+3] * rhs[3*4+3];

	retm[2*4+0] = lhs[2*4+0] * rhs[0*4+0] + lhs[2*4+1] * rhs[1*4+0] + lhs[2*4+2] * rhs[2*4+0] + lhs[2*4+3] * rhs[3*4+0];
	retm[2*4+1] = lhs[2*4+0] * rhs[0*4+1] + lhs[2*4+1] * rhs[1*4+1] + lhs[2*4+2] * rhs[2*4+1] + lhs[2*4+3] * rhs[3*4+1];
	retm[2*4+2] = lhs[2*4+0] * rhs[0*4+2] + lhs[2*4+1] * rhs[1*4+2] + lhs[2*4+2] * rhs[2*4+2] + lhs[2*4+3] * rhs[3*4+2];
	retm[2*4+3] = lhs[2*4+0] * rhs[0*4+3] + lhs[2*4+1] * rhs[1*4+3] + lhs[2*4+2] * rhs[2*4+3] + lhs[2*4+3] * rhs[3*4+3];

	retm[3*4+0] = lhs[3*4+0] * rhs[0*4+0] + lhs[3*4+1] * rhs[1*4+0] + lhs[3*4+2] * rhs[2*4+0] + lhs[3*4+3] * rhs[3*4+0];
	retm[3*4+1] = lhs[3*4+0] * rhs[0*4+1] + lhs[3*4+1] * rhs[1*4+1] + lhs[3*4+2] * rhs[2*4+1] + lhs[3*4+3] * rhs[3*4+1];
	retm[3*4+2] = lhs[3*4+0] * rhs[0*4+2] + lhs[3*4+1] * rhs[1*4+2] + lhs[3*4+2] * rhs[2*4+2] + lhs[3*4+3] * rhs[3*4+2];
	retm[3*4+3] = lhs[3*4+0] * rhs[0*4+3] + lhs[3*4+1] * rhs[1*4+3] + lhs[3*4+2] * rhs[2*4+3] + lhs[3*4+3] * rhs[3*4+3];
	return;
}

/* 4x4行列 * 4Vector */
andmat.multiplyMV = function(retvec, lmat, rvec) {
	retvec[0] = rvec[0] * lmat[0*4+0] + rvec[1] * lmat[1*4+0] + rvec[2] * lmat[2*4+0] + rvec[3] * lmat[3*4+0];
	retvec[1] = rvec[0] * lmat[0*4+1] + rvec[1] * lmat[1*4+1] + rvec[2] * lmat[2*4+1] + rvec[3] * lmat[3*4+1];
	retvec[2] = rvec[0] * lmat[0*4+2] + rvec[1] * lmat[1*4+2] + rvec[2] * lmat[2*4+2] + rvec[3] * lmat[3*4+2];
	retvec[3] = rvec[0] * lmat[0*4+3] + rvec[1] * lmat[1*4+3] + rvec[2] * lmat[2*4+3] + rvec[3] * lmat[3*4+3];
	return;                             
}

/* 転置行列を求める */
andmat.transposeM = function(retmat, mat) {
	retmat[0+ 0] = mat[0*4 + 0];
	retmat[0+ 4] = mat[0*4 + 1];
	retmat[0+ 8] = mat[0*4 + 2];
	retmat[0+12] = mat[0*4 + 3];

	retmat[1+ 0] = mat[1*4 + 0];
	retmat[1+ 4] = mat[1*4 + 1];
	retmat[1+ 8] = mat[1*4 + 2];
	retmat[1+12] = mat[1*4 + 3];

	retmat[2+ 0] = mat[2*4 + 0];
	retmat[2+ 4] = mat[2*4 + 1];
	retmat[2+ 8] = mat[2*4 + 2];
	retmat[2+12] = mat[2*4 + 3];

	retmat[3+ 0] = mat[3*4 + 0];
	retmat[3+ 4] = mat[3*4 + 1];
	retmat[3+ 8] = mat[3*4 + 2];
	retmat[3+12] = mat[3*4 + 3];
	return;
}

/* 逆行列を求める(戻り値 true:成功/false:逆行列が存在しない) */
andmat.invertM = function(retmat, mat) {
	/* Invert a 4 x 4 matrix using Cramer's Rule */
	let src0  = mat[ 0];
	let src4  = mat[ 1];
	let src8  = mat[ 2];
	let src12 = mat[ 3];
	let src1  = mat[ 4];
	let src5  = mat[ 5];
	let src9  = mat[ 6];
	let src13 = mat[ 7];
	let src2  = mat[ 8];
	let src6  = mat[ 9];
	let src10 = mat[10];
	let src14 = mat[11];
	let src3  = mat[12];
	let src7  = mat[13];
	let src11 = mat[14];
	let src15 = mat[15];
	/* calculate pairs for first 8 elements (cofactors) */
	let atmp0  = src10 * src15;
	let atmp1  = src11 * src14;
	let atmp2  = src9  * src15;
	let atmp3  = src11 * src13;
	let atmp4  = src9  * src14;
	let atmp5  = src10 * src13;
	let atmp6  = src8  * src15;
	let atmp7  = src11 * src12;
	let atmp8  = src8  * src14;
	let atmp9  = src10 * src12;
	let atmp10 = src8  * src13;
	let atmp11 = src9  * src12;
	/* calculate first 8 elements (cofactors) */
	let dst0  = (atmp0 * src5 + atmp3 * src6 + atmp4  * src7)
              - (atmp1 * src5 + atmp2 * src6 + atmp5  * src7);
	let dst1  = (atmp1 * src4 + atmp6 * src6 + atmp9  * src7)
              - (atmp0 * src4 + atmp7 * src6 + atmp8  * src7);
	let dst2  = (atmp2 * src4 + atmp7 * src5 + atmp10 * src7)
              - (atmp3 * src4 + atmp6 * src5 + atmp11 * src7);
	let dst3  = (atmp5 * src4 + atmp8 * src5 + atmp11 * src6)
              - (atmp4 * src4 + atmp9 * src5 + atmp10 * src6);
	let dst4  = (atmp1 * src1 + atmp2 * src2 + atmp5  * src3)
              - (atmp0 * src1 + atmp3 * src2 + atmp4  * src3);
	let dst5  = (atmp0 * src0 + atmp7 * src2 + atmp8  * src3)
              - (atmp1 * src0 + atmp6 * src2 + atmp9  * src3);
	let dst6  = (atmp3 * src0 + atmp6 * src1 + atmp11 * src3)
              - (atmp2 * src0 + atmp7 * src1 + atmp10 * src3);
	let dst7  = (atmp4 * src0 + atmp9 * src1 + atmp10 * src2)
              - (atmp5 * src0 + atmp8 * src1 + atmp11 * src2);
	/* calculate pairs for second 8 elements (cofactors) */
	let btmp0  = src2 * src7;
	let btmp1  = src3 * src6;
	let btmp2  = src1 * src7;
	let btmp3  = src3 * src5;
	let btmp4  = src1 * src6;
	let btmp5  = src2 * src5;
	let btmp6  = src0 * src7;
	let btmp7  = src3 * src4;
	let btmp8  = src0 * src6;
	let btmp9  = src2 * src4;
	let btmp10 = src0 * src5;
	let btmp11 = src1 * src4;
	/* calculate second 8 elements (cofactors) */
	let dst8  = (btmp0  * src13 + btmp3  * src14 + btmp4  * src15)
              - (btmp1  * src13 + btmp2  * src14 + btmp5  * src15);
	let dst9  = (btmp1  * src12 + btmp6  * src14 + btmp9  * src15)
              - (btmp0  * src12 + btmp7  * src14 + btmp8  * src15);
	let dst10 = (btmp2  * src12 + btmp7  * src13 + btmp10 * src15)
              - (btmp3  * src12 + btmp6  * src13 + btmp11 * src15);
	let dst11 = (btmp5  * src12 + btmp8  * src13 + btmp11 * src14)
              - (btmp4  * src12 + btmp9  * src13 + btmp10 * src14);
	let dst12 = (btmp2  * src10 + btmp5  * src11 + btmp1  * src9 )
              - (btmp4  * src11 + btmp0  * src9  + btmp3  * src10);
	let dst13 = (btmp8  * src11 + btmp0  * src8  + btmp7  * src10)
              - (btmp6  * src10 + btmp9  * src11 + btmp1  * src8 );
	let dst14 = (btmp6  * src9  + btmp11 * src11 + btmp3  * src8 )
              - (btmp10 * src11 + btmp2  * src8  + btmp7  * src9 );
	let dst15 = (btmp10 * src10 + btmp4  * src8  + btmp9  * src9 )
              - (btmp8  * src9  + btmp11 * src10 + btmp5  * src8 );
	/* calculate determinant */
	let det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;
	if (Math.abs(det-0.0) < Number.EPSILON) {
	    return false;
	}
	/* calculate matrix inverse */
	let invdet = 1.0 / det;
	retmat[ 0] = dst0  * invdet;
	retmat[ 1] = dst1  * invdet;
	retmat[ 2] = dst2  * invdet;
	retmat[ 3] = dst3  * invdet;
	retmat[ 4] = dst4  * invdet;
	retmat[ 5] = dst5  * invdet;
	retmat[ 6] = dst6  * invdet;
	retmat[ 7] = dst7  * invdet;
	retmat[ 8] = dst8  * invdet;
	retmat[ 9] = dst9  * invdet;
	retmat[10] = dst10 * invdet;
	retmat[11] = dst11 * invdet;
	retmat[12] = dst12 * invdet;
	retmat[13] = dst13 * invdet;
	retmat[14] = dst14 * invdet;
	retmat[15] = dst15 * invdet;
	return true;
}

/* 正射影行列生成 */
andmat.orthoM = function(retm, left, right, bottom, top, near, far) {
    if(left  == right) throw new Error("IllegalArgument!! left == right");
    if(bottom== top  ) throw new Error("IllegalArgument!! bottom == top");
    if(near  == far  ) throw new Error("IllegalArgument!! near == far");

    let r_width  = 1.0 / (right - left);
    let r_height = 1.0 / (top - bottom);
    let r_depth  = 1.0 / (far - near);
    let x =  2.0 * (r_width);
    let y =  2.0 * (r_height);
    let z = -2.0 * (r_depth);
    let tx = -(right + left) * r_width;
    let ty = -(top + bottom) * r_height;
    let tz = -(far + near) * r_depth;
    retm[ 0] = x;
    retm[ 5] = y;
    retm[10] = z;
    retm[12] = tx;
    retm[13] = ty;
    retm[14] = tz;
    retm[15] = 1.0;
    retm[ 1] = 0.0;
    retm[ 2] = 0.0;
    retm[ 3] = 0.0;
    retm[ 4] = 0.0;
    retm[ 6] = 0.0;
    retm[ 7] = 0.0;
    retm[ 8] = 0.0;
    retm[ 9] = 0.0;
    retm[11] = 0.0;
	return;
}

/* 視錐台形式で射影行列生成 */
andmat.frustumM = function(retm, left, right, bottom, top, near, far) {
	if(left  == right) throw new Error("IllegalArgument!! left == right");
	if(bottom== top  ) throw new Error("IllegalArgument!! bottom == top");
	if(near  == far  ) throw new Error("IllegalArgument!! near == far");
	if(near  <= 0.0  ) throw new Error("IllegalArgument!! near <= 0.0f");
	if(far   <= 0.0  ) throw new Error("IllegalArgument!! far <= 0.0f");

	let r_width  = 1.0 / (right - left);
	let r_height = 1.0 / (top - bottom);
	let r_depth  = 1.0 / (near - far);
	let x = 2.0 * (near * r_width);
	let y = 2.0 * (near * r_height);
	let A = (right + left) * r_width;
	let B = (top + bottom) * r_height;
	let C = (far + near) * r_depth;
	let D = 2.0 * (far * near * r_depth);
	retm[ 0] = x;
	retm[ 5] = y;
	retm[ 8] = A;
	retm[ 9] = B;
	retm[10] = C;
	retm[14] = D;
	retm[11] = -1.0;
	retm[ 1] = 0.0;
	retm[ 2] = 0.0;
	retm[ 3] = 0.0;
	retm[ 4] = 0.0;
	retm[ 6] = 0.0;
	retm[ 7] = 0.0;
	retm[12] = 0.0;
	retm[13] = 0.0;
	retm[15] = 0.0;
	return;
}

/* 視点形式で射影行列生成 */
andmat.perspectiveM = function(retm, fovy, aspect, zNear, zFar) {
	let f = 1.0 / Math.tan(fovy * (Math.PI / 360.0));
	let rangeReciprocal = 1.0 / (zNear - zFar);
	retm[ 0] = f / aspect;
	retm[ 1] = 0.0;
	retm[ 2] = 0.0;
	retm[ 3] = 0.0;
	retm[ 4] = 0.0;
	retm[ 5] = f;
	retm[ 6] = 0.0;
	retm[ 7] = 0.0;
	retm[ 8] = 0.0;
	retm[ 9] = 0.0;
	retm[10] = (zFar + zNear) * rangeReciprocal;
	retm[11] = -1.0;
	retm[12] = 0.0;
	retm[13] = 0.0;
	retm[14] = 2.0 * zFar * zNear * rangeReciprocal;
	retm[15] = 0.0;
	return;
}

/* 大きさ算出 */
andmat.length = function(x, y, z) {
	return Math.sqrt(x * x + y * y + z * z);
}

/* 単位行列にセット */
andmat.setIdentityM = function(retm) {
	retm[ 0] = 1; retm[ 1] = 0; retm[ 2] = 0; retm[ 3] = 0;
	retm[ 4] = 0; retm[ 5] = 1; retm[ 6] = 0; retm[ 7] = 0;
	retm[ 8] = 0; retm[ 9] = 0; retm[10] = 1; retm[11] = 0;
	retm[12] = 0; retm[13] = 0; retm[14] = 0; retm[15] = 1;
	return;
}

/* 拡縮行列 生成 */
andmat.scaleM = function(retm, mat, x, y, z) {
	if(z === undefined) {
		let lx = mat;
		let ly = x;
		let lz = y;

		retm[     0] *= lx;
		retm[ 4 + 0] *= ly;
		retm[ 8 + 0] *= lz;

		retm[     1] *= lx;
		retm[ 4 + 1] *= ly;
		retm[ 8 + 1] *= lz;

		retm[     2] *= lx;
		retm[ 4 + 2] *= ly;
		retm[ 8 + 2] *= lz;

		retm[     3] *= lx;
		retm[ 4 + 3] *= ly;
		retm[ 8 + 3] *= lz;
	}
	else {
		retm[     0] = mat[     0] * x;
		retm[ 4 + 0] = mat[ 4 + 0] * y;
		retm[ 8 + 0] = mat[ 8 + 0] * z;
		retm[12 + 0] = mat[12 + 0];

		retm[     1] = mat[     1] * x;
		retm[ 4 + 1] = mat[ 4 + 1] * y;
		retm[ 8 + 1] = mat[ 8 + 1] * z;
		retm[12 + 1] = mat[12 + 1];

		retm[     2] = mat[     2] * x;
		retm[ 4 + 2] = mat[ 4 + 2] * y;
		retm[ 8 + 2] = mat[ 8 + 2] * z;
		retm[12 + 2] = mat[12 + 2];

		retm[     3] = mat[     3] * x;
		retm[ 4 + 3] = mat[ 4 + 3] * y;
		retm[ 8 + 3] = mat[ 8 + 3] * z;
		retm[12 + 3] = mat[12 + 3];
	}
	return;
}

/* 移動行列 生成 */
andmat.translateM = function(retm, mat, x, y, z) {
	if(z === undefined) {
		let lx = mat;
		let ly = x;
		let lz = y;
		for (let i=0 ; i<4 ; i++) {
			retm[12 + i] += retm[i] * lx + retm[4 + i] * ly + retm[8 + i] * lz;
		}
	}
	else {
		for (let i=0 ; i<12 ; i++) {
		   retm[i] = mat[i];
		}
		for (let i=0 ; i<4 ; i++) {
		   retm[12 + i] = mat[i] * x + mat[4 + i] * y + mat[8 + i] * z + mat[12 + i];
		}
	}
	return;
}

/* 回転行列 生成 */
andmat.rotateM = function(retm, mat, angle, x, y, z) {
	if(z === undefined) {
		let langle = mat;
		let lx = angle;
		let ly = x;
		let lz = y;
		let sTemp1 = new Float32Array(16);
		andmat.setRotateM(sTemp1, langle, lx, ly, lz);
		let sTemp2 = new Float32Array(16);
		andmat.multiplyMM(sTemp2, retm, sTemp1);
		retm = sTemp2;
	}
	else {
		let sTemp = new Float32Array(16);
		andmat.setRotateM(sTemp, angle, x, y, z);
		andmat.multiplyMM(retm, mat, sTemp);
	}
	return;
}

/* 回転行列 設定 */
andmat.setRotateM = function(retm, angle, x, y, z) {
	retm[ 3]= 0;
	retm[ 7]= 0;
	retm[11]= 0;
	retm[12]= 0;
	retm[13]= 0;
	retm[14]= 0;
	retm[15]= 1;
	angle *= (Math.PI / 180.0);
	let s = Math.sin(angle);
	let c = Math.cos(angle);

	if ((Math.abs(1.0-x) < Number.EPSILON) && (Math.abs(0.0-y) < Number.EPSILON) && (Math.abs(0.0-z) < Number.EPSILON)) {
		retm[5] = c;   retm[10]= c;
		retm[6] = s;   retm[ 9] = -s;
		retm[1] = 0;   retm[ 2] = 0;
		retm[4] = 0;   retm[ 8] = 0;
		retm[0] = 1;
	}
	else if ((Math.abs(0.0-x) < Number.EPSILON) && (Math.abs(1.0-y) < Number.EPSILON) && (Math.abs(0.0-z) < Number.EPSILON)) {
		retm[0] = c;   retm[10]= c;
		retm[8] = s;   retm[2] = -s;
		retm[1] = 0;   retm[4] = 0;
		retm[6] = 0;   retm[9] = 0;
		retm[5] = 1;
	}
	else if ((Math.abs(0.0-x) < Number.EPSILON) && (Math.abs(0.0-y) < Number.EPSILON) && (Math.abs(1.0-z) < Number.EPSILON)) {
		retm[ 0] = c;   retm[5] = c;
		retm[ 1] = s;   retm[4] = -s;
		retm[ 2] = 0;   retm[6] = 0;
		retm[ 8] = 0;   retm[9] = 0;
		retm[10]= 1;
	}
	else {
		let len = andmat.length(x, y, z);
		if (1.0 != len) {
			let recipLen = 1.0 / len;
			x *= recipLen;
			y *= recipLen;
			z *= recipLen;
		}
		let nc = 1.0 - c;
		let xy = x * y;
		let yz = y * z;
		let zx = z * x;
		let xs = x * s;
		let ys = y * s;
		let zs = z * s;
		retm[ 0] = x*x*nc +  c;
		retm[ 4] =  xy*nc - zs;
		retm[ 8] =  zx*nc + ys;
		retm[ 1] =  xy*nc + zs;
		retm[ 5] = y*y*nc +  c;
		retm[ 9] =  yz*nc - xs;
		retm[ 2] =  zx*nc - ys;
		retm[ 6] =  yz*nc + xs;
		retm[10] = z*z*nc +  c;
	}
	return;
}

/* オイラー角から、回転行列 設定 */
andmat.setRotateEulerM = function(retm, x, y, z) {
	x *= (Math.PI / 180.0);
	y *= (Math.PI / 180.0);
	z *= (Math.PI / 180.0);
	let cx  = Math.cos(x);
	let sx  = Math.sin(x);
	let cy  = Math.cos(y);
	let sy  = Math.sin(y);
	let cz  = Math.cos(z);
	let sz  = Math.sin(z);
	let cxsy= cx * sy;
	let sxsy= sx * sy;
	retm[ 0] =   cy * cz;
	retm[ 1] =  -cy * sz;
	retm[ 2] =   sy;
	retm[ 3] =  0.0;
	retm[ 4] =  cxsy * cz + cx * sz;
	retm[ 5] = -cxsy * sz + cx * cz;
	retm[ 6] =  -sx * cy;
	retm[ 7] =  0.0;
	retm[ 8] = -sxsy * cz + sx * sz;
	retm[ 9] =  sxsy * sz + sx * cz;
	retm[10] =  cx * cy;
	retm[11] =  0.0;
	retm[12] =  0.0;
	retm[13] =  0.0;
	retm[14] =  0.0;
	retm[15] =  1.0;
	return;
}

/* 視点,ビュー中心,上位置から射影行列を生成 */
andmat.setLookAtM = function(retm,  eyeX,  eyeY,  eyeZ,  centerX,  centerY,  centerZ,  upX,  upY,  upZ) {
	// See the OpenGL GLUT documentation for gluLookAt for a description
	// of the algorithm. We implement it in a straightforward way:
	let fx = centerX - eyeX;
	let fy = centerY - eyeY;
	let fz = centerZ - eyeZ;
	// Normalize f
	let rlf = 1.0 / andmat.length(fx, fy, fz);
	fx *= rlf;
	fy *= rlf;
	fz *= rlf;
	// compute s = f x up (x means "cross product")
	let sx = fy * upZ - fz * upY;
	let sy = fz * upX - fx * upZ;
	let sz = fx * upY - fy * upX;
	// and normalize s
	let rls = 1.0 / andmat.length(sx, sy, sz);
	sx *= rls;
	sy *= rls;
	sz *= rls;
	// compute u = s x f
	let ux = sy * fz - sz * fy;
	let uy = sz * fx - sx * fz;
	let uz = sx * fy - sy * fx;
	retm[ 0] = sx;
	retm[ 1] = ux;
	retm[ 2] = -fx;
	retm[ 3] = 0.0;
	retm[ 4] = sy;
	retm[ 5] = uy;
	retm[ 6] = -fy;
	retm[ 7] = 0.0;
	retm[ 8] = sz;
	retm[ 9] = uz;
	retm[10] = -fz;
	retm[11] = 0.0;
	retm[12] = 0.0;
	retm[13] = 0.0;
	retm[14] = 0.0;
	retm[15] = 1.0;
	andmat.translateM(retm, -eyeX, -eyeY, -eyeZ);
	return;
}
