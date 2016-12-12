function Tree(points, min_height,scale) {        
    this.webgl_position_buffer_tree = null;
    this.webgl_normal_buffer_tree = null;
    this.webgl_color_buffer_tree = null;
    this.webgl_texture_coord_buffer_tree = null;
    this.webgl_index_buffer_tree = null;
    
    this.webgl_position_buffer_base = null;
    this.webgl_normal_buffer_base = null;
    this.webgl_color_buffer_base = null;
    this.webgl_texture_coord_buffer_base = null;
    this.webgl_index_buffer_base = null;

    this.position_buffer = [];
    this.normal_buffer = [];
    this.textured_buffer = [];
    this.index_buffer = [];

    this.position_buffer_tree_base = [];
    this.normal_buffer_tree_base = [];
    this.color_buffer_tree_base = [];
    this.index_buffer_tree_base = [];

    this.puntasos = points;
    this.points_aux = [];

    this.Base0 = function(u) {
        return 0.5*(1-u)*(1-u);
    }

    this.Base1 = function(u) {
        return -u*u+u+0.5;
    }
    
 
    this.Base2 = function(u) {
        return 0.5*u*u;
    }
    

    this.get_Rz = function(num_section,u) {
        // repeat the first and last items
        var points_aux = [];
        points_aux[0] = this.puntasos[0];
        for (var i=0; i<this.puntasos.length; i++) {
            points_aux[i+1] = this.puntasos[i];
        }
        points_aux[points_aux.length] = this.puntasos[this.puntasos.length-1];

        var aux = [];
        aux[0] =
        this.Base0(u) * points_aux[0+num_section][0] +      // b0R*p0R
        this.Base1(u) * points_aux[1+num_section][0] +      // b1R*p1R
        this.Base2(u) * points_aux[2+num_section][0];       // b2R*p2R
        aux[1] =
        this.Base0(u) * points_aux[0+num_section][1] +      // b0z*p0z
        this.Base1(u) * points_aux[1+num_section][1] +      // b1z*p1z
        this.Base2(u) * points_aux[2+num_section][1];       // b2z*p2z

        return aux;
    }

    this.initBuffers = function() {
        this.vertex_buffer_tree = [];
        this.vertex_buffer_base = [];

        //////////////////////////////
        // BEGINNING BODY OF THE TREE
        //////////////////////////////

        var quant_sections = points.length;

        var deltaAngle = 10.0;
        var index_index_buffer = 0;
        var index_index_next_position_buffer = 0;

        var x = 0.0;
        var y = 0.0;
        var z = 0.0;
        var u = 0.0;
        var v = 0.0;

        for(var angle = 0.0; angle <= (360.0 - deltaAngle); angle+=deltaAngle) {
            for(var num_section = 0.0; num_section < quant_sections; num_section++) {
                for(var dif_u = 0.0; dif_u <= 0.9 ; dif_u += 0.1) {

                    var aux_current_curve_point = this.get_Rz(num_section, dif_u);

                    var theta = angle * Math.PI / 180.0;
                    var next_theta = (angle+deltaAngle) * Math.PI / 180.0;

                    var cosTheta = Math.cos(theta);
                    var next_cosTheta = Math.cos(next_theta);

                    var sinTheta = Math.sin(theta);
                    var next_sinTheta = Math.sin(next_theta);

                    x = aux_current_curve_point[0] * cosTheta;
                    y = aux_current_curve_point[0] * sinTheta;
                    z = aux_current_curve_point[1];

                    u = 1.0 - (angle / 360.0);
                    v = 1.0 - ((dif_u+num_section) / (quant_sections));

                    var position = [x,y,z];
                    var normal = [x,y,z];
                    var tangent = [0,y,z]; // <--- TODO!
                    var texture = [u,v];
                    this.vertex_buffer_tree.push(new Vertice(position, position, normal, tangent, texture));
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;

                    if((dif_u == 0.0) && (num_section == 0)){
                        index_index_next_position_buffer = index_index_buffer;
                    }

                    x = aux_current_curve_point[0] * next_cosTheta;
                    y = aux_current_curve_point[0] * next_sinTheta;
                    z = aux_current_curve_point[1];                    
                    u -= (deltaAngle/360.0);

                    var position = [x,y,z];
                    var normal = [x,y,z];
                    var tangent = [0,y,z]; // <--- TODO!
                    var texture = [u,v];
                    this.vertex_buffer_tree.push(new Vertice(position, position, normal, tangent, texture));
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                }
            }
            index_index_buffer--;
            this.index_buffer.push(index_index_buffer);
            this.index_buffer.push(index_index_next_position_buffer);
            index_index_buffer++;
        }

        // Creación e Inicialización de los buffers a nivel de OpenGL
        var position_buffer = getPositionBuffer(this.vertex_buffer_tree);
        var normal_buffer = getNormalBuffer(this.vertex_buffer_tree);
        var binormal_buffer = getBinormalBuffer(this.vertex_buffer_tree);
        var tangent_buffer = getTangentBuffer(this.vertex_buffer_tree);
        var texture_coord_buffer = getTextureBuffer(this.vertex_buffer_tree);

        this.webgl_normal_buffer_tree = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer_tree);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer_tree.itemSize = 3;
        this.webgl_normal_buffer_tree.numItems = normal_buffer.length / 3;

        this.webgl_binormal_buffer_tree = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer_tree);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer_tree.itemSize = 3;
        this.webgl_binormal_buffer_tree.numItems = binormal_buffer.length / 3;

        this.webgl_tangent_buffer_tree = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer_tree);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer_tree.itemSize = 3;
        this.webgl_tangent_buffer_tree.numItems = tangent_buffer.length / 3;

        this.webgl_position_buffer_tree = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer_tree);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer_tree.itemSize = 3;
        this.webgl_position_buffer_tree.numItems = position_buffer.length / 3;

        this.webgl_index_buffer_tree = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer_tree);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer_tree.itemSize = 1;
        this.webgl_index_buffer_tree.numItems = this.index_buffer.length;

        this.webgl_texture_coord_buffer_tree = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer_tree);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer_tree.itemSize = 2;
        this.webgl_texture_coord_buffer_tree.numItems = texture_coord_buffer.length / 2;


        ///////////////////////////
        // END BODY OF THE TREE
        ///////////////////////////


        //////////////////////////////////
        //BEGGINNING TREE BASE
        //////////////////////////////////

        r = 0.2;
        g = 0.1;
        b = 0.0;

        var index_index_tree_base_buffer = 0;

        for(var angle = 0.0; angle <= 360.0; angle+=deltaAngle) {
            var theta = angle * Math.PI / 180.0;

            x = Math.cos(theta) * scale;
            y = Math.sin(theta) * scale;;
            z = min_height;

            var position = [x,y,z];
            var normal = [x,y,z];
            var tangent = [0,y,z]; // <--- TODO!
            var color = [r,g,b];
            this.vertex_buffer_base.push(new Vertice(position, color, normal, tangent, texture));
            this.index_buffer_tree_base.push(index_index_tree_base_buffer);
            index_index_tree_base_buffer++;

            z = min_height+2.0 * scale;
            position = [x,y,z];
            normal = [x,y,z];
            tangent = [0,y,z]; // <--- TODO!
            color = [r,g,b];
            this.vertex_buffer_base.push(new Vertice(position, color, normal, tangent, texture));
            this.index_buffer_tree_base.push(index_index_tree_base_buffer);
            index_index_tree_base_buffer++;
        }
          // Creación e Inicialización de los buffers a nivel de OpenGL
        var position_buffer = getPositionBuffer(this.vertex_buffer_base);
        var normal_buffer = getNormalBuffer(this.vertex_buffer_base);
        var binormal_buffer = getBinormalBuffer(this.vertex_buffer_base);
        var tangent_buffer = getTangentBuffer(this.vertex_buffer_base);
        var color_buffer = getColorBuffer(this.vertex_buffer_base);


        this.webgl_normal_buffer_base = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer_base);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer_base.itemSize = 3;
        this.webgl_normal_buffer_base.numItems = normal_buffer.length / 3;

        this.webgl_binormal_buffer_base = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer_base);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormal_buffer), gl.STATIC_DRAW);
        this.webgl_binormal_buffer_base.itemSize = 3;
        this.webgl_binormal_buffer_base.numItems = binormal_buffer.length / 3;

        this.webgl_tangent_buffer_base = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer_base);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer_base.itemSize = 3;
        this.webgl_tangent_buffer_base.numItems = tangent_buffer.length / 3;

        this.webgl_position_buffer_base = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer_base);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer_base.itemSize = 3;
        this.webgl_position_buffer_base.numItems = position_buffer.length / 3;

        this.webgl_index_buffer_base = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer_base);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer_tree_base), gl.STATIC_DRAW);
        this.webgl_index_buffer_base.itemSize = 1;
        this.webgl_index_buffer_base.numItems = this.index_buffer_tree_base.length;

        this.webgl_color_buffer_base = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer_base);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer_base.itemSize = 3;
        this.webgl_color_buffer_base.numItems = color_buffer.length / 3;


        ///////////////////////////////////
        //END TREE BASE
        ///////////////////////////////////
    }
    
    this.prepareColorDraw = function(shaderProgram, modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer_base);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer_base.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer_base);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer_base.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer_base);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer_base.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer_base);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer_base.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, true);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer_base);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_color_buffer_base.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.prepareTextureDraw = function(shaderProgram, modelMatrix, normal_buffer, textured_buffer, position_buffer, index_buffer, texture){
        // Se configuran los buffers que alimentarán el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer_tree);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.webgl_position_buffer_tree.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer_tree);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer_tree.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer_tree);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer_tree.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer_tree);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer_tree.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer_tree);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer_tree.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniformMatrix4fv(shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer_tree);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer_tree.numItems, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(shaderProgram.useNormalUniform, false);
        gl.uniform1f(shaderProgram.useReflectionUniform, 0.0);
    }

    this.draw = function(modelMatrix, texture, shaderProgram){
        this.prepareColorDraw(shaderProgram, modelMatrix, this.normal_buffer_tree_base, this.color_buffer_tree_base, this.position_buffer_tree_base, this.index_buffer_tree_base);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer_base);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer_base.numItems, gl.UNSIGNED_SHORT, 0);

        this.prepareTextureDraw(shaderProgram, modelMatrix, this.normal_buffer, this.textured_buffer, this.position_buffer, this.index_buffer, texture);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer_tree);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer_tree.numItems, gl.UNSIGNED_SHORT, 0);
    }
}