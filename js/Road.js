const MIDDLE_HEIGHT_SEPARATION = 0.6;
const MAX_HEIGHT_SEPARATION = 0.85;
const INTERN_LOW_BORDER = 1.3;
const INTERN_HIGH_BORDER = 1;
const HALF_WIDTH = 5;
const ROAD_COLOR = 0.5;




function PlainRoadLeftBorder(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
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
        
        this.position_buffer = [
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, from, max_height,
            extreme_left_x, to, height,
            extreme_left_x, to, max_height,
            
            /*extreme_left_x, to, max_height,
            extreme_left_x, to, height,
            extreme_left_x, to, max_height,*/
            
            extreme_left_x, from, max_height,
            //extreme_left_x, from, max_height,extreme_left_x, from, max_height,
            
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
        
        /*this.normal_buffer = [];
        calcNormals(this.position_buffer, this.normal_buffer);
        for (var i = 0; i < this.normal_buffer.length; i++) {
            this.normal_buffer[i] = -this.normal_buffer[i];
        }*/
        
        
        this.normal_buffer = [
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
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.index_buffer.push(i);
        }
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function() {
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}




function PlainRoadRightBorder(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
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
        
        this.position_buffer = [
            extreme_right_x, from, height,
            extreme_right_x, from, height,
            extreme_right_x, from, height,
            extreme_right_x, from, max_height,
            extreme_right_x, to, height,
            extreme_right_x, to, max_height,
            
            /*extreme_right_x, to, max_height,
            extreme_right_x, to, height,
            extreme_right_x, to, max_height,*/
            
            extreme_right_x, from, max_height,
            //extreme_right_x, from, max_height,extreme_right_x, from, max_height,
            
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
        
        /*this.normal_buffer = [];
        calcNormals(this.position_buffer, this.normal_buffer);
        for (var i = 0; i < this.normal_buffer.length; i++) {
            this.normal_buffer[i] = -this.normal_buffer[i];
        }*/
        
        this.normal_buffer = [
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
        
        
        
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.index_buffer.push(i);
        }
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function() {
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}





function PlainRoadMiddle(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
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
        
        this.position_buffer = [
            //intern_low_left_x, from, middle_height,
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
        
        
        
        this.normal_buffer = [
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
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.index_buffer.push(i);
        }
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function() {
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}






//Height seria ph1 segun el enunciado.
function PlainRoad(height, center_x, from, to) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
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
        
        this.position_buffer = [
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            intern_high_left_x, from, height,
            extreme_left_x, from, max_height,
            intern_high_left_x, from, max_height,
            
            intern_high_left_x, from, max_height,
            intern_high_left_x, from, middle_height,
            intern_low_left_x, from, middle_height,
            intern_high_left_x, from, middle_height,
            
            intern_high_left_x, from, middle_height,
            intern_high_left_x, from, height,
            intern_high_right_x, from, middle_height,
            intern_high_right_x, from, height,
            
            intern_high_right_x, from, max_height,
            intern_high_right_x, from, max_height,
            intern_low_right_x, from, middle_height,
            intern_high_right_x, from, middle_height,
            
            intern_high_right_x, from, max_height,
            intern_high_right_x, from, height,
            extreme_right_x, from, max_height,
            extreme_right_x, from, height,
            
            extreme_right_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, from, height,
            extreme_left_x, to, height,
            extreme_left_x, from, max_height,
            extreme_left_x, to, max_height,
            
            intern_high_left_x, from, max_height,
            intern_high_left_x, to, max_height,
            intern_low_left_x, from, middle_height,
            intern_low_left_x, to, middle_height,
            
            intern_low_right_x, from, middle_height,
            intern_low_right_x, to, middle_height,
            intern_high_right_x, from, max_height,
            intern_high_right_x, to, max_height,
            
            intern_low_right_x, from, middle_height,
            intern_low_right_x, to, middle_height,
            intern_high_right_x, from, max_height,
            intern_high_right_x, to, max_height,
            
            extreme_right_x, from, max_height,
            extreme_right_x, to, max_height,
            extreme_right_x, from, height,
            extreme_right_x, to, height,
            
            extreme_left_x, from, height,
            extreme_left_x, to, height,
            
            extreme_left_x, to, height,
            intern_high_left_x, to, height,
            extreme_left_x, to, max_height,
            intern_high_left_x, to, max_height,
            
            intern_high_left_x, to, max_height,
            intern_high_left_x, to, middle_height,
            intern_low_left_x, to, middle_height,
            intern_high_left_x, to, middle_height,
            
            intern_high_left_x, to, middle_height,
            intern_high_left_x, to, height,
            intern_high_right_x, to, middle_height,
            intern_high_right_x, to, height,
            
            intern_high_right_x, to, max_height,
            intern_high_right_x, to, max_height,
            intern_low_right_x, to, middle_height,
            intern_high_right_x, to, middle_height,
            
            intern_high_right_x, to, max_height,
            intern_high_right_x, to, height,
            extreme_right_x, to, max_height,
            extreme_right_x, to, height
        ];
        
        this.normal_buffer = [];
        calcNormals(this.position_buffer, this.normal_buffer);
        //this.normal_buffer = this.position_buffer;
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.color_buffer.push(ROAD_COLOR);
            this.index_buffer.push(i);
        }
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function() {
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}










function CurvedRoadLeftBorder(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z) {
        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);
    }
    
    this.fillNormalBuffer = function(x, y, z) {
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z);
        /*this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);*/
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z);
            
        var radius = (to - from) / 2;
        for (var angle = -89; angle <= 90; angle++) {
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
            
            
            

            //this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);
            
            
            /*this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);*/

            
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step);
            
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);

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
        };
        
        for (var index = 0; index < 180 * 20 ; index++) {
            this.index_buffer.push(index); 
        }
        
        
        //calcNormals(this.position_buffer, this.normal_buffer);
    }

    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function(){
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}




function CurvedRoadRightBorder(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z) {
        /*this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);*/

        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);
    }
    
    this.fillNormalBuffer = function(x, y, z) {
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z);
        /*this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);*/
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z);
            
        var radius = (to - from) / 2;
        for (var angle = -89; angle <= 90; angle++) {
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
            
            

            //this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            //this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_right_x, this_step_y, max_height_this_step);
            
            /*this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);*/

            
            this.fillBuffers(extreme_right_x, previous_step_y, max_height_previous_step);
            
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step);

        }

        for (var index = 0; index < 180 * 19 ; index++) {
            this.index_buffer.push(index);
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
        };
        
        //calcNormals(this.position_buffer, this.normal_buffer);
    }

    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function(){
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}





function CurvedRoadMiddle(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z) {
        /*this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);*/

        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);
    }
    
    this.fillNormalBuffer = function(x, y, z) {
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z);
        /*this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);*/
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z);
            
        var radius = (to - from) / 2;
        for (var angle = -89; angle <= 90; angle++) {
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

            //this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            //this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            
            
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step);
            
            
            
            this.fillBuffers(intern_low_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_right_x, this_step_y, height_this_step);
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step);
            
            this.fillBuffers(intern_low_left_x, this_step_y, height_this_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            
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
            this.fillNormalBuffer(0.0, -aux_y, -aux_z);
            this.fillNormalBuffer(0.0, -aux_y, -aux_z);
            
            this.fillNormalBuffer(0.0, -aux_y, -aux_z);
            this.fillNormalBuffer(-aux_z, 0.0, -aux_z);
            this.fillNormalBuffer(-aux_z, 0.0, 0.0);
            this.fillNormalBuffer(-aux_z, aux_y, aux_z);
        }

        for (var index = 0; index < 180 * 16 ; index++) {
            this.index_buffer.push(index);
        }
        
        /*for (var i = 0; i < 180 ; i++) {
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            this.fillNormalBuffer(0.0, 0.0, 1.0);
            
            this.fillNormalBuffer(1.0, 0.0, 1.0);
            this.fillNormalBuffer(1.0, 0.0, 1.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            this.fillNormalBuffer(1.0, 0.0, 0.0);
            
            this.fillNormalBuffer(1.0, 0.0, -1.0);
            this.fillNormalBuffer(1.0, 0.0, -1.0);
            this.fillNormalBuffer(0.0, 0.0, -1.0);
            this.fillNormalBuffer(0.0, 0.0, -1.0);
            
            this.fillNormalBuffer(-1.0, 0.0, -1.0);
            this.fillNormalBuffer(-1.0, 0.0, -1.0);
            this.fillNormalBuffer(-1.0, 0.0, 0.0);
            this.fillNormalBuffer(-1.0, 0.0, 1.0);
            //this.fillNormalBuffer(-1.0, 0.0, 1.0);  
        };*/
        
        //calcNormals(this.position_buffer, this.normal_buffer);
    }

    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function(){
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}






function CurvedRoad(base_height, max_height, center_x, from, to) {
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];
    this.heights_along_road = [[]];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    var height = max_height - base_height;
    
    var extreme_right_x = (center_x - HALF_WIDTH);
    var extreme_left_x = (center_x + HALF_WIDTH);
    
    var intern_low_right_x = (extreme_right_x + INTERN_LOW_BORDER);
    var intern_low_left_x = (extreme_left_x - INTERN_LOW_BORDER);
    
    var intern_high_right_x = (extreme_right_x + INTERN_HIGH_BORDER);
    var intern_high_left_x = (extreme_left_x - INTERN_HIGH_BORDER);
    
    this.fillBuffers = function(x, y, z) {
        /*this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);*/

        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        this.color_buffer.push(ROAD_COLOR)
        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z);
        /*this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);
        this.fillBuffers(x, y, z);*/
            
        x = extreme_right_x;
        this.fillBuffers(x, y, z);
            
        var radius = (to - from) / 2;
        for (var angle = -89; angle <= 90; angle++) {
            var theta = angle * 2 *  Math.PI / 360;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var this_step_y = from + radius + (radius * sinTheta);
            var this_step_z = base_height + (height * cosTheta);
            this.heights_along_road.push([this_step_y, this_step_z + MAX_HEIGHT_SEPARATION / 2]);
            var previous_step_y = from + radius + (radius * Math.sin((angle - 1) * 2 *  Math.PI / 360));
            var previous_step_z = base_height + (height * Math.cos((angle - 1) * 2 *  Math.PI / 360));

            /*y = this_step_y;
            z = this_step_z;
            
            x = extreme_left_x;*/
            
            
            
            
            var height_previous_step = previous_step_z;
            var max_height_previous_step = previous_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_previous_step = previous_step_z + MIDDLE_HEIGHT_SEPARATION;
            var height_this_step = this_step_z;
            var max_height_this_step = this_step_z + MAX_HEIGHT_SEPARATION;
            var middle_height_this_step = this_step_z + MIDDLE_HEIGHT_SEPARATION;
            
            
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step);
            
            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, middle_height_previous_step);

            this.fillBuffers(intern_high_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_high_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, height_previous_step);
            
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, middle_height_previous_step);
            
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step);
            
            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);

            this.fillBuffers(intern_high_left_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_low_left_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step);

            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            
            this.fillBuffers(intern_low_right_x, previous_step_y, middle_height_previous_step);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_high_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            
            this.fillBuffers(extreme_right_x, previous_step_y, max_height_previous_step);
            this.fillBuffers(extreme_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(extreme_right_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step);
            
            this.fillBuffers(extreme_left_x, previous_step_y, height_previous_step);
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);
            
            this.fillBuffers(extreme_left_x, this_step_y, height_this_step);
            this.fillBuffers(intern_high_left_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step);
            
            this.fillBuffers(intern_high_left_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_high_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_low_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_high_left_x, this_step_y, middle_height_this_step);
            
            this.fillBuffers(intern_high_left_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_high_left_x, this_step_y, height_this_step);
            this.fillBuffers(intern_high_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_high_right_x, this_step_y, height_this_step);

            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_low_right_x, this_step_y, middle_height_this_step);
            this.fillBuffers(intern_high_right_x, this_step_y, middle_height_this_step);
            
            this.fillBuffers(intern_high_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(intern_high_right_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_right_x, this_step_y, max_height_this_step);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step);
            
            
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step);
            this.fillBuffers(extreme_right_x, this_step_y, height_this_step);
            
            
            
            
            
            
            
            
            
            
            
            
            
            /*this.fillBuffers(x, y, z);
            this.fillBuffers(x, y, z);
            
            x = extreme_right_x;
            this.fillBuffers(x, y, z);
            
            this.fillBuffers(x, y, z);
            z = this_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            y = previous_step_y;
            z = previous_step_z;
            this.fillBuffers(x, y, z);
            
            z = previous_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            
            x = intern_high_right_x;
            this.fillBuffers(x, y, z);
            
            x = extreme_right_x;
            z = this_step_z + MAX_HEIGHT_SEPARATION;
            y = this_step_y;
            this.fillBuffers(x, y, z);
            x = intern_high_right_x;
            this.fillBuffers(x, y, z);
            
            z = this_step_z + MIDDLE_HEIGHT_SEPARATION;
            x = intern_low_right_x;
            this.fillBuffers(x, y, z);
            
            z = previous_step_z + MAX_HEIGHT_SEPARATION;
            x = intern_high_right_x;
            y = previous_step_y;
            this.fillBuffers(x, y, z);
            
            z = previous_step_z + MIDDLE_HEIGHT_SEPARATION;
            x = intern_low_right_x;
            this.fillBuffers(x, y, z);

            this.fillBuffers(x, y, z);

            y = this_step_y;
            z = this_step_z + MIDDLE_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            
            z = previous_step_z + MIDDLE_HEIGHT_SEPARATION;
            y = previous_step_y;
            x = intern_low_left_x;
            this.fillBuffers(x, y, z);

            y = this_step_y;
            z = this_step_z + MIDDLE_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            
            x = intern_high_left_x;
            y = previous_step_y;
            z = previous_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);

            y = this_step_y;
            z = this_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            
            x = extreme_left_x;
            y = previous_step_y;
            z = previous_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);

            y = this_step_y;
            z = this_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            
            this.fillBuffers(x, y, z);
            
            z = this_step_z;
            this.fillBuffers(x, y, z);
            
            y = previous_step_y;
            z = previous_step_z + MAX_HEIGHT_SEPARATION;
            this.fillBuffers(x, y, z);
            
            z = previous_step_z;
            this.fillBuffers(x, y, z);
            
            this.fillBuffers(x, y, z);
            
            y = this_step_y;
            z = this_step_z;
            this.fillBuffers(x, y, z);
            
            this.fillBuffers(x, y, z);
            this.fillBuffers(x, y, z);
            //this.fillBuffers(x, y, z);
            
            x = extreme_right_x;
            this.fillBuffers(x, y, z);*/
        }

        for (var index = 0; index < 180 * 68 ; index++) {
            this.index_buffer.push(index);
        }
        
        
        calcNormals(this.position_buffer, this.normal_buffer);
    }
    
    this.getHeightsAlongRoad = function() {
        return this.heights_along_road;
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;
    }

    this.setupShaders = function(){
        gl.useProgram(shaderProgramColoredObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);
    }

    this.draw = function(modelMatrix) { 
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}



function Road(base_height, max_height, center_x, from, to) {
    //var plain_road_one = new PlainRoad(base_height, center_x, BOTTOM_BORDER_MAP, from);
    //plain_road_one.initBuffers();
    var plain_road_left_border_one = new PlainRoadLeftBorder(base_height, center_x, BOTTOM_BORDER_MAP, from);
    plain_road_left_border_one.initBuffers();
    var plain_road_middle_one = new PlainRoadMiddle(base_height, center_x, BOTTOM_BORDER_MAP, from);
    plain_road_middle_one.initBuffers();
    var plain_road_right_border_one = new PlainRoadRightBorder(base_height, center_x, BOTTOM_BORDER_MAP, from);
    plain_road_right_border_one.initBuffers();
    
    //var curved_road = new CurvedRoad(base_height, max_height, center_x, from, to);
    //curved_road.initBuffers();
    var curved_road_left_border = new CurvedRoadLeftBorder(base_height, max_height, center_x, from, to);
    curved_road_left_border.initBuffers();
    var curved_road_middle = new CurvedRoadMiddle(base_height, max_height, center_x, from, to);
    curved_road_middle.initBuffers();
    var curved_road_right_border = new CurvedRoadRightBorder(base_height, max_height, center_x, from, to);
    curved_road_right_border.initBuffers();
    
    //var plain_road_two = new PlainRoad(base_height, center_x, to, TOP_BORDER_MAP);
    //plain_road_two.initBuffers();
    var plain_road_left_border_two = new PlainRoadLeftBorder(base_height, center_x, to, TOP_BORDER_MAP);
    plain_road_left_border_two.initBuffers();
    var plain_road_middle_two = new PlainRoadMiddle(base_height, center_x, to, TOP_BORDER_MAP);
    plain_road_middle_two.initBuffers();
    var plain_road_right_border_two = new PlainRoadRightBorder(base_height, center_x, to, TOP_BORDER_MAP);
    plain_road_right_border_two.initBuffers();
    
    this.setupShaders = function() {
        //plain_road_one.setupShaders();
        plain_road_left_border_one.setupShaders();
        plain_road_middle_one.setupShaders();
        plain_road_right_border_one.setupShaders();
        
        //curved_road.setupShaders();
        curved_road_left_border.setupShaders();
        curved_road_middle.setupShaders();
        curved_road_right_border.setupShaders();
        
        //plain_road_two.setupShaders();
        plain_road_left_border_two.setupShaders();
        plain_road_middle_two.setupShaders();
        plain_road_right_border_two.setupShaders();
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        //plain_road_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_left_border_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_middle_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_right_border_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        
        //curved_road.setupLighting(lightPosition, ambientColor, diffuseColor);
        curved_road_left_border.setupLighting(lightPosition, ambientColor, diffuseColor);
        curved_road_middle.setupLighting(lightPosition, ambientColor, diffuseColor);
        curved_road_right_border.setupLighting(lightPosition, ambientColor, diffuseColor);
        
        //plain_road_two.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_left_border_two.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_middle_two.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_right_border_two.setupLighting(lightPosition, ambientColor, diffuseColor);
    }

    this.draw = function(modelMatrix) { 
        //plain_road_one.draw(modelMatrix);
        plain_road_left_border_one.draw(modelMatrix);
        plain_road_middle_one.draw(modelMatrix);
        plain_road_right_border_one.draw(modelMatrix);
        
        //curved_road.draw(modelMatrix);
        curved_road_left_border.draw(modelMatrix);
        curved_road_middle.draw(modelMatrix);
        curved_road_right_border.draw(modelMatrix);
        
        //plain_road_two.draw(modelMatrix);
        plain_road_left_border_two.draw(modelMatrix);
        plain_road_middle_two.draw(modelMatrix);
        plain_road_right_border_two.draw(modelMatrix);
    }
    
    this.getHeightsAlongRoad = function() {
        return curved_road_left_border.getHeightsAlongRoad();
    }
}