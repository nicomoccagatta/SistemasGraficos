function ArcField(from_x, to_x, from_y, to_y, diameter, min_height, max_height, points) {
	this.webgl_position_buffer = null;
	this.webgl_normal_buffer = null;
	this.webgl_binormal_buffer = null;
	this.webgl_texture_coord_buffer = null;
	this.webgl_index_buffer = null;

	this.position_buffer = [];
	this.normal_buffer = [];
	this.color_buffer = [];
	this.index_buffer = [];

	this.texture = null;
	var weakThis = this;

    this.initTexture = function(texture){
        this.texture = texture;
    }

    this.initBuffers = function() {
        this.vertex_buffer = [];

        var long_x = to_x - from_x;
        var long_y = to_y - from_y;
        var radius = diameter / 2.0;
        
        var max_center_y = to_y - radius;
        var min_center_y = from_y + radius;
        var delta_y = max_center_y - min_center_y;

        var max_x = to_x;
        var min_x = from_x;
        var delta_x = max_x - min_x;

        var quant_sections = points.length;
        var index_index_buffer = 0;

        this.curve = new BSpline(points, min_x, delta_x, min_center_y, delta_y);

        for (var num_section = 0; num_section < quant_sections; num_section++) {
            for (var dif_u = 0.0; dif_u <= 0.8 ; dif_u += 0.2) {

                var aux_center_arc = this.curve.get_center_xy(num_section, dif_u);
                var next_center_arc = this.curve.get_center_xy(num_section, dif_u+0.20);

                for (var angle = 180; angle < 362; angle++) {
                    var theta = angle * Math.PI / 180.0;
                    var height = max_height - min_height;

                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);

                    var x = aux_center_arc[0];
                    var y = aux_center_arc[1] - (radius * cosTheta);
                    var z = max_height + (height * sinTheta);
    
                    var position = [x,y,z];
                    var normal = [x,y,z];
                    var tangent = [0,y,z]; // <--- TODO!
                    var texture = [0,(angle-180.0)/182.0];
                    this.vertex_buffer.push(new Vertice(position, position, normal, tangent, texture));

                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                    
                    x = next_center_arc[0];
                    y = next_center_arc[1] - (radius * cosTheta);

                    var position = [x,y,z];
                    var normal = [x,y,z];
                    var tangent = [0,y,z]; // <--- TODO!
                    var texture = [1,(angle-180.0)/182.0];
                    this.vertex_buffer.push(new Vertice(position, position, normal, tangent, texture));

                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                }
                index_index_buffer--;
                this.index_buffer.push(index_index_buffer);
                this.index_buffer.push(index_index_buffer - 362);
                index_index_buffer++;
            }
        }

        // Creación e Inicialización de los buffers a nivel de OpenGL
        var position_buffer = getPositionBuffer(this.vertex_buffer);
        var normal_buffer = getNormalBuffer(this.vertex_buffer);
        var binormal_buffer = getBinormalBuffer(this.vertex_buffer);
        var tangent_buffer = getTangentBuffer(this.vertex_buffer);
        var texture_coord_buffer = getTextureBuffer(this.vertex_buffer);

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

    this.draw = function(modelMatrix, shaderProgram){
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
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        //gl.drawElements(gl.LINE_LOOP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }    
}