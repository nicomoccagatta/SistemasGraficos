const MIDDLE_HEIGHT_SEPARATION = 0.6;
const MAX_HEIGHT_SEPARATION = 0.85;
const INTERN_LOW_BORDER = 1.3;
const INTERN_HIGH_BORDER = 1;
const HALF_WIDTH = 5;



function PlainRoadLeftBorder(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;

    this.initBuffers = function() {
        var middle_height = height + MIDDLE_HEIGHT_SEPARATION;
        var max_height = height + MAX_HEIGHT_SEPARATION;
        
        var extreme_left_x = (center_x + HALF_WIDTH);
        var extreme_right_x = (center_x - HALF_WIDTH);
        
        var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
        var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
        
        var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
        var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
        
        var position_buffer = [
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, from, max_height,
            extreme_left_x, to, height,
            extreme_left_x, to, max_height,
                        
            extreme_left_x, from, max_height,
            
            intern_high_left_x, to, max_height,
            intern_high_left_x, from, max_height,
            intern_high_left_x, from, max_height,
            intern_low_left_x, from, middle_height,
            intern_high_left_x, to, max_height,

            intern_low_left_x, to, middle_height,
            intern_low_left_x, to, middle_height,
            intern_low_left_x, from, middle_height,
            intern_low_left_x, to, height,
            intern_low_left_x, from, height,

            intern_low_left_x, from, height,
            intern_low_left_x, to, height,
            extreme_left_x, from, height,
            extreme_left_x, to, height
        ];

        //TODO cambie lo que estaba
        var tangent_buffer = [
            0, 0, 0,
            0, 0, 0,
            0, 0, max_height - height,
            0, to - from, height - max_height,
            0, 0, max_height - height,
            0, from - to, 0,
            intern_high_left_x - extreme_left_x, to - from, 0,
            0, from - to, 0,
            0, 0, 0,
            intern_low_left_x - intern_high_left_x, 0, middle_height - max_height,
            intern_high_left_x - intern_low_left_x, to - from, max_height - middle_height,
            intern_low_left_x - intern_high_left_x, 0, middle_height - max_height,
            0, 0, 0,
            0, from - to, 0,
            0, to - from, height - middle_height,
            0, from - to, 0,
            0, 0, 0,
            0, to - from, 0,
            extreme_left_x - intern_low_left_x, from - to, 0,
            0, to - from, 0,
            0, 0, 0
        ];

        var texture_coord_buffer = [
            1 , 0,
            1 , 0,
            1 , 0,
            .8, 0,
            1 , 1,
            .8, 1,

            .8, 0,

            .3, 1,
            .3, 0,
            .3, 0,
            .1, 0,
            .3, 1,

            .1, 1,
            .1, 1,
            .1, 0,
            0 , 1,
            0 , 0,

            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
                
        var normal_buffer = [
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            
            /*extreme_right_x, to, max_height,
            extreme_right_x, to, height,
            extreme_right_x, to, max_height,*/
            
            1.0, 0.0, 1.0,
            //extreme_right_x, from, max_height,extreme_right_x, from, max_height,
            
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0
        ];
        
        var binormal_buffer = getBinormalBufferFromVectors(normal_buffer, tangent_buffer);
        this.index_buffer = [];
        for (var i = 0; i < normal_buffer.length / 3; i++) {
            this.index_buffer.push(i);
        }

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer.itemSize = 3;
        this.webgl_binormal_buffer.numItems = binormal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = tangent_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = texture_coord_buffer.length / 2;
    }
    
    this.prepareDraw = function(shaderProgram, modelMatrix) {
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        // DIFFUSE MAP TEXTURE
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, veredaNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, shaderProgram) { 
        this.prepareDraw(shaderProgram, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function PlainRoadRightBorder(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;

    this.initBuffers = function() {
        var middle_height = height + MIDDLE_HEIGHT_SEPARATION;
        var max_height = height + MAX_HEIGHT_SEPARATION;
        
        var extreme_left_x = (center_x + HALF_WIDTH);
        var extreme_right_x = (center_x - HALF_WIDTH);
        
        var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
        var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
        
        var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
        var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
        
        var position_buffer = [
            extreme_right_x, from, height,
            extreme_right_x, from, height,
            extreme_right_x, from, height,
            extreme_right_x, from, max_height,
            extreme_right_x, to, height,
            extreme_right_x, to, max_height,
            
            extreme_right_x, from, max_height,
            
            intern_high_right_x, to, max_height,
            intern_high_right_x, from, max_height,
            intern_high_right_x, from, max_height,
            intern_low_right_x, from, middle_height,
            intern_high_right_x, to, max_height,
            intern_low_right_x, to, middle_height,
            intern_low_right_x, to, middle_height,
            intern_low_right_x, from, middle_height,
            intern_low_right_x, to, height,
            intern_low_right_x, from, height,
            intern_low_right_x, from, height,
            intern_low_right_x, to, height,
            extreme_right_x, from, height,
            extreme_right_x, to, height
        ];
        
        //TODO nuevo
        var tangent_buffer = [
            0, 0, 0,
            0, 0, 0,
            0, 0, max_height - height,
            0, to - from, height - max_height,
            0, 0, max_height - height,
            0, from - to, 0,
            intern_high_right_x - extreme_right_x, to - from, 0,
            0, from - to, 0,
            0, 0, 0,
            intern_low_right_x - intern_high_right_x, 0, middle_height - max_height,
            intern_high_right_x - intern_low_right_x, to - from, max_height - middle_height,
            intern_low_right_x - intern_high_right_x, 0, middle_height - max_height,
            0, 0, 0,
            0, from - to, 0,
            0, to - from, height - middle_height,
            0, from - to, 0,
            0, 0, 0,
            0, to - from, 0,
            extreme_right_x - intern_low_right_x, from - to, 0,
            0, to - from, 0,
            0, 0, 0
        ];

        //TODO no modifique esta parte pero creo que lo del 10 está mal y debería ser 1
        var texture_coord_buffer = [
            1 , 0,
            1 , 0,
            1 , 0,
            .8, 0,
            1 , 1,
            .8, 1,

            .8, 0,

            .3, 1,
            .3, 0,
            .3, 0,
            .1, 0,
            .3, 1,

            .1, 1,
            .1, 1,
            .1, 0,
            0 , 1,
            0 , 0,

            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
                
        var normal_buffer = [
            -1.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            -1.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            
            /*extreme_right_x, to, max_height,
            extreme_right_x, to, height,
            extreme_right_x, to, max_height,*/
            
            0.0, 0.0, 1.0,
            //extreme_right_x, from, max_height,extreme_right_x, from, max_height,
            
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0
        ];
        
        var binormal_buffer = getBinormalBufferFromVectors(normal_buffer, tangent_buffer);
        this.index_buffer = [];
        for (var i = 0; i < normal_buffer.length / 3; i++) {
            this.index_buffer.push(i);
        }

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer.itemSize = 3;
        this.webgl_binormal_buffer.numItems = binormal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = tangent_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = texture_coord_buffer.length / 2;
    }
    
    this.prepareDraw = function(shaderProgram, modelMatrix) {
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        // DIFFUSE MAP TEXTURE
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, veredaNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, shaderProgram) { 
        this.prepareDraw(shaderProgram, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function PlainRoadMiddle(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;

    this.initBuffers = function() {
        var middle_height = height + MIDDLE_HEIGHT_SEPARATION;
        var max_height = height + MAX_HEIGHT_SEPARATION;
        
        var extreme_left_x = (center_x + HALF_WIDTH);
        var extreme_right_x = (center_x - HALF_WIDTH);
        
        var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
        var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
        
        var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
        var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
        
        var position_buffer = [
            intern_low_left_x, from, middle_height,
            intern_low_left_x, from, middle_height,
            intern_low_right_x, from, middle_height,
            intern_low_left_x, to, middle_height,
            intern_low_right_x, to, middle_height,
            
            intern_low_right_x, to, middle_height,
            intern_low_right_x, to, height,
            intern_low_right_x, from, middle_height,
            intern_low_right_x, from, height,
            
            intern_low_right_x, from, height,
            intern_low_left_x, from, height,
            intern_low_right_x, to, height,
            intern_low_left_x, to, height,
            
            intern_low_left_x, to, height,
            intern_low_left_x, from, height,
            intern_low_left_x, to, middle_height,
            intern_low_left_x, from, middle_height
        ];
        
        //TODO nuevo
        var tangent_buffer = [
            0, 0, 0,
            intern_low_right_x - intern_low_left_x, 0, 0,
            intern_low_left_x - intern_low_right_x, to - from, 0,
            intern_low_right_x - intern_low_left_x, 0, 0,
            0, 0, 0,
            0, 0, height - middle_height,
            0, from - to, middle_height - height,
            0, 0, height - middle_height,
            0, 0, 0,
            intern_low_left_x - intern_low_right_x, 0, 0,
            intern_low_right_x - intern_low_left_x, to - from, 0,
            intern_low_left_x - intern_low_right_x, 0, 0,
            0, 0, 0,
            0, from - to, 0,
            0, to - from, middle_height - height,
            0, from - to, 0,
            0, 0, 0
        ];
        
        //TODO no cambie nada  
        var texture_coord_buffer = [
            0, 0,
            0, 0,
            1, 0,
            0, 1,
            1, 1,

            1, 1,
            1, 1,
            1, 1,
            1, 1,

            1, 1,
            1, 1,
            1, 1,
            1, 1,

            1, 1,
            1, 1,
            1, 1,
            1, 1
        ];
        
        var normal_buffer = [
            //intern_low_left_x, from, middle_height,
            -1.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            
            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, -1.0,
            
            1.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            -1.0, 0.0, -1.0,
            
            -1.0, 0.0, -1.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 1.0
        ];
        
        /*this.normal_buffer = [];
        calcNormals(this.position_buffer, this.normal_buffer);
        for (var i = 0; i < this.normal_buffer.length; i++) {
            this.normal_buffer[i] = -this.normal_buffer[i];
        }*/
        
        var binormal_buffer = getBinormalBufferFromVectors(normal_buffer, tangent_buffer);
        this.index_buffer = [];
        for (var i = 0; i < normal_buffer.length / 3; i++) {
            this.index_buffer.push(i);
        }

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer.itemSize = 3;
        this.webgl_binormal_buffer.numItems = binormal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = tangent_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = texture_coord_buffer.length / 2;
    }
    
    this.prepareDraw = function(shaderProgram, modelMatrix) {
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        // DIFFUSE MAP TEXTURE
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rutaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, rutaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, rutaNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, shaderProgram) { 
        this.prepareDraw(shaderProgram, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function CurvedRoadLeftBorder(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.binormal_buffer = [];
    this.texture_coord_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];
    //TODO nuevo
    this.tangent_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z, u, v) {        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);

        this.texture_coord_buffer.push(u);
        this.texture_coord_buffer.push(v);
    }
    
    this.fillNormalBuffer = function(x, y, z) {
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);
    }
    
    //TODO nuevo
    this.fillTangentBuffer = function(x, y, z) {
        this.tangent_buffer.push(x);
        this.tangent_buffer.push(y);
        this.tangent_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z, 0, 0);
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z, 1, 0);
            
        var radius = (to - from) / 2;
        for (var angle = -89; angle <= 90; angle++) {
            var vprevstep = (angle + 89.0) / 180.0;
            var vstep = (angle + 90.0) / 180.0;
            var theta = angle * 2 *  Math.PI / 360;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var this_step_y = from + radius + (radius * sinTheta);
            var this_step_z = base_height + (height * cosTheta);
            this.heights_along_road.push([this_step_y, this_step_z + MAX_HEIGHT_SEPARATION / 2]);
            var previous_step_y = from + radius + (radius * Math.sin((angle - 1) * 2 *  Math.PI / 360));
            var previous_step_z = base_height + (height * Math.cos((angle - 1) * 2 *  Math.PI / 360));

            var height_previous_step = previous_step_z;
            var max_height_previous_step = previous_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_previous_step = previous_step_z + MIDDLE_HEIGHT_SEPARATION;
            var height_this_step = this_step_z;
            var max_height_this_step = this_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_this_step = this_step_z + MIDDLE_HEIGHT_SEPARATION;
            
            //TODO comentado
            /*this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step, 0.2, vprevstep);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step, 0, vstep);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step, 0.2, vstep);*/
            

            //TODO agregados los últimos dos campos
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step, 0.2, vprevstep);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step, 0, vstep);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step, 0.2, vstep);
            
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step, 0.2, vprevstep);
            
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step, 0.7, vstep);
            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step, 0.7, vprevstep);
            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step, 0.7, vprevstep);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step, 0.9, vprevstep);
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step, 0.7, vstep);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step, 0.9, vstep);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step, 0.9, vstep);

            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step, 0.9, vprevstep);
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step, 1, vstep);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step, 1, vprevstep);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step, 1, vprevstep);
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step, 1, vstep);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step, 0, vstep);
        }
        
        for (var i = 0; i < 180 ; i++) {
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 1.0);
            this.fillNormalBuffer(1.0, 0.0, 1.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);  
            this.fillNormalBuffer(0.0, 0.0, -1.0);
            this.fillNormalBuffer(0.0, 0.0, -1.0);
            this.fillNormalBuffer(0.0, 0.0, -1.0);
            
            //TODO agregado
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(0.0, 0.0, max_height_previous_step - height_previous_step);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - max_height_previous_step);
            this.fillTangentBuffer(0.0, 0.0, max_height_this_step - height_this_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, max_height_previous_step - max_height_this_step);
            this.fillTangentBuffer(intern_high_left_x - extreme_left_x, this_step_y - previous_step_y, max_height_this_step - max_height_previous_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, max_height_previous_step - max_height_this_step);
            this.fillTangentBuffer(intern_low_left_x - intern_high_left_x, 0.0, middle_height_previous_step - max_height_previous_step);
            this.fillTangentBuffer(intern_high_left_x - intern_low_left_x, this_step_y - previous_step_y, max_height_this_step - middle_height_previous_step);
            this.fillTangentBuffer(intern_low_left_x - intern_high_left_x, 0.0, middle_height_this_step - max_height_this_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, middle_height_previous_step - middle_height_this_step);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - middle_height_previous_step);  
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, height_previous_step - height_this_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - height_previous_step);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - height_previous_step);
            this.fillTangentBuffer(extreme_left_x - intern_low_left_x, previous_step_y - this_step_y, height_previous_step - height_this_step);  
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - height_previous_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
        };
        
        this.binormal_buffer = getBinormalBufferFromVectors(this.normal_buffer, this.tangent_buffer);
        for (var index = 0; index < 180 * 20 ; index++) {
            this.index_buffer.push(index); 
        }

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer.itemSize = 3;
        this.webgl_binormal_buffer.numItems = this.binormal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;

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

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;
    }

    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }
    
    this.prepareDraw = function(shaderProgram, modelMatrix) {/*
        HAY 2 posiciones y 2 texturas mas que las normales y tangentes!

        console.log("tamanio buffer posicion: "+this.webgl_position_buffer.numItems);
        console.log("tamanio buffer normal: "+this.webgl_normal_buffer.numItems);
        console.log("tamanio buffer binormal: "+this.webgl_binormal_buffer.numItems);
        console.log("tamanio buffer tangente: "+this.webgl_tangent_buffer.numItems);
        console.log("tamanio buffer coordenadas: "+this.webgl_texture_coord_buffer.numItems);
        console.log("tamanio buffer index: "+this.webgl_index_buffer.numItems);*/
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, veredaNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, shaderProgram) { 
        this.prepareDraw(shaderProgram, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function CurvedRoadRightBorder(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.binormal_buffer = [];
    this.texture_coord_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];
    
    //TODO agregado
    this.tangent_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z, u, v) {        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);

        this.texture_coord_buffer.push(u);
        this.texture_coord_buffer.push(v);
    }
    
    this.fillNormalBuffer = function(x, y, z) {
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);
    }

    //TODO nuevo
    this.fillTangentBuffer = function(x, y, z) {
        this.tangent_buffer.push(x);
        this.tangent_buffer.push(y);
        this.tangent_buffer.push(z);
    }
    
    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z, 0, 0);
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z, 1, 0);
            
        var radius = (to - from) / 2;
        for (var angle = -89; angle <= 90; angle++) {
            var vprevstep = (angle + 89.0) / 180.0;
            var vstep = (angle + 90.0) / 180.0;
            var theta = angle * 2 *  Math.PI / 360;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var this_step_y = from + radius + (radius * sinTheta);
            var this_step_z = base_height + (height * cosTheta);
            this.heights_along_road.push([this_step_y, this_step_z + MAX_HEIGHT_SEPARATION / 2]);
            var previous_step_y = from + radius + (radius * Math.sin((angle - 1) * 2 *  Math.PI / 360));
            var previous_step_z = base_height + (height * Math.cos((angle - 1) * 2 *  Math.PI / 360));

            var height_previous_step = previous_step_z;
            var max_height_previous_step = previous_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_previous_step = previous_step_z + MIDDLE_HEIGHT_SEPARATION;
            var height_this_step = this_step_z;
            var max_height_this_step = this_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_this_step = this_step_z + MIDDLE_HEIGHT_SEPARATION;

            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(extreme_right_x, previous_step_y, max_height_previous_step, 0.2, vprevstep);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step, 0, vstep);
            this.fillBuffers(extreme_right_x, this_step_y, max_height_this_step, 0.2, vstep);
            
            this.fillBuffers(extreme_right_x, previous_step_y, max_height_previous_step, 0.2, vprevstep);
            
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step, 0.7, vstep);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step, 0.7, vprevstep);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step, 0.7, vprevstep);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step, 0.9, vprevstep);
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step, 0.7, vstep);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step, 0.9, vstep);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step, 0.9, vstep);

            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step, 0.9, vprevstep);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step, 1, vstep);
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step, 1, vprevstep);
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step, 1, vprevstep);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step, 1, vstep);
            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step, 0, vstep);
        }
        
        for (var i = 0; i < 180 ; i++) {
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            this.fillNormalBuffer(1.0, 0.0, 1.0);
            this.fillNormalBuffer(1.0, 0.0, 1.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 1.0, 0.0);
            this.fillNormalBuffer(1.0, 1.0, 0.0);
            this.fillNormalBuffer(1.0, 1.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);  
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(0.0, 0.0, -1.0);
            
            //TODO agregado
            this.fillTangentBuffer(0.0, 0.0, max_height_previous_step - height_previous_step);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - max_height_previous_step);
            this.fillTangentBuffer(0.0, 0.0, max_height_this_step - height_this_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, max_height_previous_step - max_height_this_step);
            this.fillTangentBuffer(intern_high_right_x - extreme_right_x, this_step_y - previous_step_y, max_height_this_step - max_height_previous_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, max_height_previous_step - max_height_this_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(intern_low_right_x - intern_high_right_x, 0.0, middle_height_previous_step - max_height_previous_step);
            this.fillTangentBuffer(intern_high_right_x - intern_low_right_x, this_step_y - previous_step_y, max_height_this_step - middle_height_previous_step);
            this.fillTangentBuffer(intern_low_right_x - intern_high_right_x, 0.0, middle_height_this_step - max_height_this_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, middle_height_previous_step - middle_height_this_step);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - middle_height_previous_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, height_previous_step - height_this_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - height_previous_step);
            this.fillTangentBuffer(extreme_right_x - intern_low_right_x, previous_step_y - this_step_y, height_previous_step - height_this_step);  
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, height_this_step - height_previous_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
        };
        
        this.binormal_buffer = getBinormalBufferFromVectors(this.normal_buffer, this.tangent_buffer);
        for (var index = 0; index < this.normal_buffer.length / 3 ; index++) {
            this.index_buffer.push(index); 
        }

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer.itemSize = 3;
        this.webgl_binormal_buffer.numItems = this.binormal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;

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

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;
    }

    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }

    this.prepareDraw = function(shaderProgram, modelMatrix) {/*
        HAY 2 posiciones y 2 texturas mas que las normales y tangentes
        
        console.log("tamanio buffer posicion: "+this.webgl_position_buffer.numItems);
        console.log("tamanio buffer normal: "+this.webgl_normal_buffer.numItems);
        console.log("tamanio buffer binormal: "+this.webgl_binormal_buffer.numItems);
        console.log("tamanio buffer tangente: "+this.webgl_tangent_buffer.numItems);
        console.log("tamanio buffer coordenadas: "+this.webgl_texture_coord_buffer.numItems);
        console.log("tamanio buffer index: "+this.webgl_index_buffer.numItems);*/
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        // DIFFUSE MAP TEXTURE
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, veredaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, veredaNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, shaderProgram) { 
        this.prepareDraw(shaderProgram, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function CurvedRoadMiddle(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.binormal_buffer = [];
    this.texture_coord_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];
    
    //TODO agregado
    this.tangent_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z, u, v) {        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);

        this.texture_coord_buffer.push(u);
        this.texture_coord_buffer.push(v);
    }
    
    this.fillNormalBuffer = function(x, y, z) {
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);
    }
    
    //TODO nuevo
    this.fillTangentBuffer = function(x, y, z) {
        this.tangent_buffer.push(x);
        this.tangent_buffer.push(y);
        this.tangent_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z, 0, 0);
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z, 1, 0);
            
        var radius = (to - from) / 2;
        for (var angle = -89.0; angle <= 90.0; angle++) {
            var vprevstep = (angle + 89.0) / 180.0;
            var vstep = (angle + 90.0) / 180.0;
            var theta = angle * 2 *  Math.PI / 360;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var this_step_y = from + radius + (radius * sinTheta);
            var this_step_z = base_height + (height * cosTheta);
            this.heights_along_road.push([this_step_y, this_step_z + MAX_HEIGHT_SEPARATION / 2]);
            var previous_step_y = from + radius + (radius * Math.sin((angle - 1) * 2 *  Math.PI / 360));
            var previous_step_z = base_height + (height * Math.cos((angle - 1) * 2 *  Math.PI / 360));

            var height_previous_step = previous_step_z;
            var max_height_previous_step = previous_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_previous_step = previous_step_z + MIDDLE_HEIGHT_SEPARATION;
            var height_this_step = this_step_z;
            var max_height_this_step = this_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_this_step = this_step_z + MIDDLE_HEIGHT_SEPARATION;            
            
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step, 1, vprevstep);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step, 0, vstep);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step, 1, vstep);
            
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step, 1, vstep);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step, 1, vstep);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step, 1, vprevstep);
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step, 1, vprevstep);
            
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step, 1, 1);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step, 1, 1);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step, 1, 1);
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step, 1, 1);
            
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step, 0, vstep);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step, 0, vprevstep);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step, 0, vstep);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step, 0, vprevstep);

            
            var aux_y, aux_z;
            aux_y = this_step_y - previous_step_y;
            if (angle > 0) {
                aux_z = height_previous_step - height_this_step;
            } else {
                aux_z = height_this_step - height_previous_step;
            }
            this.fillNormalBuffer(-aux_z, aux_y, aux_z);
            this.fillNormalBuffer(0.0, aux_y, aux_z);
            this.fillNormalBuffer(0.0, aux_y, aux_z);
            this.fillNormalBuffer(0.0, aux_y, aux_z);
            
            this.fillNormalBuffer(0.0, aux_y, aux_z);
            this.fillNormalBuffer(0.0, aux_y, aux_z);
            this.fillNormalBuffer(aux_z, 0.0, 0.0);
            this.fillNormalBuffer(aux_z, 0.0, 0.0);
            
            this.fillNormalBuffer(aux_z, 0.0, -aux_z);
            this.fillNormalBuffer(0.0, -aux_y, -aux_z);
          //  TODO::  Comento la linea esta solo para dibujar la ruta, no se si sobra
          //  this.fillNormalBuffer(0.0, -aux_y, -aux_z);
            this.fillNormalBuffer(0.0, -aux_y, -aux_z);
            
            this.fillNormalBuffer(0.0, -aux_y, -aux_z);
            this.fillNormalBuffer(-aux_z, 0.0, -aux_z);
            this.fillNormalBuffer(-aux_z, 0.0, 0.0);
            this.fillNormalBuffer(-aux_z, aux_y, aux_z);
            
            //TODO agregado
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            this.fillTangentBuffer(intern_low_left_x - intern_low_right_x, this_step_y - previous_step_y, middle_height_this_step - middle_height_previous_step);
            this.fillTangentBuffer(intern_low_right_x - intern_low_left_x, 0.0, 0.0);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            
            this.fillTangentBuffer(0.0, 0.0, height_this_step - middle_height_this_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, middle_height_previous_step - height_this_step);
            this.fillTangentBuffer(0.0, 0.0, height_previous_step - middle_height_previous_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            
            this.fillTangentBuffer(intern_low_left_x - intern_low_right_x, 0.0, 0.0);
            this.fillTangentBuffer(intern_low_right_x - intern_low_left_x, this_step_y - previous_step_y, height_this_step - height_previous_step);
          //  TODO::  Comento la linea esta solo para dibujar la ruta, no se si sobra
            //this.fillTangentBuffer(intern_low_left_x - intern_low_right_x, 0.0, 0.0);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
            
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, height_previous_step - height_this_step);
            this.fillTangentBuffer(0.0, this_step_y - previous_step_y, middle_height_this_step - height_previous_step);
            this.fillTangentBuffer(0.0, previous_step_y - this_step_y, middle_height_previous_step - middle_height_this_step);
            this.fillTangentBuffer(0.0, 0.0, 0.0);
        }
  
        this.binormal_buffer = getBinormalBufferFromVectors(this.normal_buffer, this.tangent_buffer);
        for (var index = 0; index < this.normal_buffer.length / 3 ; index++) {
            this.index_buffer.push(index); 
        }

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer.itemSize = 3;
        this.webgl_binormal_buffer.numItems = this.binormal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;

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

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;
    }

    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }
    
    this.prepareDraw = function(shaderProgram, modelMatrix) {
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        // DIFFUSE MAP TEXTURE
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rutaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, rutaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, rutaNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, shaderProgram) { 
        this.prepareDraw(shaderProgram, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function Road(base_height, max_height, center_x, from, to) {
    var plain_road_left_border_one = new PlainRoadLeftBorder(base_height, center_x, BOTTOM_BORDER_MAP, from);
    plain_road_left_border_one.initBuffers();
    var plain_road_middle_one = new PlainRoadMiddle(base_height, center_x, BOTTOM_BORDER_MAP, from);
    plain_road_middle_one.initBuffers();
    var plain_road_right_border_one = new PlainRoadRightBorder(base_height, center_x, BOTTOM_BORDER_MAP, from);
    plain_road_right_border_one.initBuffers();
    
    var curved_road_left_border = new CurvedRoadLeftBorder(base_height, max_height, center_x, from, to);
    curved_road_left_border.initBuffers();
    var curved_road_middle = new CurvedRoadMiddle(base_height, max_height, center_x, from, to);
    curved_road_middle.initBuffers();
    var curved_road_right_border = new CurvedRoadRightBorder(base_height, max_height, center_x, from, to);
    curved_road_right_border.initBuffers();
    
    var plain_road_left_border_two = new PlainRoadLeftBorder(base_height, center_x, to, TOP_BORDER_MAP);
    plain_road_left_border_two.initBuffers();
    var plain_road_middle_two = new PlainRoadMiddle(base_height, center_x, to, TOP_BORDER_MAP);
    plain_road_middle_two.initBuffers();
    var plain_road_right_border_two = new PlainRoadRightBorder(base_height, center_x, to, TOP_BORDER_MAP);
    plain_road_right_border_two.initBuffers();
    
    this.draw = function(modelMatrix, shaderProgram) {
        plain_road_left_border_one.draw(modelMatrix, shaderProgram);
        plain_road_middle_one.draw(modelMatrix, shaderProgram, shaderProgram);
        plain_road_right_border_one.draw(modelMatrix, shaderProgram);

        curved_road_left_border.draw(modelMatrix, shaderProgram);
        curved_road_middle.draw(modelMatrix, shaderProgram);
        curved_road_right_border.draw(modelMatrix, shaderProgram);

        plain_road_left_border_two.draw(modelMatrix, shaderProgram);
        plain_road_middle_two.draw(modelMatrix, shaderProgram);
        plain_road_right_border_two.draw(modelMatrix, shaderProgram);
    }
    
    this.getHeightsAlongRoad = function() {
       return curved_road_left_border.getHeightsAlongRoad();
    }
}