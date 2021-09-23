/* 先にgetUserMedia()をベンダープリフィックス対応にしておく */
navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia || navigator.msGetUserMedia;

/* シェーダ変数定義 */
const aPosition	= 'aPosition';
const aColor	= 'aColor';
const aTexCoord = 'aTexCoord';

/* 空間座標 */
const relPos = {rot:[0,0,0,],scale:[1.0,1.0,1.0,],
	vMatrix:mat.Matrix44.lookAt([0.0, 0.0, 7.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], []),
}

/* エントリポイント */
function webgl_onload() {
	/* canvasエレメント初期化 */
	let canvas = document.getElementById('canvas');
		canvas.width = 1280;
		canvas.height= 720;
	let video;

	/* 空間座標のView/プロジェクション行列を保持 */
	relPos.pMatrix = mat.Matrix44.perspective(45, canvas.width / canvas.height, 0.1, 10.0, []);
	relPos.vpMatrix= mat.Matrix44.multiply(relPos.pMatrix, relPos.vMatrix, []);

	/* カメラ初期化 */
	if(!navigator.getUserMedia) {
		/* ブラウザ未サポート */
		alert('Err!! getUserMedia is not supported.');
	}
	else {
		navigator.getUserMedia(
			{video: {width: 1280, height: 720,}, audio: false},
			/* 成功応答 */
			function(mediaStream){
				/* カメラ画像表示 */
				video = document.createElement('video');
				/* mediaStream準備完了イベント登録 */
				video.addEventListener('canplay', function(){
					video.removeEventListener('canplay', arguments.callee, true);	/* 多重登録防止 */
					video.play();													/* stream開始 */
					console.log('src.size(', video.videoWidth, ',', video.videoHeight, ') <video>.size(', video.clientWidth, ',', video.clientHeight, ')');
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
		/* クリア色設定 */
		gl.clearColor(0.0, 0.7, 0.7, 1.0);
		/* カリングを有効 */
		gl.enable(gl.CULL_FACE);
		/* 頂点シェーダ生成 */
		let vshader = loadShader(gl, gl.VERTEX_SHADER  , document.getElementById('vsh').text);
		/* フラグメントシェーダ生成 */
		let fshader = loadShader(gl, gl.FRAGMENT_SHADER, document.getElementById('fsh').text);
		/* プログラム生成 */
		let program = createProgram(gl, vshader, fshader);

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
		let vpMatrix = m.createIdentity();
		let mvpMatrix = m.createIdentity();
		let invMatrix = m.createIdentity();

		/*----------- テクスチャ定義 -----------*/
		enableTexture(gl, video);
		function enableTexture(gl, video) {
			let videoTexture = gl.createTexture(gl.TEXTURE_2D);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	//		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, video);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		};

		/* 定期カウンタ初期化 */
		let count = 0;

		/*----------- ジェスチャ操作保持 -----------*/
		let v = mat.Vector4;
		let vecMouseAngle = v.LoadIdentity(v.create());

		/* マウスイベント設定 */
		canvas.addEventListener('mousemove', mouseMove_org, true);
		canvas.addEventListener('mousemove', mouseMove, true);
		canvas.addEventListener('mousewheel', mouseWheel, {passive: true});

		// 恒常ループ
		(function drawScene(now){
			/* 定期カウンタインクリメント */
			count++;

			/* 角度算出(カウンタを元にラジアン[rad]を求める) */
			let rad  = (count % 360) * Math.PI / 180;

			/* canvas初期化 */
			gl.clearDepth(1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			/* テクスチャ更新 */
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

			/* ビュー×プロジェクション座標変換行列 */
			let eyePosition   = [];
			let camUpDirection= [];
			v.toVec3([0.0, 0.0, 7.0], vecMouseAngle, eyePosition);
			v.toVec3([0.0, 1.0, 0.0], vecMouseAngle, camUpDirection);
			m.lookAt(eyePosition, [0.0, 0.0, 0.0], camUpDirection, vMatrix);
			m.perspective(45, canvas.width / canvas.height, 0.1, 10.0, pMatrix);
			m.multiply(pMatrix, vMatrix, vpMatrix);

			/* 球体レンダリング */
			/* 頂点 */bindVbo2Att(gl, spher.getVboHdl(eBufType.pos), spher.getAttrHdl(eBufType.pos), spher.getAttrSize(eBufType.pos));
			/* 色   */bindVbo2Att(gl, spher.getVboHdl(eBufType.col), spher.getAttrHdl(eBufType.col), spher.getAttrSize(eBufType.col));
			/* Tex  */bindVbo2Att(gl, spher.getVboHdl(eBufType.uv) , spher.getAttrHdl(eBufType.uv) , spher.getAttrSize(eBufType.uv));
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spher.getIboHdl());
			m.loadIdentity(mMatrix);
			m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);
			m.rotate(mMatrix, rad, [1.0, 1.0, 0.0], mMatrix);
			m.multiply(vpMatrix, mMatrix, mvpMatrix);
			gl.uniformMatrix4fv(unifHdlMvpMatrix, false, mvpMatrix);
			gl.uniform1i(unifHdlTexture, 0);
			gl.drawElements(gl.TRIANGLES, spher.getIboLen(), gl.UNSIGNED_SHORT, 0);

			/* cubeレンダリング */
			/* 頂点 */bindVbo2Att(gl, cube.getVboHdl(eBufType.pos), cube.getAttrHdl(eBufType.pos), cube.getAttrSize(eBufType.pos));
			/* 色   */bindVbo2Att(gl, cube.getVboHdl(eBufType.col), cube.getAttrHdl(eBufType.col), cube.getAttrSize(eBufType.col));
			/* Tex  */bindVbo2Att(gl, cube.getVboHdl(eBufType.uv) , cube.getAttrHdl(eBufType.uv) , cube.getAttrSize(eBufType.uv));
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.getIboHdl());
	 		m.loadIdentity(mMatrix);
			m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
			m.rotate(mMatrix, rad, [1.0, 1.0, 0.0], mMatrix);
			m.rotate(mMatrix, Math.PI, [0.0, 0.0, 1.0], mMatrix);
			m.multiply(vpMatrix, mMatrix, mvpMatrix);
			gl.uniformMatrix4fv(unifHdlMvpMatrix, false, mvpMatrix);
			gl.uniform1i(unifHdlTexture, 0);
			gl.drawElements(gl.TRIANGLES, cube.getIboLen(), gl.UNSIGNED_SHORT, 0);

			/* 平面描画 */
			/* 頂点 */bindVbo2Att(gl, plane.getVboHdl(eBufType.pos), plane.getAttrHdl(eBufType.pos), plane.getAttrSize(eBufType.pos));
			/* 色   */bindVbo2Att(gl, plane.getVboHdl(eBufType.col), plane.getAttrHdl(eBufType.col), plane.getAttrSize(eBufType.col));
			/* Tex  */bindVbo2Att(gl, plane.getVboHdl(eBufType.uv) , plane.getAttrHdl(eBufType.uv) , plane.getAttrSize(eBufType.uv));
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plane.getIboHdl());

			let plane_mvpMatrix = m.multiply(relPos.vpMatrix, plane.getModelMatrix(), []);
			gl.uniformMatrix4fv(unifHdlMvpMatrix, false, plane_mvpMatrix);
			gl.uniform1i(unifHdlTexture, 0);
			gl.drawElements(gl.TRIANGLES, plane.getIboLen(), gl.UNSIGNED_SHORT, 0);

			/* コンテキストの再描画 */
			gl.flush();

			/* ループのために再帰呼び出し */
			requestAnimationFrame(drawScene);
		})();

		/* マウスイベント(ホイール回転)) */
		function mouseWheel(e){
			let new_mMatrix = m.scale(plane.getModelMatrix(), [1+(e.wheelDelta/150/10), 1+(e.wheelDelta/150/10), 1+(e.wheelDelta/150/10)], []);
			plane.setModelMatrix(new_mMatrix);
		}

		/* マウスイベント(移動) */
		function mouseMove(e){
			if(event.which != 1/* left */) return;

			let new_mMatrix = m.translate(plane.getModelMatrix(), [(e.movementX/100), -(e.movementY/100), 0], []);
			plane.setModelMatrix(new_mMatrix);
		}

		/* マウス移動イベント */
		function mouseMove_org(e){
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
			mat.Vector4.rotate(r, [y, x, 0.0], vecMouseAngle);
		}
	}
}

/* プログラム生成(とシェーダリンク) */
function createProgram(gl, vsh, fsh) {
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

/* VBOをシェーダのattribute変数にバインド */
function bindVbo2Att(gl, vbohdl, atthdl, attdim){
	gl.bindBuffer(gl.ARRAY_BUFFER, vbohdl);							/* VBOバインド */
	gl.enableVertexAttribArray(atthdl);								/* attribute変数を有効化 */
	gl.vertexAttribPointer(atthdl, attdim, gl.FLOAT, false, 0, 0);	/* attribute変数に書式を通知 */
}

/* シェーダ生成 */
function loadShader(gl, shadertype, srcstr) {
	let shdr = gl.createShader(shadertype);					/* シェーダ生成 */
	gl.shaderSource( shdr, srcstr );						/* シェーダソースを送る */
	gl.compileShader(shdr);									/* コンパイル */
	if( !gl.getShaderParameter( shdr, gl.COMPILE_STATUS) ) {/* コンパイル結果判定 */
		let str = gl.getShaderInfoLog( shdr );
		throw new Error("unable to create shader shader type = " + shadertype + " : " + str);
	}

	return shdr;
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
