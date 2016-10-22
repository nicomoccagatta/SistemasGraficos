const MIDDLE_HEIGHT_SEPARATION = 0.6;
const MAX_HEIGHT_SEPARATION = 0.85;
const INTERN_LOW_BORDER = 1.3;
const INTERN_HIGH_BORDER = 1;
const HALF_WIDTH = 5;
const FIRST_PLAIN_ROAD_BEGIN = -80;
const SECOND_PLAIN_ROAD_END = 80;

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
        
        this.normal_buffer = this.position_buffer;
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(0.5);
            this.color_buffer.push(0.5);
            this.color_buffer.push(0.5);
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
        this.normal_buffer.push(x);
        this.normal_buffer.push(y);
        this.normal_buffer.push(z);

        this.color_buffer.push(0.5)
        this.color_buffer.push(0.5)
        this.color_buffer.push(0.5)
        
        this.position_buffer.push(x);
        this.position_buffer.push(y);
        this.position_buffer.push(z);
    }

    this.initBuffers = function() {
        var y = from;
        var z = base_height;
        var x = extreme_left_x; 
        this.fillBuffers(x, y, z);
            
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
            
            y = this_step_y;
            z = this_step_z;

            x = extreme_left_x;
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
            this.fillBuffers(x, y, z);
            
            x = extreme_right_x;
            this.fillBuffers(x, y, z);
        }

        for (var index = 0; index < 180 * 30 + 2; index++) {
            this.index_buffer.push(index);
        }
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
    var plain_road_one = new PlainRoad(base_height, center_x, FIRST_PLAIN_ROAD_BEGIN, from);
    plain_road_one.initBuffers();
    var curved_road = new CurvedRoad(base_height, max_height, center_x, from, to);
    curved_road.initBuffers();
    var plain_road_two = new PlainRoad(base_height, center_x, to, SECOND_PLAIN_ROAD_END);
    plain_road_two.initBuffers();
    
    this.setupShaders = function() {
        plain_road_one.setupShaders();
        curved_road.setupShaders();
        plain_road_two.setupShaders();
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        plain_road_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        curved_road.setupLighting(lightPosition, ambientColor, diffuseColor);
        plain_road_two.setupLighting(lightPosition, ambientColor, diffuseColor);
    }

    this.draw = function(modelMatrix) { 
        plain_road_one.draw(modelMatrix);
        curved_road.draw(modelMatrix);
        plain_road_two.draw(modelMatrix);
    }
    
    this.getHeightsAlongRoad = function() {
        return curved_road.getHeightsAlongRoad();
    }
}