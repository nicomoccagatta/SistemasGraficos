const HEIGHT_BASE_COLUMN_TWO = 0.5;
const MIN_HEIGHT = 0;
const DELIMITER_DIFF = 0.4;


function calcNormals(source, destination) {
    /*this._calcularNormales = function(){
       
       this.normal_buffer = [];
        for (var i = 0; i < this.rows; i++){
            for (var j = 0; j < this.forma.length-2; j+=3){
                var anterior = this._posicion(i-1, j);
                var siguiente = this._posicion(i+1, j);

                var d = vec3.create();
                vec3.subtract(d, siguiente, anterior);

                var normalSuperficie = vec3.create();
                vec3.cross(normalSuperficie, d, this.tangentesCurva[j/3]);
                vec3.normalize(normalSuperficie, normalSuperficie);

                this.normal_buffer.push(normalSuperficie[0], normalSuperficie[1], normalSuperficie[2]);
            }
        }
    }*/
    
    
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
    
    
    /*for (var j = 0; j < 2; j++) {
        destination.push(0, 0, 0);
    }*///destination.push(0, 0, 0);
    var v_normal = vec3.create();
    for (var i = 0; i < source.length - 6; i += 3) {
        var index = i;
        
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
        
        /*if ((v1[0] == v2[0]) && (v1[1] == v2[1]) &&(v1[2] == v2[2]) || (v3[0] == v1[0]) && (v3[1] == v1[1]) &&(v3[2] == v1[2])) {
            destination.push(v_normal[0], v_normal[1], v_normal[2]);
        }*/
        
        
        /*if ((i % 2) != 0) {
            v1 = (-v1);
            v2 = (-v2);
            v3 = (-v3);
        }*/
        
        
        
        var u = vec3.create();
        u = subtract(v2, v1);
        var v = vec3.create();
        v = subtract(v3, v1);
        var v_final = vec3.create();
        vec3.cross(v_final, u, v);
        vec3.normalize(v_normal, v_final);
        
        
        
        if ((i % 2) != 0) {
            v_normal[0] = (-v_normal[0]);
            v_normal[1] = (-v_normal[1]);
            v_normal[2] = (-v_normal[2]);
        }
        
        
        

        destination.push(v_normal[0], v_normal[1], v_normal[2]);
        
        /*for (var j = 0; j < 2; j++) {
            destination.push(0, 0, 0);
        }*/
    }
    destination.push(v_normal[0], v_normal[1], v_normal[2]);
    destination.push(v_normal[0], v_normal[1], v_normal[2]);

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
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_binormal_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_texture_coord_buffer = null;
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
        
        var position_buffer = [
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
            
            //arranca vuelta
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
            
            min_center_x, min_center_y, top_height,
            min_center_x, min_center_y, base_height,
            
            min_center_x, min_center_y, base_height,
            
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

        var tangent_buffer = [
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  0,  0,
            1,  1,  0,
            0,  1,  0,
            1,  1,  0,
            1,  0,  0, 
            1,  1,  0,
            0,  1,  0,
            1,  1,  0,
            1,  0,  0,
            1,  1,  0,
            0,  1,  0,
            0,  1,  0,
            1,  1,  0,
            1,  0,  0,
            1,  1,  0,
            0,  1,  0,
            1,  1,  0,
            1,  0,  0,
            1,  1,  0,
            0,  1,  0,
            1,  1,  0,
            1,  0,  0,
            1,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0,
            0,  1,  0
        ];
        
        var texture_coord_buffer = [
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,
            0, 1,

            0, 1,
            0, 0,
            3/32, 1,
            3/32, 0,
            13/128, 1,
            13/128, 0,
            19/128, 1,
            19/128, 0,
            5/32, 1,
            5/32, 0,
            0.25, 1,
            0.25, 0,
            0.5, 1,
            0.5, 0,       
            19/32, 1,
            19/32, 0,
            77/128, 1,
            77/128, 0,
            83/128, 1,
            83/128, 0,
            21/32, 1,
            21/32, 0,
            0.75, 1,
            0.75, 0,
            1, 1,
            1, 0,
            1, 0,
            
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0
        ];
        
        var normal_buffer = [];
        calcNormals(position_buffer, normal_buffer);
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
        gl.bindTexture(gl.TEXTURE_2D, columnaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, columnaTexture);
        
        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, columnaNormalTexture);
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


//El delimitador es para saber que tan grande es esa parte de la columna.
function BaseColumnTwo(height, center_x, center_y, delimiter) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_binormal_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_texture_coord_buffer = null;
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
        
        var position_buffer = [
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
        
        dif_z = top_height - base_height;
        
        var tangent_buffer = [
            min_center_x_base - min_center_x_top, min_center_y_base - min_center_y_top, dif_z,
            min_center_x_base - min_center_x_top, min_center_y_base - min_center_y_top, dif_z,
            min_center_x_base - middle_left_x_top, min_center_y_base - min_center_y_top, dif_z,
            min_center_x_base - middle_left_x_top, min_center_y_base - min_center_y_top, dif_z,
            middle_left_x_base - middle_left_x_top, min_center_y_base - min_center_y_top, dif_z,
            middle_left_x_base - middle_left_x_top, middle_left_y_top - min_center_y_base, dif_z,
            middle_left_x_base - middle_left_x_top, middle_left_y_top - middle_left_y_base, dif_z,
            middle_left_x_base - middle_right_x_top, middle_left_y_top - middle_left_y_base, dif_z,
            middle_right_x_top - middle_right_x_base, middle_left_y_top - middle_left_y_base, dif_z,
            middle_right_x_base - middle_right_x_top, middle_left_y_base - min_center_y_top, dif_z,
            middle_right_x_top - middle_right_x_base, min_center_y_top - min_center_y_base, dif_z,
            middle_right_x_base - max_center_x_top, min_center_y_base - min_center_y_top, dif_z,
            max_center_x_top - max_center_x_base, min_center_y_top - min_center_y_base, dif_z,
            max_center_x_base - max_center_x_top, min_center_y_base - max_center_y_top, dif_z,
            max_center_x_top - max_center_x_base, max_center_y_top - max_center_y_base, dif_z,
            max_center_x_base - middle_right_x_top, max_center_y_base - max_center_y_top, dif_z,
            middle_right_x_top - middle_right_x_base, max_center_y_top - max_center_y_base, dif_z,
            middle_right_x_base - middle_right_x_top, max_center_y_base - middle_right_y_top, dif_z,
            middle_right_x_top - middle_right_x_base, middle_right_y_top - middle_right_y_base, dif_z,
            middle_right_x_base - middle_left_x_top, middle_right_y_base - middle_right_y_top, dif_z,
            middle_left_x_top - middle_left_x_base, middle_right_y_top - middle_right_y_base, dif_z,
            middle_left_x_base - middle_left_x_top, middle_right_y_base - max_center_y_top, dif_z,
            middle_left_x_top - middle_left_x_base, max_center_y_top - max_center_y_base, dif_z,
            middle_left_x_base - min_center_x_top, max_center_y_base - max_center_y_top, dif_z,
            min_center_x_top - min_center_x_base, max_center_y_top - max_center_y_base, dif_z,
            min_center_x_base - min_center_x_top, max_center_y_base - min_center_y_top, dif_z,
            min_center_x_top - min_center_x_base, min_center_y_top - min_center_y_base, dif_z,
            min_center_x_top - min_center_x_base, min_center_y_top - min_center_y_base, dif_z
        ];

        //TODO agregado
        var texture_coord_buffer = [
            0, 1,
            0, 1,
            0, 1,
            0, 0,
            3/32, 1,
            3/32, 0,
            13/128, 1,
            13/128, 0,
            19/128, 1,
            19/128, 0,
            5/32, 1,
            5/32, 0,
            0.25, 1,
            0.25, 0,
            0.5, 1,
            0.5, 0,
            19/32, 1,
            19/32, 0,
            77/128, 1,
            77/128, 0,
            83/128, 1,
            83/128, 0,
            21/32, 1,
            21/32, 0,
            0.75, 1,
            0.75, 0,
            1, 1,
            1, 0
        ];
        
        var normal_buffer = [];
        calcNormals(position_buffer, normal_buffer);
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
        gl.bindTexture(gl.TEXTURE_2D, columnaTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, columnaTexture);

        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, columnaNormalTexture);
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
    

    this.draw = function(modelMatrix, shaderProgram) { 
        first_base_column_one.draw(modelMatrix, shaderProgram);

        first_base_column_two.draw(modelMatrix, shaderProgram);

        second_base_column_one.draw(modelMatrix, shaderProgram);

        second_base_column_two.draw(modelMatrix, shaderProgram);

        third_base_column_one.draw(modelMatrix, shaderProgram);
    }
}