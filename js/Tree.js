function Tree(points, min_height,scale) {        
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    
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

    this.fillBuffers = function(normal_buf, position_buf, color_buf, x, y, z, r, g, b) {
        normal_buf.push(x);
        normal_buf.push(y);
        normal_buf.push(z);

        color_buf.push(r);
        color_buf.push(g);
        color_buf.push(b);
        
        position_buf.push(x);
        position_buf.push(y);
        position_buf.push(z);
    }

    this.fillTexturedBuffers = function(normal_buf, position_buf, textured_buf, x, y, z, u, v) {
        normal_buf.push(x);
        normal_buf.push(y);
        normal_buf.push(z);

        textured_buf.push(u);
        textured_buf.push(v);
        
        position_buf.push(x);
        position_buf.push(y);
        position_buf.push(z);
    }

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

                    this.fillTexturedBuffers(this.normal_buffer, this.position_buffer, this.textured_buffer, x, y, z, u, v);
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;

                    if((dif_u == 0.0) && (num_section == 0)){
                        index_index_next_position_buffer = index_index_buffer;
                    }

                    x = aux_current_curve_point[0] * next_cosTheta;
                    y = aux_current_curve_point[0] * next_sinTheta;
                    z = aux_current_curve_point[1];                    
                    u -= deltaAngle;
                    this.fillTexturedBuffers(this.normal_buffer, this.position_buffer, this.textured_buffer, x, y, z, u, v);
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;
                }
            }
            index_index_buffer--;
            this.index_buffer.push(index_index_buffer);
            this.index_buffer.push(index_index_next_position_buffer);
            index_index_buffer++;
        }

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

            this.fillBuffers(this.normal_buffer_tree_base, this.position_buffer_tree_base, this.color_buffer_tree_base, x, y, z, r, g, b);
            this.index_buffer_tree_base.push(index_index_tree_base_buffer);
            index_index_tree_base_buffer++;

            z = min_height+2.0 * scale;
            this.fillBuffers(this.normal_buffer_tree_base, this.position_buffer_tree_base, this.color_buffer_tree_base, x, y, z, r, g, b);
            this.index_buffer_tree_base.push(index_index_tree_base_buffer);
            index_index_tree_base_buffer++;
        }

        ///////////////////////////////////
        //END TREE BASE
        ///////////////////////////////////
    }
    
    this.setupShaders = function(){
        //gl.useProgram(shaderProgramTexturedObject);
    }

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.lightPosition = lightPosition;
        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        //var lighting = true;
        //gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);       

        //gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, lightPosition);
        //gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, ambientColor );
        //gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, diffuseColor);
    }
    
    this.createColorBuffer = function(normal_buffer, color_buffer, position_buffer, index_buffer) {
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

    this.prepareColorDraw = function(modelMatrix, normal_buffer, color_buffer, position_buffer, index_buffer){
        gl.useProgram(shaderProgramColoredObject);
        var lighting = true;
        gl.uniform1i(shaderProgramColoredObject.useLightingUniform, lighting);
        gl.uniform3fv(shaderProgramColoredObject.lightingDirectionUniform, this.lightPosition);
        gl.uniform3fv(shaderProgramColoredObject.ambientColorUniform, this.ambientColor );
        gl.uniform3fv(shaderProgramColoredObject.directionalColorUniform, this.diffuseColor);

        this.createColorBuffer(normal_buffer, color_buffer, position_buffer, index_buffer);
        
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

    this.draw = function(modelMatrix, texture){
        this.prepareColorDraw(modelMatrix, this.normal_buffer_tree_base, this.color_buffer_tree_base, this.position_buffer_tree_base, this.index_buffer_tree_base);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        this.prepareTextureDraw(modelMatrix, this.normal_buffer, this.textured_buffer, this.position_buffer, this.index_buffer, texture);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    this.prepareTextureDraw = function(modelMatrix, normal_buffer, textured_buffer, position_buffer, index_buffer, texture){
        gl.useProgram(shaderProgramTexturedObject);
        var lighting = true;
        gl.uniform1i(shaderProgramTexturedObject.useLightingUniform, lighting);
        gl.uniform3fv(shaderProgramTexturedObject.lightingDirectionUniform, this.lightPosition);
        gl.uniform3fv(shaderProgramTexturedObject.ambientColorUniform, this.ambientColor );
        gl.uniform3fv(shaderProgramTexturedObject.directionalColorUniform, this.diffuseColor);

        this.createTexturedBuffer(normal_buffer, textured_buffer, position_buffer, index_buffer);

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
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgramTexturedObject.samplerUniform, 0);

        gl.uniformMatrix4fv(shaderProgramTexturedObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramTexturedObject.nMatrixUniform, false, normalMatrix);

        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    this.createTexturedBuffer = function(normal_buffer, textured_buffer, position_buffer, index_buffer) {
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normal_buffer.length / 3;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textured_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.textured_buffer.length / 2;

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
}