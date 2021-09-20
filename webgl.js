/* 先にgetUserMedia()をベンダープリフィックス対応にしておく */
navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia || navigator.msGetUserMedia;

function webgl_onload() {
	/* canvasエレメント初期化 */
	let canvas = document.getElementById('canvas');
		canvas.width = 1280;
		canvas.height= 720;
	let video;

	/* マウスイベント設定 */
	canvas.addEventListener('mousemove', mouseMove, true);

let q = new mat.Vector4();
let qt = q.identity(q.create());


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

	/* 頂点シェーダ生成 */
	let vshader = loadShader(gl.VERTEX_SHADER  , document.getElementById('vsh').text);
	/* フラグメントシェーダ生成 */
	let fshader = loadShader(gl.FRAGMENT_SHADER, document.getElementById('fsh').text);
	/* プログラム生成 */
	let program = createProgram(vshader, fshader);

	/* attribute変数sを定義 */
	let attPos3Col3Tex2 = [ {'size': 3, 'hBuf' : gl.getAttribLocation(program, 'aPosition'),},
							{'size': 3, 'hBuf' : gl.getAttribLocation(program, 'aColor'),   },
							{'size': 2, 'hBuf' : gl.getAttribLocation(program, 'aTexCoord'),},];

	/* 平面 */
	let planeModel_glInfo = function() {
					let ModelData = createPlane(3);
					function createPlane(size){
						let vertex = [
							-size, -size, 0,   size, -size, 0,   size, size, 0,  -size,  size, 0,
						];
						let nor = [
							1.0, 1.0,  1.0,  1.0, 1.0,  1.0,  1.0,  1.0,  1.0, 1.0,  1.0,  1.0,
						];
						let col = new Array();
						col.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, );

						let uv = [
							0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
						];
						let idx = [
							 0,  1,  2,  0,  2,  3,
						];
						return {p : vertex, n : nor, c : col, t : uv, i : idx};
					}
					let hPosition  = create_vbo(ModelData.p);
					let hColor     = create_vbo(ModelData.c);
					let hTexCoord  = create_vbo(ModelData.t);
					let hIndex     = create_ibo(ModelData.i);
    				return	{'vbos':{'pos': {'vbo_hdl' : hPosition, 'size': attPos3Col3Tex2[0].size, 'atr_hdl': attPos3Col3Tex2[0].hBuf},
									 'col': {'vbo_hdl' : hColor   , 'size': attPos3Col3Tex2[1].size, 'atr_hdl': attPos3Col3Tex2[1].hBuf},
									 'uv' : {'vbo_hdl' : hTexCoord, 'size': attPos3Col3Tex2[2].size, 'atr_hdl': attPos3Col3Tex2[2].hBuf},},
							'ibo' : {'ibo_hdl': hIndex, 'idxlen': ModelData.i.length,},};
				}();

	// attributeLocationを配列に取得
	let attLocation = new Array();
	attLocation[0] = gl.getAttribLocation(program, 'aPosition');
	attLocation[1] = gl.getAttribLocation(program, 'aColor');
	attLocation[2] = gl.getAttribLocation(program, 'aTexCoord');

	// attributeの要素数を配列に格納
	let attStride = new Array();
	attStride[0] = 3;
	attStride[1] = 3;
	attStride[2] = 2;

	// キューブモデル
	let cubeData  = cube(2.0, [1.0, 1.0, 1.0, 1.0]);
	let cPosition = create_vbo(cubeData.p);
	let cColor    = create_vbo(cubeData.c);
	let cTexCoord = create_vbo(cubeData.t);
	let cVBOList  = [cPosition, cColor, cTexCoord];
	let cIndex    = create_ibo(cubeData.i);
	
	// 球体モデル
	let sphereData = sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
	let sPosition  = create_vbo(sphereData.p);
	let sColor     = create_vbo(sphereData.c);
	let sTexCoord  = create_vbo(sphereData.t);
	let sVBOList   = [sPosition, sColor, sTexCoord];
	let sIndex     = create_ibo(sphereData.i);
	
	// uniformLocationを配列に取得
	let uniLocation = new Array();
	uniLocation[0] = gl.getUniformLocation(program, 'uMvpMatrix');
	uniLocation[1] = gl.getUniformLocation(program, 'uTexture');
	
	// 各種行列の生成と初期化
	let m = new mat.Matrix44();
	let mMatrix   = m.identity(m.create());
	let vMatrix   = m.identity(m.create());
	let pMatrix   = m.identity(m.create());
	let tmpMatrix = m.identity(m.create());
	let mvpMatrix = m.identity(m.create());
	let invMatrix = m.identity(m.create());
	
	// 深度テストとカリングを有効にする
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	
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
		
		// 球体をレンダリング
		set_attribute(sVBOList, attLocation, attStride);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sIndex);
		m.identity(mMatrix);
		m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);
		m.rotate(mMatrix, rad, [1.0, 1.0, 0.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
		gl.uniform1i(uniLocation[1], 0);
		gl.drawElements(gl.TRIANGLES, sphereData.i.length, gl.UNSIGNED_SHORT, 0);
		
		// キューブをレンダリング
		set_attribute(cVBOList, attLocation, attStride);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIndex);
		m.identity(mMatrix);
		m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
		m.rotate(mMatrix, rad, [1.0, 1.0, 0.0], mMatrix);
		m.rotate(mMatrix, Math.PI, [0.0, 0.0, 1.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
		gl.uniform1i(uniLocation[1], 0);
		gl.drawElements(gl.TRIANGLES, cubeData.i.length, gl.UNSIGNED_SHORT, 0);

		/* 平面描画 */
		set_attribute(	[planeModel_glInfo.vbos.pos.vbo_hdl, planeModel_glInfo.vbos.col.vbo_hdl, planeModel_glInfo.vbos.uv.vbo_hdl], 
						[planeModel_glInfo.vbos.pos.atr_hdl, planeModel_glInfo.vbos.col.atr_hdl, planeModel_glInfo.vbos.uv.atr_hdl],
						[planeModel_glInfo.vbos.pos.size   , planeModel_glInfo.vbos.col.size   , planeModel_glInfo.vbos.uv.size   ]);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeModel_glInfo.ibo.ibo_hdl);
		m.identity(mMatrix);
		m.translate(mMatrix, [2.0, 1.0, 1.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
		gl.uniform1i(uniLocation[1], 0);
		gl.drawElements(gl.TRIANGLES, planeModel_glInfo.ibo.idxlen, gl.UNSIGNED_SHORT, 0);

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

	// VBOを生成する関数
	function create_vbo(data){
		// バッファオブジェクトの生成
		let vbo = gl.createBuffer();
		
		// バッファをバインドする
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		
		// バッファにデータをセット
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		
		// バッファのバインドを無効化
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		// 生成した VBO を返して終了
		return vbo;
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

	// IBOを生成する関数
	function create_ibo(data){
		// バッファオブジェクトの生成
		let ibo = gl.createBuffer();
		
		// バッファをバインドする
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		
		// バッファにデータをセット
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
		
		// バッファのバインドを無効化
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		// 生成したIBOを返して終了
		return ibo;
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
		q.rotate(r, [y, x, 0.0], qt);
	}
}
