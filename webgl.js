/* 先にgetUserMedia()をベンダープリフィックス対応にしておく */
navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia || navigator.msGetUserMedia;

/* シェーダ変数定義 */
const aPosition	= 'aPosition';
const aColor	= 'aColor';
const aTexCoord = 'aTexCoord';

/* エントリポイント */
function webgl_onload() {
	/* canvasエレメント初期化 */
	let canvas = document.getElementById('canvas');
		canvas.width = 1280;
		canvas.height= 720;
	let video;

	/* カメラ初期化 */
	if(!navigator.getUserMedia) {
		/* ブラウザ未サポート */
		alert('Err!! getUserMedia is not supported.');
	}
	else {
		navigator.getUserMedia(
			{video: true, audio: false},
			/* 成功応答 */
			function(mediaStream){
				/* カメラ画像表示 */
				video = document.createElement('video');
				/* mediaStream準備完了イベント登録 */
				video.addEventListener('canplay', function(){
					video.removeEventListener('canplay', arguments.callee, true);	/* 多重登録防止 */
					video.play();													/* stream開始 */
					startWebGL();													/* WebGL開始 */
				}, true);
				
				video.srcObject = mediaStream;										/* videoタグにsrc設定 */
			},
			/* 失敗応答 */
			function(err) {
				if(err.name === 'PermissionDeniedError'){
					alert('ユーザーにより拒否されました。');
				}
				else {
					alert('USBカメラが接続されていません。');
				}
			}
		);
	}

/* WebGL */
function startWebGL(){
	/* webglコンテキスト取得 */
	let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	/*----------- GL初期化 -----------*/
	/* 深度テスト有効 */
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	/* カリングを有効 */
	gl.enable(gl.CULL_FACE);
	/* 頂点シェーダ生成 */
	let vshader = loadShader(gl.VERTEX_SHADER  , document.getElementById('vsh').text);
	/* フラグメントシェーダ生成 */
	let fshader = loadShader(gl.FRAGMENT_SHADER, document.getElementById('fsh').text);
	/* プログラム生成 */
	let program = createProgram(vshader, fshader);

	/*----------- モデル定義 -----------*/
	/* 平面 */
	let plane = new GLPlaneMolde(gl, program);

	/* cubeモデル */
	let cube = new GLCubeMolde(gl, program);
	
	/* 球体モデル */
	let spher = new GLSphereMolde(gl, program);
	
	/*----------- テクスチャ定義 -----------*/
	/* シェーダのTextureハンドラを取得 */
	let unifHdlTexture  = gl.getUniformLocation(program, 'uTexture');

	/*----------- 空間定義 -----------*/
	/* シェーダのMvp行列ハンドラを取得 */
	let unifHdlMvpMatrix= gl.getUniformLocation(program, 'uMvpMatrix');
	/* 各行列生成/初期化 */
	let m = mat.Matrix44;
	let mMatrix   = m.createIdentity();
	let vMatrix   = m.createIdentity();
	let pMatrix   = m.createIdentity();
	let tmpMatrix = m.createIdentity();
	let mvpMatrix = m.createIdentity();
	let invMatrix = m.createIdentity();
	
	// カウンタ初期化
	let count = 0;
	
	// テクスチャ関連
	let videoTexture = gl.createTexture(gl.TEXTURE_2D);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
//	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, video);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

let q = mat.Vector4;
let qt = q.identity(q.create());

/* マウスイベント設定 */
canvas.addEventListener('mousemove', mouseMove, true);

	// 恒常ループ
	(function(){
		// カウンタをインクリメントする
		count++;

		// カウンタを元にラジアンを算出
		let rad  = (count % 360) * Math.PI / 180;

		// canvasを初期化
		gl.clearColor(0.0, 0.7, 0.7, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// テクスチャを更新する
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, video);

		// ビュー×プロジェクション座標変換行列
		let eyePosition = new Array();
		let camUpDirection = new Array();
		q.toVecIII([0.0, 0.0, 7.0], qt, eyePosition);
		q.toVecIII([0.0, 1.0, 0.0], qt, camUpDirection);
		m.lookAt(eyePosition, [0.0, 0.0, 0.0], camUpDirection, vMatrix);
		m.perspective(45, canvas.width / canvas.height, 0.1, 10.0, pMatrix);
		m.multiply(pMatrix, vMatrix, tmpMatrix);

		/* 球体レンダリング */
		set_attribute(  [spher.getVboHdl(eBufType.pos)  , spher.getVboHdl(eBufType.col)  , spher.getVboHdl(eBufType.uv)], 
						[spher.getAttrHdl(eBufType.pos) , spher.getAttrHdl(eBufType.col) , spher.getAttrHdl(eBufType.uv)],
						[spher.getAttrSize(eBufType.pos), spher.getAttrSize(eBufType.col), spher.getAttrSize(eBufType.uv)]);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spher.getIboHdl());
		m.loadIdentity(mMatrix);
		m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);
		m.rotate(mMatrix, rad, [1.0, 1.0, 0.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(unifHdlMvpMatrix, false, mvpMatrix);
		gl.uniform1i(unifHdlTexture, 0);
		gl.drawElements(gl.TRIANGLES, spher.getIboLen(), gl.UNSIGNED_SHORT, 0);

		/* cubeレンダリング */
		set_attribute(	[cube.getVboHdl(eBufType.pos)  , cube.getVboHdl(eBufType.col)  , cube.getVboHdl(eBufType.uv)], 
						[cube.getAttrHdl(eBufType.pos) , cube.getAttrHdl(eBufType.col) , cube.getAttrHdl(eBufType.uv)],
						[cube.getAttrSize(eBufType.pos), cube.getAttrSize(eBufType.col), cube.getAttrSize(eBufType.uv)]);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.getIboHdl());
 		m.loadIdentity(mMatrix);
		m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
		m.rotate(mMatrix, rad, [1.0, 1.0, 0.0], mMatrix);
		m.rotate(mMatrix, Math.PI, [0.0, 0.0, 1.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(unifHdlMvpMatrix, false, mvpMatrix);
		gl.uniform1i(unifHdlTexture, 0);
		gl.drawElements(gl.TRIANGLES, cube.getIboLen(), gl.UNSIGNED_SHORT, 0);

		/* 平面描画 */
		set_attribute(	[plane.getVboHdl(eBufType.pos)  , plane.getVboHdl(eBufType.col)  , plane.getVboHdl(eBufType.uv)], 
						[plane.getAttrHdl(eBufType.pos) , plane.getAttrHdl(eBufType.col) , plane.getAttrHdl(eBufType.uv)],
						[plane.getAttrSize(eBufType.pos), plane.getAttrSize(eBufType.col), plane.getAttrSize(eBufType.uv)]);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.getIboHdl());
		m.loadIdentity(mMatrix);
		m.translate(mMatrix, [2.0, 1.0, 1.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(unifHdlMvpMatrix, false, mvpMatrix);
		gl.uniform1i(unifHdlTexture, 0);
		gl.drawElements(gl.TRIANGLES, plane.getIboLen(), gl.UNSIGNED_SHORT, 0);

		// コンテキストの再描画
		gl.flush();

		// ループのために再帰呼び出し
		requestAnimationFrame(arguments.callee);
	})();

	/* シェーダ生成 */
	function loadShader(shadertype, srcstr) {
		/* シェーダ生成 */
		let shdr = gl.createShader(shadertype);
		/* シェーダソースを送る */
		gl.shaderSource( shdr, srcstr );
		/* コンパイル */
		gl.compileShader(shdr);
		/* コンパイル結果判定 */
		if( !gl.getShaderParameter( shdr, gl.COMPILE_STATUS) ) {
			let str = gl.getShaderInfoLog( shdr );
			throw new Error("unable to create shader shader type = " + shadertype + " : " + str);
		}

		return shdr;
	}

	/* プログラム生成(とシェーダリンク) */
	function createProgram(vsh, fsh) {
		let program = gl.createProgram();
		gl.attachShader(program, vsh);
		gl.attachShader(program, fsh);
		gl.linkProgram(program);

		/* リンク結果判定 */
		if( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
			let str = gl.getShaderInfoLog( program );
			throw new Error("failed to link program: " + str);
		}

		gl.useProgram(program);
		return program;
	}

	// VBOをバインドし登録する関数
	function set_attribute(vbo, attL, attS){
		// 引数として受け取った配列を処理する
		for(let i in vbo){
			// バッファをバインドする
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
			
			// attributeLocationを有効にする
			gl.enableVertexAttribArray(attL[i]);
			
			// attributeLocationを通知し登録する
			gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
		}
	}

	// マウスムーブイベントに登録する処理
	function mouseMove(e){
		let cw = canvas.width;
		let ch = canvas.height;
		let wh = 1 / Math.sqrt(cw * cw + ch * ch);
		let x = e.clientX - canvas.offsetLeft - cw * 0.5;
		let y = e.clientY - canvas.offsetTop - ch * 0.5;
		let sq = Math.sqrt(x * x + y * y);
		let r = sq * 2.0 * Math.PI * wh;
		if(sq != 1){
			sq = 1 / sq;
			x *= sq;
			y *= sq;
		}
		mat.Vector4.rotate(r, [y, x, 0.0], qt);
	}
}
}

/* IBO生成 */
function createIbo(gl, data){
	let ibo = gl.createBuffer();													/* BO生成 */
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);									/* IBOとしてバインド */
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);	/* データをセット */
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);									/* バインド解除 */
	return ibo;
}
	
/* VBO生成 */
function createVbo(gl, data){
	let vbo = gl.createBuffer();											/* BO生成 */
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);									/* VBOとしてバインド */
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);	/* データをセット */
	gl.bindBuffer(gl.ARRAY_BUFFER, null);									/* バインド解除 */
	return vbo;
}
