function drawScene() {
    // Se configura el vierport dentro de area canvas. En este caso se utiliza toda
    // el area disponible
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    
    // Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se configura la matriz de perspectiva.
    mat4.perspective(pMatrix, degToRad(80), gl.viewportWidth / gl.viewportHeight, 0.01, 2000.0);

    // ################################### CONFIGURACION DEL SHADER ###################################
    gl.useProgram(shaderProgramSimple);
    gl.uniformMatrix4fv(shaderProgramSimple.ViewMatrixUniform, false, CameraMatrix);
    gl.uniformMatrix4fv(shaderProgramSimple.pMatrixUniform, false, pMatrix);
    gl.uniform3fv(shaderProgramSimple.cameraPositionUniform, target);
    gl.uniform3fv(shaderProgramSimple.eyePointUniform, target);
    // En principio no utilizo reflexion
    gl.uniform1f(shaderProgramSimple.useReflectionUniform, 0.0);
    // En principio utilizo texturas
    gl.uniform1i(shaderProgramSimple.useColorUniform, false);
    // En principio no utilizo mapa de normales
    gl.uniform1i(shaderProgramSimple.useNormalUniform, false);
    // En principio no utilizo mapa de iluminacion
    gl.uniform1i(shaderProgramSimple.useIluminationUniform, false);
    // En principio no utilizo luces puntuales(Solo adentro de la bahia de carga)
    gl.uniform1i(shaderProgramSimple.usePunctualLights, false);

    // Configuración de la luz
    // Se inicializan las variables asociadas con la iluminación
    var lighting = true;
    gl.uniform1i(shaderProgramSimple.useLightingUniform, lighting);
    // Sol
    var sunPosition = vec3.fromValues(500.0, 300.0, 500.0);
    gl.uniform3fv(shaderProgramSimple.lightingPrincipalDirectionUniform, sunPosition);
    gl.uniform3fv(shaderProgramSimple.sunPositionUniform, sunPosition);
    gl.uniform1f(shaderProgramSimple.lightPrincipalIntensity, 1.2);                         //Intensidad
    gl.uniform3f(shaderProgramSimple.ambientColorUniform, 0.3, 0.3, 0.3);                   //Ambiente
    gl.uniform3f(shaderProgramSimple.diffusePrincipalColorUniform, 1.0, 1.0, 1.0);          //Difusa
    gl.uniform3f(shaderProgramSimple.specularPrincipalColorUniform, 0.4, 0.4, 0.4);         //Especular

    // ################################### DIBUJADO DE LA ESCENA ###################################
    
    ////////////////////////////////////////////////////////
    var model_matrix_bridge = mat4.create();
    mat4.identity(model_matrix_bridge);
    bridge.draw(model_matrix_bridge, shaderProgramSimple);
    ////////////////////////////////////////////////////////
    var model_matrix_field = mat4.create();
    mat4.identity(model_matrix_field);
    field.draw(model_matrix_field, shaderProgramSimple);
    ////////////////////////////////////////////////////////
    trees.draw(treeTexture, shaderProgramSimple);
    ////////////////////////////////////////////////////////
    var model_matrix_sky = mat4.create();
    mat4.identity(model_matrix_sky);
    mat4.scale(model_matrix_sky, model_matrix_sky, [1000.0, 1000.0, 900.0]);
    sky.draw(model_matrix_sky, shaderProgramSimple);
    ////////////////////////////////////////////////////////
}

function tick() {
    requestAnimFrame(tick); 
    handleKeyPresses();
    updateCamera();
    field.updateField(points);
    from_and_to = field.getYPositionFromX(points, app.pos);
    //bridge = bridge.updateBridge(app, from_and_to);
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

    field = new Field(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP, FIELD_DIAMETER, FIELD_HEIGHT, app.ph1, points);
    field.initBuffers();

    from_and_to = field.getYPositionFromX(points, app.pos);
    
    bridge = new Bridge(app.ph1, app.ph2, app.ph3, app.s1, app.pos, app.cols, from_and_to[0], from_and_to[1]); 

    trees = new Trees(LEFT_BORDER_MAP, RIGHT_BORDER_MAP, BOTTOM_BORDER_MAP, TOP_BORDER_MAP,app.ph1);
    trees.initBuffers();

    sky = new TexturedSphere(64,64);
    sky.initBuffers();
    sky.initTexture("maps/sky_lightblue2.jpg");

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