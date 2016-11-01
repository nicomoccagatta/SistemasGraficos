function Tree(points) {        
    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;
    
    this.position_buffer = [];
    this.normal_buffer = [];
    this.color_buffer = [];
    this.index_buffer = [];

    this.position_buffer_tree_base = [];
    this.normal_buffer_tree_base = [];
    this.color_buffer_tree_base = [];
    this.index_buffer_tree_base = [];

    this.puntasos = points;
    this.points_aux = [];

    this.fillBuffers = function(normal_buf, position_buf, color_buf, x, y, z,r,g,b) {
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

        r = 0.0;
        g = 1.0;
        b = 0.0;

        for(var angle = 0.0; angle <= (360.0 - deltaAngle); angle+=deltaAngle) {
            for(var num_section = 0; num_section < quant_sections; num_section++) {
                for(var dif_u = 0.0; dif_u <= 0.9 ; dif_u += 0.1) {

                    var aux_current_curve_point = this.get_Rz(num_section, dif_u);
                    
                    var theta = angle * Math.PI / 180.0;
                    var next_theta = (angle+deltaAngle) * Math.PI / 180.0;

                    var cosTheta = Math.cos(theta);
                    var next_cosTheta = Math.cos(next_theta);

                    var sinTheta = Math.sin(theta);
                    var next_sinTheta = Math.sin(next_theta);

                    var x = aux_current_curve_point[0] * cosTheta;
                    var y = aux_current_curve_point[0] * sinTheta;
                    var z = aux_current_curve_point[1];
                    this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
                    this.index_buffer.push(index_index_buffer);
                    index_index_buffer++;

                    if((dif_u == 0.0) && (num_section == 0)){
                        index_index_next_position_buffer = index_index_buffer;
                    }

                    var x = aux_current_curve_point[0] * next_cosTheta;
                    var y = aux_current_curve_point[0] * next_sinTheta;
                    var z = aux_current_curve_point[1];                    
                    this.fillBuffers(this.normal_buffer, this.position_buffer, this.color_buffer, x, y, z, r, g, b);
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
        ///////////////////////////////////
        var r = 0.1;
        var g = 1.0;
        var b = 0.1;

        var x = 0;
        var y = 0;
        //var z = max_height;
        this.fillBuffers(this.normal_buffer_tree_base, this.position_buffer_tree_base, this.color_buffer_tree_base, x, y, z, r, g, b);
        this.index_buffer_tree_base.push(0000000);

        this.fillBuffers(this.normal_buffer_tree_base, this.position_buffer_tree_base, this.color_buffer_tree_base, x, y, z, r, g, b);
        this.index_buffer_tree_base.push(0000000);

        this.fillBuffers(this.normal_buffer_tree_base, this.position_buffer_tree_base, this.color_buffer_tree_base, x, y, z, r, g, b);
        this.index_buffer_tree_base.push(0000000);

        this.fillBuffers(this.normal_buffer_tree_base, this.position_buffer_tree_base, this.color_buffer_tree_base, x, y, z, r, g, b);

        ///////////////////////////////////
        //END TREE BASE
        ///////////////////////////////////
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

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
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

    this.draw = function(modelMatrix){
/*      this.prepareDraw(modelMatrix, this.normal_buffer_upper_land, this.color_buffer_upper_land, this.position_buffer_upper_land, this.index_buffer_upper_land);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        this.prepareDraw(modelMatrix, this.normal_buffer_lower_land, this.color_buffer_lower_land, this.position_buffer_lower_land, this.index_buffer_lower_land);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
*/
        this.prepareDraw(modelMatrix, this.normal_buffer, this.color_buffer, this.position_buffer, this.index_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

}