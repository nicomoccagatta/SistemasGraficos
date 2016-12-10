function getShader(gl, id) {
    var shaderScript, src, currentChild, shader;

    // Obtenemos el elemento <script> que contiene el código fuente del shader.
    shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    // Extraemos el contenido de texto del <script>.
    src = "";
    currentChild = shaderScript.firstChild;
    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            src += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    // Creamos un shader WebGL según el atributo type del <script>.
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    // Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
    gl.shaderSource(shader, src);

    // Compilamos el shader.
    gl.compileShader(shader);  

    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    shaderProgramSimple = initShaderSimple();
    if (! shaderProgramSimple) {
        console.log("No se pudo inicializar el shaderSimple");
        return;
    }
}

function initShaderSimple() {
    // Obtenemos los shaders ya compilados
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Creamos un programa de shaders de WebGL.
    var shaderProgram = gl.createProgram();

    // Asociamos cada shader compilado al programa.
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Linkeamos los shaders para generar el programa ejecutable.
    gl.linkProgram(shaderProgram);

    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    // Le decimos a WebGL que de aquí en adelante use el programa generado.
    gl.useProgram(shaderProgram);

    // Tomamos referencias Javascript para acceder a las variables propias del shader.
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexTangentAttribute = gl.getAttribLocation(shaderProgram, "aVertexTangent");
    gl.enableVertexAttribArray(shaderProgram.vertexTangentAttribute);

    shaderProgram.vertexBinormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexBinormal");
    gl.enableVertexAttribArray(shaderProgram.vertexBinormalAttribute);

    // Con esto accedo a las uniforms del shader de vértices
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uProyMatrix");
    shaderProgram.ViewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
    shaderProgram.ModelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
    shaderProgram.useReflectionUniform = gl.getUniformLocation(shaderProgram, "uUseReflection");

    shaderProgram.sunPositionUniform = gl.getUniformLocation(shaderProgram, "uSunPosition");
    shaderProgram.eyePointUniform = gl.getUniformLocation(shaderProgram, "uEyePoint");

    // Con esto accedo a las uniforms del shader de fragmentos
    // Iluminacion
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.iluminationIntensityUniform = gl.getUniformLocation(shaderProgram, "uIluminationIntensity");

    // Sol
    shaderProgram.lightingPrincipalDirectionUniform = gl.getUniformLocation(shaderProgram, "uPrincipalLightDirection");
    shaderProgram.diffusePrincipalColorUniform = gl.getUniformLocation(shaderProgram, "uPrincipalDiffuseColor");
    shaderProgram.specularPrincipalColorUniform = gl.getUniformLocation(shaderProgram, "uPrincipalSpecularColor");
    shaderProgram.lightPrincipalIntensity = gl.getUniformLocation(shaderProgram, "uPrincipalLightIntensity");

    // Tierra
    shaderProgram.lightingSecondaryDirectionUniform = gl.getUniformLocation(shaderProgram, "uSecondaryLightDirection");
    shaderProgram.diffuseSecondaryColorUniform = gl.getUniformLocation(shaderProgram, "uSecondaryDiffuseColor");
    shaderProgram.specularSecondaryColorUniform = gl.getUniformLocation(shaderProgram, "uSecondarySpecularColor");
    shaderProgram.lightSecondaryIntensity = gl.getUniformLocation(shaderProgram, "uSecondaryLightIntensity");

    // Luces Puntuales
    shaderProgram.usePunctualLights = gl.getUniformLocation(shaderProgram, "uUsePunctualLights");
    shaderProgram.diffusePunctualColorUniform = gl.getUniformLocation(shaderProgram, "uPunctualDiffuseColor");
    shaderProgram.specularPunctualColorUniform = gl.getUniformLocation(shaderProgram, "uPunctualSpecularColor");
    shaderProgram.lightPunctualIntensity = gl.getUniformLocation(shaderProgram, "uPunctualLightIntensity");

    // Posiciones de las Luces Puntuales
    shaderProgram.lightingPunctual1PositionUniform = gl.getUniformLocation(shaderProgram, "uPunctual1LightPosition");
    shaderProgram.lightingPunctual2PositionUniform = gl.getUniformLocation(shaderProgram, "uPunctual2LightPosition");
    shaderProgram.lightingPunctual3PositionUniform = gl.getUniformLocation(shaderProgram, "uPunctual3LightPosition");
    shaderProgram.lightingPunctual4PositionUniform = gl.getUniformLocation(shaderProgram, "uPunctual4LightPosition");

    // Booleanos
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.useColorUniform = gl.getUniformLocation(shaderProgram, "uUseColor");
    shaderProgram.useNormalUniform = gl.getUniformLocation(shaderProgram, "uUseNormal");
    shaderProgram.useIluminationUniform = gl.getUniformLocation(shaderProgram, "uUseIlumination");

    // Samplers
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.samplerUniformReflection = gl.getUniformLocation(shaderProgram, "uSamplerReflectionMap");
    shaderProgram.samplerUniformNormal = gl.getUniformLocation(shaderProgram, "uSamplerNormalMap");
    shaderProgram.samplerUniformIlumination = gl.getUniformLocation(shaderProgram, "uSamplerIluminationMap");

    // Camara
    shaderProgram.cameraPositionUniform = gl.getUniformLocation(shaderProgram, "uCameraPosition");

    return shaderProgram;
}