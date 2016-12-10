function drawScene() {

	// Se configura el vierport dentro de area canvas. En este caso se utiliza toda
	// el area disponible
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	
	// Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Se configura la matriz de proyeccion
    mat4.perspective(pMatrix, 3.14/12.0, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0);


    // Matrices de modelado
    var model_matrix_bridge = mat4.create();
    mat4.identity(model_matrix_bridge);

    var model_matrix_field = mat4.create();
    mat4.identity(model_matrix_field);
    
    ////////////////////////////////////////////////////////
    bridge.setupLighting(vec3.fromValues(-500.0, 0.0, -60.0), vec3.fromValues(0.3, 0.3, 0.3), vec3.fromValues(0.05, 0.05, 0.05));
    bridge.draw(model_matrix_bridge);

    field.setupShaders();
    field.setupLighting(vec3.fromValues(-500.0, 0.0, -60.0), vec3.fromValues(0.3, 0.3, 0.3), vec3.fromValues(0.01, 0.01, 0.01));
    field.draw(model_matrix_field);


    trees.setupShaders();
    trees.setupLighting(vec3.fromValues(-500.0, 0.0, -60.0), vec3.fromValues(0.3, 0.3, 0.3), vec3.fromValues(0.01, 0.01, 0.01));
    trees.draw(treeTexture);
    //
    ////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////
    sky.setupShaders();
    sky.setupLighting(vec3.fromValues(-300.0, 0.0, -60.0), vec3.fromValues(1.0, 1.0, 1.0), vec3.fromValues(0.0, 0.0, 0.0))
    
    // Matriz de modelado de sky
    var model_matrix_sky = mat4.create();
    mat4.identity(model_matrix_sky);
    mat4.scale(model_matrix_sky, model_matrix_sky, [1000.0, 1000.0, 900.0]);
    sky.draw(model_matrix_sky, skyTexture);
    //
    ////////////////////////////////////////////////////////
}

function tick() {
    requestAnimFrame(tick); 
    handleKeyPresses();
    updateCamera();
    field.updateField(points);
    from_and_to = field.getYPositionFromX(points, app.pos);
    bridge = bridge.updateBridge(app, from_and_to);
    trees.updateTrees(app.ph1,1,2,1.5);
    drawScene();
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function webGLStart() {
    var canvas = document.getElementById("TP Sistemas Graficos");
    widthOfCanvas = canvas.width;
    heightOfCanvas = canvas.height;

    if (canvas.addEventListener) {
        // IE9, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    // IE 6/7/8
    else canvas.attachEvent("onmousewheel", MouseWheelHandler);     

    initGL(canvas);
    initShaders();
    initVariables();
    initTexture();

    // Field(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points)
    field = new Field(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP, FIELD_DIAMETER, FIELD_HEIGHT, app.ph1, points);
    field.initBuffers();

    from_and_to = field.getYPositionFromX(points, app.pos);
    bridge = new Bridge(app.ph1, app.ph2, app.ph3, app.s1, app.pos, app.cols, from_and_to[0], from_and_to[1]); 
    // Bridge(ph1, ph2, ph3, s1, center_x, number_of_columns, from, to)

    trees = new Trees(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP,app.ph1);
    trees.initBuffers();


    sky = new TexturedSphere(64,64);
    sky.initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    tick();
}

function initVariables () {
    cameraMode = 1;
    target = [0,0,0];
    var initPosToTranslate = vec3.create();
    vec3.set(initPosToTranslate,20.0,20.0,3.0);   //Aca pongo a donde quiero que vaya
    var radius = vec3.squaredLength(initPosToTranslate);
    thetaAngle = Math.acos(initPosToTranslate[2]/radius);   //para las rotaciones en zy e zx
    phiAngle = Math.atan(initPosToTranslate[1]/initPosToTranslate[0]);  //para las rotaciones en el plano xy
    cameraPosition = [radius*Math.cos(phiAngle)*Math.sin(thetaAngle),radius*Math.sin(phiAngle)*Math.sin(thetaAngle),radius*Math.cos(thetaAngle)];
}

function updateCamera() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.lookAt(CameraMatrix,cameraPosition,target,[0.0,0.0,1.0]);
    mat4.perspective(pMatrix,degToRad(70), gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
}
