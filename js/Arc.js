const NUMBER_OF_SIDES = 100;
const RADIUS_CYLINDER_ARC = 0.3;

function Arc(distance_to_floor, top_height, center_x, from, to, min_angle, max_angle) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];
        this.position_buffer_upper_lid = [];
        this.normal_buffer_upper_lid = [];
        this.color_buffer_upper_lid = [];
        this.index_buffer_upper_lid = [];
        this.position_buffer_lower_lid = [];
        this.normal_buffer_lower_lid = [];
        this.color_buffer_lower_lid = [];
        this.index_buffer_lower_lid = [];

    this.fillBuffers = function(normal_buf, position_buf, color_buf, x, y, z) {
        normal_buf.push(x);
        normal_buf.push(y);
        normal_buf.push(z);

        color_buf.push(1.0);
        color_buf.push(0.0);
        color_buf.push(0.0);
        
        position_buf.push(x);
        position_buf.push(y);
        position_buf.push(z);
    }
    
    this.initBuffers = function() {
        var max_height = top_height - RADIUS_CYLINDER_ARC;
        var height = max_height + RADIUS_CYLINDER_ARC - distance_to_floor;
        var radius = (to - from) / 2;
        var from_aux = from + radius;
        var max_angle_aux = max_angle;
        
        if (max_angle < min_angle) {
            max_angle_aux += 360;
        }
        
        for (var angle = (min_angle + 1); angle <= max_angle_aux; angle++) {
            var theta = (angle * 2 * Math.PI) / 360;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var this_step_y = from_aux + (radius * cosTheta);
            var this_step_z = max_height + (height * sinTheta);
            var previous_step_y = from_aux + (radius * Math.cos((angle - 1) * 2 * Math.PI / 360));
            var previous_step_z = max_height + (height * Math.sin((angle - 1) * 2 * Math.PI / 360));

            for (var i = 0; i <= NUMBER_OF_SIDES; i++) {
                var alpha = i * 2 * Math.PI / NUMBER_OF_SIDES;
                var sinAlpha = Math.sin(alpha);
                var cosAlpha = Math.cos(alpha);
                var x = center_x + (RADIUS_CYLINDER_ARC * cosAlpha);
                var y = previous_step_y;
                var z = previous_step_z + (RADIUS_CYLINDER_ARC * sinAlpha);
                
                this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z);
                if (angle == (min_angle + 1)) {
                    this.fillBuffers(this.normal_buffer_upper_lid, this.position_buffer_upper_lid, this.color_buffer_upper_lid, x, y, z);
                }
                
                y = this_step_y;
                z = this_step_z + (RADIUS_CYLINDER_ARC * sinAlpha);
                this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z);
                if (angle == max_angle_aux) {
                    this.fillBuffers(this.normal_buffer_lower_lid, this.position_buffer_lower_lid, this.color_buffer_lower_lid, x, y, z);
                }
            }
        }
        
        for (var i = 0; i < (NUMBER_OF_SIDES + 1) * (max_angle_aux - min_angle) * 2; i++) {
            this.index_buffer.push(i);
            if (i <= NUMBER_OF_SIDES) {
                this.index_buffer_upper_lid.push(i);
                this.index_buffer_lower_lid.push(i);
            }
        }
    }
    
    this.createBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
        // Creacion e Inicializacion de los buffers a nivel de OpenGL
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

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        ////////////////////////////////////////////////////
        // Configuracion de la luz
        // Se inicializan las variables asociadas con la Iluminacion
        var lighting;
        lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.prepareDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        this.createBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix); 

        // Se configuran los buffers que alimentaran el pipeline
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

    this.draw = function(modelMatrix){ 
        this.prepareDraw(modelMatrix, this.normal_buffer_upper_lid, this.color_buffer_upper_lid, this.position_buffer_upper_lid, this.index_buffer_upper_lid);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(modelMatrix, this.normal_buffer_lower_lid, this.color_buffer_lower_lid, this.position_buffer_lower_lid, this.index_buffer_lower_lid);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}