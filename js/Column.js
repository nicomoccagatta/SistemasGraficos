const HEIGHT_BASE_COLUMN_TWO = 0.5;
const MIN_HEIGHT = 0;
const DELIMITER_DIFF = 0.4;





function calcNormals(source, destination) {
    var subtract = function (a, b) {
        var vec3 = new Array(3);
        vec3[0] = a[0] - b[0],
        vec3[1] = a[1] - b[1],
        vec3[2] = a[2] - b[2];
        return vec3;
    }

    var crossProduct = function (a, b) {
        var vec3 = new Array(3);
        vec3[0] = a[1] * b[2] - a[2] * b[1];
        vec3[1] = a[2] * b[0] - a[0] * b[2];
        vec3[2] = a[0] * b[1] - a[1] * b[0];
        return vec3;
    }

    var normalize = function (a) {
        var vec3 = new Array(3);
        var len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        vec3[0] = a[0] / len;
        vec3[1] = a[1] / len;
        vec3[2] = a[2] / len;
        return vec3;
    }
    
    
            for (var j = 0; j < 2; j++) {
                //destination.push(v_normal[0], v_normal[1], v_normal[2]);
                destination.push(0, 0, 0);
            }
    
    for (var i = 0; i < source.length - 6/*Math.floor(source.length / 3)*/; i += 3) {
        //console.log(i);
        //console.log(source.length);
        var index = i //* 3;
        
        var v1 = [
         source[index],
         source[index + 1],
         source[index + 2]
        ];
        
        var v2 = [
          source[index + 3],
          source[index + 4],
          source[index + 5]
        ];
        
        var v3 = [
          source[index + 6],
          source[index + 7],
          source[index + 8]
        ];
        
        
        if ((i % 2) != 0) {
            v1 = (-v1);
            v2 = (-v2);
            v3 = (-v3);
        }
        
        
        
        var u = subtract(v2, v1);
        var v = subtract(v3, v1);
        var v_final = crossProduct(u, v);
        var v_normal = normalize(v_final);
        
        //for (var j = 0; j < 3; j++) {
        destination.push(v_normal[0], v_normal[1], v_normal[2]);
        //}
        
        
        
        /*if ((i + 3) >= (source.length - 6)) {
            for (var j = 0; j < 2; j++) {
                //destination.push(v_normal[0], v_normal[1], v_normal[2]);
                destination.push(0, 0, 0);
            }
        }*/

        /*if (((i + 1) != source.length / 3) && (i + 2) > Math.floor(source.length / 9)) {
            var extra = (source.length - Math.floor(source.length / 9) * 9);
            index += extra;
            
            v1 = [
             source[index],
             source[index + 1],
             source[index + 2]
            ];
            
            v2 = [
              source[index + 3],
              source[index + 4],
              source[index + 5]
            ];
            
            v3 = [
              source[index + 6],
              source[index + 7],
              source[index + 8]
            ];
            
            u = subtract(v2, v1);
            v = subtract(v3, v1);
            v_final = crossProduct(u, v);
            v_normal = normalize(v_final);
            
            for (var j = 0; j < (extra / 3); j++) {
                destination.push(v_normal[0], v_normal[1], v_normal[2]);
            }
        }*/
    }

    /*for (var i = 0; i < Math.floor(source.length / 9); i++) {
        var index = i * 9;
        
        var v1 = [
         source[index],
         source[index + 1],
         source[index + 2]
        ];
        
        var v2 = [
          source[index + 3],
          source[index + 4],
          source[index + 5]
        ];
        
        var v3 = [
          source[index + 6],
          source[index + 7],
          source[index + 8]
        ];
        
        var u = subtract(v2, v1);
        var v = subtract(v3, v1);
        var v_final = crossProduct(u, v);
        var v_normal = normalize(v_final);
        
        for (var j = 0; j < 3; j++) {
            destination.push(v_normal[0], v_normal[1], v_normal[2]);
        }
        
        

        if (((i + 1) != source.length / 9) && (i + 2) > Math.floor(source.length / 9)) {
            var extra = (source.length - Math.floor(source.length / 9) * 9);
            index += extra;
            
            v1 = [
             source[index],
             source[index + 1],
             source[index + 2]
            ];
            
            v2 = [
              source[index + 3],
              source[index + 4],
              source[index + 5]
            ];
            
            v3 = [
              source[index + 6],
              source[index + 7],
              source[index + 8]
            ];
            
            u = subtract(v2, v1);
            v = subtract(v3, v1);
            v_final = crossProduct(u, v);
            v_normal = normalize(v_final);
            
            for (var j = 0; j < (extra / 3); j++) {
                destination.push(v_normal[0], v_normal[1], v_normal[2]);
            }
        }
    }*/
    
    
    
    
    
    /*var normalize = function (a) {
        var vec3 = new Array(3);
        var len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        vec3[0] = a[0] / len;
        vec3[1] = a[1] / len;
        vec3[2] = a[2] / len;
        return vec3;
    }
    
    
    for (var i = 0; i < source.length; i += 3) {
        var normal = [0, 0, 0];
        var vertex_one = [source[i], source[i + 1], source[i + 2]];
        var vertex_two = [source[(i + 3) % source.length], source[(i + 4) % source.length], source[(i + 5) % source.length]];
        normal[0] = ((vertex_one[1] - vertex_two[1]) * (vertex_one[2] + vertex_two[2]));
        normal[1] = ((vertex_one[2] - vertex_two[2]) * (vertex_one[0] + vertex_two[0]));
        normal[2] = ((vertex_one[0] - vertex_two[0]) * (vertex_one[1] + vertex_two[1]));
        normalize(normal);
        destination.push(normal[0], normal[1], normal[2]);
    }*/
}







//El delimitador es para saber que tan grande es esa parte de la columna.
function BaseColumnOne(max_height, min_height, center_x, center_y, delimiter) {
    this.position_buffer = null;
    this.normal_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.initBuffers = function() {
        var min_center_x = (center_x - delimiter);
        var max_center_x = (center_x + delimiter);
        var min_center_y = (center_y - delimiter);
        var max_center_y = (center_y + delimiter);
        var base_height = min_height;
        var top_height = max_height;
        var middle_left_x = (center_x - delimiter * 0.2);
        var middle_right_x = (center_x + delimiter * 0.2);
        var middle_left_y = (center_y - delimiter * 0.8);
        var middle_right_y = (center_y + delimiter * 0.8);
        
        this.position_buffer = [
            // Base de arriba
            middle_right_x, min_center_y, top_height,
            middle_right_x, min_center_y, top_height,
            middle_right_x, min_center_y, top_height,
            max_center_x, min_center_y, top_height,
            middle_right_x, max_center_y, top_height,
            max_center_x, max_center_y, top_height,
            middle_right_x, max_center_y, top_height,
            middle_right_x, middle_right_y, top_height,
            middle_right_x, middle_left_y, top_height,
            middle_left_x, middle_right_y, top_height,
            middle_left_x, middle_left_y, top_height,
            middle_left_x, min_center_y, top_height,
            middle_left_x, min_center_y, top_height,
            middle_left_x, min_center_y, top_height,
            min_center_x, min_center_y, top_height,
            middle_left_x, max_center_y, top_height,
            min_center_x, max_center_y, top_height,
        
            min_center_x, min_center_y, top_height,
            
            min_center_x, min_center_y, top_height,
            min_center_x, min_center_y, base_height,
            middle_left_x, min_center_y, top_height,
            middle_left_x, min_center_y, base_height,
            middle_left_x, middle_left_y, top_height,
            middle_left_x, middle_left_y, base_height,
            middle_right_x, middle_left_y, top_height,
            middle_right_x, middle_left_y, base_height,
            middle_right_x, min_center_y, top_height,
            middle_right_x, min_center_y, base_height,
            max_center_x, min_center_y, top_height,
            max_center_x, min_center_y, base_height,
            
            max_center_x, max_center_y, top_height,
            max_center_x, max_center_y, base_height,
            
            middle_right_x, max_center_y, top_height,
            middle_right_x, max_center_y, base_height,
            middle_right_x, middle_right_y, top_height,
            middle_right_x, middle_right_y, base_height,
            middle_left_x, middle_right_y, top_height,
            middle_left_x, middle_right_y, base_height,
            middle_left_x, max_center_y, top_height,
            middle_left_x, max_center_y, base_height,
            min_center_x, max_center_y, top_height,
            min_center_x, max_center_y, base_height,
            
            
            //min_center_x, max_center_y, base_height,//agregado
            
            min_center_x, min_center_y, top_height,
            min_center_x, min_center_y, base_height,
            
            min_center_x, min_center_y, base_height,
            //min_center_x, min_center_y, base_height,//agregado
            
            // Base de abajo
            min_center_x, max_center_y, base_height,
            middle_left_x, min_center_y, base_height,
            middle_left_x, max_center_y, base_height,
            middle_left_x, middle_left_y, base_height,
            middle_left_x, middle_right_y, base_height,
            middle_right_x, middle_left_y, base_height,
            middle_right_x, middle_right_y, base_height,
            middle_right_x, min_center_y, base_height,
            middle_right_x, max_center_y, base_height,
            max_center_x, min_center_y, base_height,
            max_center_x, max_center_y, base_height
        ];
        
        calcNormals(this.position_buffer, this.normal_buffer);
        //this.normal_buffer = this.position_buffer;
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(1.0);
            this.color_buffer.push(0.0);
            this.color_buffer.push(0.0);
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



//El delimitador es para saber que tan grande es esa parte de la columna.
function BaseColumnTwo(height, center_x, center_y, delimiter) {
    this.position_buffer = null;
    this.normal_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    this.initBuffers = function() {
        var base_height = height;
        var top_height = height + HEIGHT_BASE_COLUMN_TWO;

        var min_center_x_top = (center_x - delimiter);
        var max_center_x_top = (center_x + delimiter);
        var min_center_y_top = (center_y - delimiter);
        var max_center_y_top = (center_y + delimiter);
        var middle_left_x_top = (center_x - delimiter * 0.2);
        var middle_right_x_top = (center_x + delimiter * 0.2);
        var middle_left_y_top = (center_y - delimiter * 0.8);
        var middle_right_y_top = (center_y + delimiter * 0.8);
        
        var new_delimiter = delimiter + DELIMITER_DIFF;
        
        var min_center_x_base = (center_x - new_delimiter);
        var max_center_x_base = (center_x + new_delimiter);
        var min_center_y_base = (center_y - new_delimiter);
        var max_center_y_base = (center_y + new_delimiter);
        var middle_left_x_base = (center_x - new_delimiter * 0.2);
        var middle_right_x_base = (center_x + new_delimiter * 0.2);
        var middle_left_y_base = (center_y - new_delimiter * 0.8);
        var middle_right_y_base = (center_y + new_delimiter * 0.8);
        
        this.position_buffer = [
            min_center_x_top, min_center_y_top, top_height,
            min_center_x_top, min_center_y_top, top_height,
            min_center_x_top, min_center_y_top, top_height,
            min_center_x_base, min_center_y_base, base_height,
            middle_left_x_top, min_center_y_top, top_height,
            middle_left_x_base, min_center_y_base, base_height,
            middle_left_x_top, middle_left_y_top, top_height,
            middle_left_x_base, middle_left_y_base, base_height,
            middle_right_x_top, middle_left_y_top, top_height,
            middle_right_x_base, middle_left_y_base, base_height,
            middle_right_x_top, min_center_y_top, top_height,
            middle_right_x_base, min_center_y_base, base_height,
            max_center_x_top, min_center_y_top, top_height,
            max_center_x_base, min_center_y_base, base_height,
            
            max_center_x_top, max_center_y_top, top_height,
            max_center_x_base, max_center_y_base, base_height,
            
            middle_right_x_top, max_center_y_top, top_height,
            middle_right_x_base, max_center_y_base, base_height,
            middle_right_x_top, middle_right_y_top, top_height,
            middle_right_x_base, middle_right_y_base, base_height,
            middle_left_x_top, middle_right_y_top, top_height,
            middle_left_x_base, middle_right_y_base, base_height,
            middle_left_x_top, max_center_y_top, top_height,
            middle_left_x_base, max_center_y_base, base_height,
            min_center_x_top, max_center_y_top, top_height,
            min_center_x_base, max_center_y_base, base_height,
            
            min_center_x_top, min_center_y_top, top_height,
            min_center_x_base, min_center_y_base, base_height
        ];
        
        calcNormals(this.position_buffer, this.normal_buffer);
        //this.normal_buffer = this.position_buffer;
        
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.normal_buffer.length / 3; i++) {
            this.color_buffer.push(1.0);
            this.color_buffer.push(0.0);
            this.color_buffer.push(0.0);
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



function Column(first_max_height, second_max_height, third_max_height, center_x, center_y, delimiter) {
    var first_base_column_one = new BaseColumnOne(third_max_height + MIN_HEIGHT, second_max_height + MIN_HEIGHT + HEIGHT_BASE_COLUMN_TWO, center_x, center_y, delimiter);
    first_base_column_one.initBuffers();
    var first_base_column_two = new BaseColumnTwo(second_max_height + MIN_HEIGHT, center_x, center_y, delimiter);
    first_base_column_two.initBuffers();
    var second_base_column_one = new BaseColumnOne(second_max_height + MIN_HEIGHT, first_max_height + MIN_HEIGHT + HEIGHT_BASE_COLUMN_TWO, center_x, center_y, DELIMITER_DIFF + delimiter);
    second_base_column_one.initBuffers();
    var second_base_column_two = new BaseColumnTwo(first_max_height + MIN_HEIGHT, center_x, center_y, DELIMITER_DIFF + delimiter);
    second_base_column_two.initBuffers();
    var third_base_column_one = new BaseColumnOne(first_max_height + MIN_HEIGHT, MIN_HEIGHT, center_x, center_y, (2 * DELIMITER_DIFF) + delimiter);
    third_base_column_one.initBuffers();
    
    this.setupShaders = function() {
        first_base_column_one.setupShaders();
        first_base_column_two.setupShaders();
        second_base_column_one.setupShaders();
        second_base_column_two.setupShaders();
        third_base_column_one.setupShaders();
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor) {
        first_base_column_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        first_base_column_two.setupLighting(lightPosition, ambientColor, diffuseColor);
        second_base_column_one.setupLighting(lightPosition, ambientColor, diffuseColor);
        second_base_column_two.setupLighting(lightPosition, ambientColor, diffuseColor);
        third_base_column_one.setupLighting(lightPosition, ambientColor, diffuseColor);
    }

    this.draw = function(modelMatrix) { 
        first_base_column_one.draw(modelMatrix);
        first_base_column_two.draw(modelMatrix);
        second_base_column_one.draw(modelMatrix);
        second_base_column_two.draw(modelMatrix);
        third_base_column_one.draw(modelMatrix);
    }
}