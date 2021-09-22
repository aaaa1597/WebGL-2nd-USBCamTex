/* baseが無いときは何も継承しない */
function mixin(base = null) {
	class Mixin extends base { }
	return Mixin;
}

/* Enum pos:頂点 nor:法線 col:色 uv:テクスチャ座標 idx:頂点index  */
const eBufType = { pos: 0, nor: 1, col: 2, uv: 3, idx:4};

class GlModelBase {
	getVboHdl(type) { }
	getAttrHdl(type) { }
	getAttrSize(type) { }
	getIboHdl() { }
	getIboLen() { }
	getModelMatrix() { }
	setModelMatrix() { }
}

/* 板ポリ */
class GLPlaneMolde extends mixin(GlModelBase) {
	constructor(gl, program) {
		super();

		let ModelData = createPlane(3);
		function createPlane(size){
			let vertex = [
				-size*1.28*(1/0.78), -size*0.78*(1/0.78), 0,   size*1.28*(1/0.78), -size*0.78*(1/0.78), 0,   size*1.28*(1/0.78), size*0.78*(1/0.78), 0,  -size*1.28*(1/0.78),  size*0.78*(1/0.78), 0,
			];
			let nor = [
				1.0, 1.0,  1.0,  1.0, 1.0,  1.0,  1.0,  1.0,  1.0, 1.0,  1.0,  1.0,
			];
			let col = [
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
			];

			let uv = [
				0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
			];
			let idx = [
				 0,  1,  2,  0,  2,  3,
			];
			return {p : vertex, n : nor, c : col, t : uv, i : idx};
		}
		this._vPoshdl = createVbo(gl, ModelData.p);
		this._vColHdl = createVbo(gl, ModelData.c);
		this._vUvHdl  = createVbo(gl, ModelData.t);
		this._aPoshdl = gl.getAttribLocation(program, aPosition);
		this._aColHdl = gl.getAttribLocation(program, aColor);
		this._aUvHdl  = gl.getAttribLocation(program, aTexCoord);
		this._iIdxHdl = createIbo(gl, ModelData.i);
		this._iIdxlen = ModelData.i.length;
		this._mMatrix = mat.Matrix44.createIdentity();
	}

	getVboHdl(type) {
		switch (type) {
			case eBufType.pos: return this._vPoshdl;
			case eBufType.nor: return null;
			case eBufType.col: return this._vColHdl;
			case eBufType.uv : return this._vUvHdl;
			case eBufType.idx: return this._iIdxHdl;
			default : return null;
		}
	}
	
	getAttrHdl(type) {
		switch (type) {
			case eBufType.pos: return this._aPoshdl;
			case eBufType.col: return this._aColHdl;
			case eBufType.uv : return this._aUvHdl;
			default : return null;
		}
	}
	
	getAttrSize(type) {
		switch (type) {
			case eBufType.pos: return 3;
			case eBufType.col: return 3;
			case eBufType.uv : return 2;
			default : return null;
		}
	}
	
	getIboHdl() {
		return this._iIdxHdl;
	}
	
	getIboLen() {
		return this._iIdxlen;
	}

	getModelMatrix() {
		return this._mMatrix;
	}

	setModelMatrix(mat) {
		this._mMatrix = mat;
	}
}

/* 立方体 */
class GLCubeMolde extends mixin(GlModelBase) {
	constructor(gl, program) {
		super();

		let ModelData = createCube(2.0, [1.0, 1.0, 1.0, 1.0]);
		function createCube(side, color){
			let hs = side * 0.5;
			let pos = [
				-hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,  hs,
				-hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs, -hs,
				-hs,  hs, -hs, -hs,  hs,  hs,  hs,  hs,  hs,  hs,  hs, -hs,
				-hs, -hs, -hs,  hs, -hs, -hs,  hs, -hs,  hs, -hs, -hs,  hs,
				 hs, -hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,
				-hs, -hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs
			];
			let nor = [
				-1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
				-1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,
				-1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,
				-1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
				 1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,
				-1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
			];
			let col = [], tc  = [];
			for(let i = 0; i < pos.length / 3; i++){
				if(color){
					tc = color;
				}else{
					tc = createRgbaformhsva(360 / pos.length / 3 * i, 1, 1, 1);
				}
				col.push(tc[0], tc[1], tc[2], tc[3]);
			}
			let st = [
				0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
			];
			let idx = [
				 0,  1,  2,  0,  2,  3,
				 4,  5,  6,  4,  6,  7,
				 8,  9, 10,  8, 10, 11,
				12, 13, 14, 12, 14, 15,
				16, 17, 18, 16, 18, 19,
				20, 21, 22, 20, 22, 23
			];
			return {p : pos, n : nor, c : col, t : st, i : idx};
		}
		this._vPoshdl = createVbo(gl, ModelData.p);
		this._vColHdl = createVbo(gl, ModelData.c);
		this._vUvHdl  = createVbo(gl, ModelData.t);
		this._aPoshdl = gl.getAttribLocation(program, aPosition);
		this._aColHdl = gl.getAttribLocation(program, aColor);
		this._aUvHdl  = gl.getAttribLocation(program, aTexCoord);
		this._iIdxHdl = createIbo(gl, ModelData.i);
		this._iIdxlen = ModelData.i.length;
		this._mMatrix = mat.Matrix44.createIdentity();
	}

	getVboHdl(type) {
		switch (type) {
			case eBufType.pos: return this._vPoshdl;
			case eBufType.nor: return null;
			case eBufType.col: return this._vColHdl;
			case eBufType.uv : return this._vUvHdl;
			case eBufType.idx: return this._iIdxHdl;
			default : return null;
		}
	}
	
	getAttrHdl(type) {
		switch (type) {
			case eBufType.pos: return this._aPoshdl;
			case eBufType.col: return this._aColHdl;
			case eBufType.uv : return this._aUvHdl;
			default : return null;
		}
	}
	
	getAttrSize(type) {
		switch (type) {
			case eBufType.pos: return 3;
			case eBufType.col: return 3;
			case eBufType.uv : return 2;
			default : return null;
		}
	}
	
	getIboHdl() {
		return this._iIdxHdl;
	}
	
	getIboLen() {
		return this._iIdxlen;
	}

	getModelMatrix() {
		return this._mMatrix;
	}

	setModelMatrix(mat) {
		this._mMatrix = mat;
	}
}

/* 球体 */
class GLSphereMolde extends mixin(GlModelBase) {
	constructor(gl, program) {
		super();

		let ModelData = createSphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
		function createSphere(row, column, rad, color){
			let pos = [], nor = [],
				col = [], uv  = [], idx = [];
			for(let i = 0; i <= row; i++){
				let r = Math.PI / row * i;
				let ry = Math.cos(r);
				let rr = Math.sin(r);
				for(let ii = 0; ii <= column; ii++){
					let tr = Math.PI * 2 / column * ii;
					let tx = rr * rad * Math.cos(tr);
					let ty = ry * rad;
					let tz = rr * rad * Math.sin(tr);
					let rx = rr * Math.cos(tr);
					let rz = rr * Math.sin(tr);
					let tc = [];
					if(color){
						tc = color;
					}else{
						tc = hsva(360 / row * i, 1, 1, 1);
					}
					pos.push(tx, ty, tz);
					nor.push(rx, ry, rz);
					col.push(tc[0], tc[1], tc[2], tc[3]);
					uv.push(1 - 1 / column * ii, 1 / row * i);
				}
			}
			for(let i = 0; i < row; i++){
				for(let ii = 0; ii < column; ii++){
					let r = (column + 1) * i + ii;
					idx.push(r, r + 1, r + column + 2);
					idx.push(r, r + column + 2, r + column + 1);
				}
			}
			return {p : pos, n : nor, c : col, t : uv, i : idx};
		}

		this._vPoshdl = createVbo(gl, ModelData.p);
		this._vColHdl = createVbo(gl, ModelData.c);
		this._vUvHdl  = createVbo(gl, ModelData.t);
		this._aPoshdl = gl.getAttribLocation(program, aPosition);
		this._aColHdl = gl.getAttribLocation(program, aColor);
		this._aUvHdl  = gl.getAttribLocation(program, aTexCoord);
		this._iIdxHdl = createIbo(gl, ModelData.i);
		this._iIdxlen = ModelData.i.length;
		this._mMatrix = mat.Matrix44.createIdentity();
	}

	getVboHdl(type) {
		switch (type) {
			case eBufType.pos: return this._vPoshdl;
			case eBufType.nor: return null;
			case eBufType.col: return this._vColHdl;
			case eBufType.uv : return this._vUvHdl;
			case eBufType.idx: return this._iIdxHdl;
			default : return null;
		}
	}
	
	getAttrHdl(type) {
		switch (type) {
			case eBufType.pos: return this._aPoshdl;
			case eBufType.col: return this._aColHdl;
			case eBufType.uv : return this._aUvHdl;
			default : return null;
		}
	}
	
	getAttrSize(type) {
		switch (type) {
			case eBufType.pos: return 3;
			case eBufType.col: return 3;
			case eBufType.uv : return 2;
			default : return null;
		}
	}
	
	getIboHdl() {
		return this._iIdxHdl;
	}
	
	getIboLen() {
		return this._iIdxlen;
	}

	getModelMatrix() {
		return this._mMatrix;
	}

	setModelMatrix(mat) {
		this._mMatrix = mat;
	}
}
