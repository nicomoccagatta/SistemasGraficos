function TexturedSphere(latitude_bands, longitude_bands){

this.latitudeBands = latitude_bands;
this.longitudeBands = longitude_bands;

this.position_buffer = null;
this.normal_buffer = null;
this.texture_coord_buffer = null;
this.index_buffer = null;

this.webgl_position_buffer = null;
this.webgl_normal_buffer = null;
this.webgl_texture_coord_buffer = null;
this.webgl_index_buffer = null;

this.texture = null;

this.initTexture = function(texture_file){
    
    var aux_texture = gl.createTexture();
    this.texture = aux_texture;
    this.texture.image = new Image();

    this.texture.image.onload = function () {
           handleLoadedTexture()
    }
    this.texture.image.src = texture_file;
}


// Se generan los vertices para la esfera, calculando los datos para una esfera de radio 1
// Y también la información de las normales y coordenadas de textura para cada vertice de la esfera
// La esfera se renderizara utilizando triangulos, para ello se arma un buffer de índices 
// a todos los triángulos de la esfera
this.initBuffers = function(){

    this.position_buffer = [];
    this.normal_buffer = [];
    this.texture_coord_buffer = [];

    var latNumber;
    var longNumber;

    for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / this.latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / this.longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1.0 - (longNumber / this.longitudeBands);
            var v = 1.0 - (latNumber / this.latitudeBands);

            this.normal_buffer.push(x);
            this.normal_buffer.push(y);
            this.normal_buffer.push(z);

            this.texture_coord_buffer.push(u);
            this.texture_coord_buffer.push(v);
            
            this.position_buffer.push(x);
            this.position_buffer.push(y);
            this.position_buffer.push(z);
        }
    }

    // Buffer de indices de los triangulos
    this.index_buffer = [];
  
    for (latNumber=0; latNumber < this.latitudeBands; latNumber++) {
        for (longNumber=0; longNumber < this.longitudeBands; longNumber++) {
            var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
            var second = first + this.longitudeBands + 1;
            this.index_buffer.push(first);
            this.index_buffer.push(second);
            this.index_buffer.push(first + 1);

            this.index_buffer.push(second);
            this.index_buffer.push(second + 1);
            this.index_buffer.push(first + 1);
        }
    }

    // Creación e Inicialización de los buffers a nivel de OpenGL
    this.webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
    this.webgl_normal_buffer.itemSize = 3;
    this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

    this.webgl_texture_coord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
    this.webgl_texture_coord_buffer.itemSize = 2;
    this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

    this.webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
    this.webgl_position_buffer.itemSize = 3;
    this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

    this.webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
    this.webgl_index_buffer.itemSize = 1;
    this.webgl_index_buffer.numItems = this.index_buffer.length;
}

this.setupShaders = function(){
    gl.useProgram(shaderProgramTexturedObject);
}

this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
    ////////////////////////////////////////////////////
    // Configuración de la luz
    // Se inicializan las variables asociadas con la Iluminación
    var lighting;
    lighting = true;
    gl.uniform1i(shaderProgramTexturedObject.useLightingUniform, lighting);       

    gl.uniform3fv(shaderProgramTexturedObject.lightingDirectionUniform, lightPosition);
    gl.uniform3fv(shaderProgramTexturedObject.ambientColorUniform, ambientColor );
    gl.uniform3fv(shaderProgramTexturedObject.directionalColorUniform, diffuseColor);
}

this.draw = function(modelMatrix){
 
    // setViewProjectionMatrix();
    gl.uniformMatrix4fv(shaderProgramTexturedObject.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgramTexturedObject.ViewMatrixUniform, false, CameraMatrix); 
    
    // Se configuran los buffers que alimentarán el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgramTexturedObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
    gl.vertexAttribPointer(shaderProgramTexturedObject.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgramTexturedObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgramTexturedObject.samplerUniform, 0);

    gl.uniformMatrix4fv(shaderProgramTexturedObject.ModelMatrixUniform, false, modelMatrix);
    var normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix, modelMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(shaderProgramTexturedObject.nMatrixUniform, false, normalMatrix);

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    //gl.drawElements(gl.LINE_LOOP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    /////////////////////////////////
}

}
