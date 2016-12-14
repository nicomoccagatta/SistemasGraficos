const NUMBER_OF_SIDES = 100;
const RADIUS_CYLINDER_ARC = 0.3;

function Arc(distance_to_floor, top_height, center_x, from, to, min_angle, max_angle) {
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_binormal_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    
    this.heights_along_arc = [[]];

    this.position_buffer = [];
    this.normal_buffer = [];
    this.binormal_buffer = [];
    this.tangent_buffer = [];
    this.texture_coord_buffer = [];
    this.index_buffer = [];

    this.position_buffer_upper_lid = [];
    this.normal_buffer_upper_lid = [];
    this.binormal_buffer_upper_lid = [];
    this.tangent_buffer_upper_lid = [];
    this.texture_buffer_upper_lid = [];
    this.index_buffer_upper_lid = [];

    this.position_buffer_lower_lid = [];
    this.normal_buffer_lower_lid = [];
    this.binormal_buffer_lower_lid = [];
    this.tangent_buffer_lower_lid = [];
    this.texture_buffer_lower_lid = [];
    this.index_buffer_lower_lid = [];

    this.fillBuffers = function(normal_buf, position_buf, tangent_buffer, texture_coord_buffer, x, y, z, u, v) {
        tangent_buffer.push(0);
        tangent_buffer.push(y/(y+z));
        tangent_buffer.push(z/(y+z));

        position_buf.push(x);
        position_buf.push(y);
        position_buf.push(z);

        texture_coord_buffer.push(u);
        texture_coord_buffer.push(v);
    }
    
    this.initBuffers = function() {
        var max_height = top_height - RADIUS_CYLINDER_ARC;
        var height = max_height - distance_to_floor;
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
            this.heights_along_arc.push([this_step_y, this_step_z]);
            
            if (angle == max_angle_aux) {
                this.fillBuffers(this.normal_buffer_lower_lid, this.position_buffer_lower_lid, this.tangent_buffer_lower_lid, this.texture_buffer_lower_lid, center_x, this_step_y, this_step_z, 0, 0);
            }
            if (angle == (min_angle + 1)) {
                this.fillBuffers(this.normal_buffer_upper_lid, this.position_buffer_upper_lid, this.tangent_buffer_upper_lid, this.texture_buffer_upper_lid,center_x, previous_step_y, previous_step_z, 0, 0);
            }
            
            for (var i = 50; i <= NUMBER_OF_SIDES + 50; i++) {
                var alpha = i * 2 * Math.PI / NUMBER_OF_SIDES;
                var sinAlpha = Math.sin(alpha);
                var cosAlpha = Math.cos(alpha);
                var x = center_x + (RADIUS_CYLINDER_ARC * cosAlpha);
                var y = previous_step_y;
                var z = previous_step_z + (RADIUS_CYLINDER_ARC * sinAlpha);
                
                var u = (angle - (min_angle+1)) / (max_angle_aux - (min_angle+1));
                var v = (i-50) / NUMBER_OF_SIDES;

                this.fillBuffers(this.normal_buffer, this.position_buffer, this.tangent_buffer, this.texture_coord_buffer, x, y, z, u, v);
                if (angle == (min_angle + 1)) {
                    this.fillBuffers(this.normal_buffer_upper_lid, this.position_buffer_upper_lid, this.tangent_buffer_upper_lid, this.texture_buffer_upper_lid, x, y, z, u, 1);
                }
                y = this_step_y;
                z = this_step_z + (RADIUS_CYLINDER_ARC * sinAlpha);
                this.fillBuffers(this.normal_buffer, this.position_buffer, this.tangent_buffer, this.texture_coord_buffer, x, y, z, u, v);
                if (angle == max_angle_aux) {
                    this.fillBuffers(this.normal_buffer_lower_lid, this.position_buffer_lower_lid, this.tangent_buffer_lower_lid, this.texture_buffer_lower_lid, x, y, z, u, 1);
                }                
            }
        }
        
        for (var i = 0; i < (NUMBER_OF_SIDES + 1) * (max_angle_aux - min_angle) * 2; i++) {
            this.index_buffer.push(i);
            if (i <= NUMBER_OF_SIDES + 1) {
                this.index_buffer_upper_lid.push(i);
                this.index_buffer_lower_lid.push(i);
            }
        }
        
        calcNormals(this.position_buffer, this.normal_buffer);
        calcNormals(this.position_buffer_lower_lid, this.normal_buffer_lower_lid);
        calcNormals(this.position_buffer_upper_lid, this.normal_buffer_upper_lid);

        this.binormal_buffer = getBinormalBufferFromVectors(this.normal_buffer, this.tangent_buffer);
        this.binormal_buffer_lower_lid = getBinormalBufferFromVectors(this.normal_buffer_lower_lid, this.tangent_buffer_lower_lid);
        this.binormal_buffer_upper_lid = getBinormalBufferFromVectors(this.normal_buffer_upper_lid, this.tangent_buffer_upper_lid);
    }
    
    this.createBuffer = function(normal_buffer, texture_coord_buffer, position_buffer, binormal_buffer, tangent_buffer, index_buffer) {
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
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = index_buffer.length;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = texture_coord_buffer.length / 2;
    }
    
    this.prepareDraw = function(shaderProgram, modelMatrix, normal_buffer, texture_coord_buffer, position_buffer, binormal_buffer, tangent_buffer, index_buffer){
        this.createBuffer(normal_buffer, texture_coord_buffer, position_buffer, binormal_buffer, tangent_buffer, index_buffer);

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
        gl.bindTexture(gl.TEXTURE_2D, cablesTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, cablesTexture);
        
        // NORMAL MAP TEXTURE
        gl.uniform1f(shaderProgram.useNormalUniform, true);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, cablesNormalTexture);
        gl.uniform1i(shaderProgram.samplerUniformNormal, 1);

        // REFLECTION TEXTURE
        gl.uniform1f(shaderProgram.useReflectionUniform, 1.0);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, skyTexture);
        gl.uniform1i(shaderProgram.samplerUniformReflection, 3);

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

    this.draw = function(modelMatrix, shaderProgram){ 
        this.prepareDraw(shaderProgram, modelMatrix, this.normal_buffer_upper_lid, this.texture_buffer_upper_lid, this.position_buffer_upper_lid, this.binormal_buffer_upper_lid, this.tangent_buffer_upper_lid, this.index_buffer_upper_lid);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(shaderProgram, modelMatrix, this.normal_buffer_lower_lid, this.texture_buffer_lower_lid, this.position_buffer_lower_lid, this.binormal_buffer_lower_lid, this.tangent_buffer_lower_lid, this.index_buffer_lower_lid);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_FAN, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(shaderProgram, modelMatrix, this.normal_buffer, this.texture_coord_buffer, this.position_buffer, this.binormal_buffer, this.tangent_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    this.getHeightsAlongArc = function() {
        return this.heights_along_arc;
    }
}